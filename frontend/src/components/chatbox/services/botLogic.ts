import type { ProductItem, ConversationState, LocalResponse } from "../types/types";
import { DELIVERY_POLICY, RECIPES, PRESERVATION_TIPS, SEAFOOD_SYNONYMS } from "../data/constants";
import { extractBudget, extractQuantity, extractSeafoodKeyword, findBestProductMatch, suggestProductsByBudget } from "../utils/chatUtils";

export function getLocalResponse(userMsg: string, products: ProductItem[], convState: ConversationState): LocalResponse {
  const msg = userMsg.toLowerCase().trim();


  if (/^(xin chào|hello|hi|chào|bắt đầu)$/.test(msg)) {
    return {
      text: "Xin chào! 👋 Mình là trợ lý AI của **FishMarket**. Mình có thể giúp bạn:\n• 🛒 Mua và tìm sản phẩm\n• 🍽️ Gợi ý món ăn / Combo\n• 📦 Kiểm tra đơn hàng\n• 🚨 Hỗ trợ khiếu nại",
      quickReplies: ["Xem sản phẩm", "Kiểm tra đơn hàng", "Thanh toán"],
    };
  }

  if (/đơn hàng.*tới đâu|kiểm tra đơn|check đơn|tình trạng đơn/.test(msg)) {
    return {
      text: "📦 Bạn vui lòng cung cấp:\n- **Mã đơn hàng** (VD: DH1023)\n- Hoặc **Số điện thoại** đặt hàng\n\nMình sẽ kiểm tra tình trạng giao hàng ngay giúp bạn nhé!",
      quickReplies: ["Liên hệ Hotline", "Xem sản phẩm"],
    };
  }

  if (/(^|\s)(không tươi|chết|hôi|hư|hỏng|khiếu nại|thất vọng)($|\s|[.,!?])/.test(msg)) {
    return {
      text: "🙏 Rất xin lỗi vì trải nghiệm chưa tốt của bạn.\n\n👉 Bạn vui lòng cung cấp giúp mình:\n1. **Mã đơn hàng**\n2. **Hình ảnh/Video** sản phẩm (nếu có)\n\nBên mình sẽ kiểm tra và hỗ trợ đổi/trả 100% ngay lập tức ạ.",
      quickReplies: ["Gọi Hotline hỗ trợ ngay"],
    };
  }

  if (/hotline|liên hệ|tổng đài|gọi/.test(msg)) {
    return {
      text: "📞 Hotline hỗ trợ 24/7 của FishMarket là: **0909 999 999**.\nBạn có thể gọi trực tiếp để được giải quyết nhanh nhất nhé!",
      quickReplies: ["Xem sản phẩm", "Kiểm tra đơn hàng"],
      newState: { stage: "idle" }
    };
  }

  // 4. DELIVERY INFO & PAYMENT - GIAO HÀNG & THANH TOÁN
  if (/ship bao lâu|giao bao lâu|chính sách giao hàng|freeship/.test(msg)) {
    return { text: DELIVERY_POLICY, quickReplies: ["Xem sản phẩm", "Cách thanh toán"] };
  }

  if (/thanh toán|cod|momo|chuyển khoản/.test(msg) && !/xem giỏ hàng/.test(msg)) {
    return {
      text: "💳 Có nhé, bên mình hỗ trợ các hình thức:\n• **COD**: Thanh toán khi nhận hàng\n• **Chuyển khoản ngân hàng**\n• **Ví điện tử** (MoMo / ZaloPay)\n\n👉 Bạn muốn mình hướng dẫn đặt hàng không?",
      quickReplies: ["Xem sản phẩm", "🛒 Xem giỏ hàng"],
    };
  }

  // 5. THANH TOÁN & GIỎ HÀNG 
  if (/thanh toán|checkout|xem giỏ hàng/.test(msg)) {
    if (convState.cart.length === 0) {
      return {
        text: "Giỏ hàng đang trống 🛒\nBạn muốn mua gì? Mình tư vấn ngay!",
        quickReplies: ["Xem sản phẩm"],
        newState: { stage: "idle", pendingProduct: undefined, pendingPrice: undefined },
      };
    }
    return {
      text: "📋 Mời bạn đến trang Giỏ hàng để kiểm tra và tiến hành thanh toán nhé!",
      quickReplies: ["🛒 Xem giỏ hàng"],
      newState: { stage: "idle" },
    };
  }

  if (/mua thêm|tiếp tục mua/.test(msg)) {
    return {
      text: "Bạn muốn mua thêm gì nè? 🐟🦐🦑\nBạn có thể gõ tên hải sản hoặc xem danh mục nhé!",
      quickReplies: ["Xem sản phẩm", "Mua tôm", "Mua cá"],
      newState: { stage: "idle" },
    };
  }

  if (/hủy|thôi|không mua nữa/.test(msg)) {
    return {
      text: "Đã hủy thao tác hiện tại. Bạn cần hỗ trợ gì khác không? 😊",
      quickReplies: ["Xem sản phẩm", "Công thức nấu ăn"],
      newState: { stage: "idle", pendingProduct: undefined, pendingPrice: undefined },
    };
  }

  // 6. COMBO SUGGESTION - GỢI Ý KẾT HỢP (BUDGET + SỐ NGƯỜI + HÌNH THỨC)
  const typeMatch = msg.match(/(lẩu|nướng|hấp|nhậu|tiệc)/);
  const mealType = typeMatch ? typeMatch[1] : "ăn";

  const peopleMatch = msg.match(/(\d+)\s*(người|ng)/);
  const peopleCount = peopleMatch ? parseInt(peopleMatch[1]) : null;

  const userBudget = extractBudget(msg);

  if (peopleCount || userBudget) {
    const targetBudget = userBudget || (peopleCount ? peopleCount * 250000 : 0);
    let suitableProducts = products;
    if (mealType === "nướng") {
      suitableProducts = products.filter(p => /mực|bạch tuộc|hàu|tôm|sò|ốc|ngao/i.test(p.name) || p.category === "nướng");
    } else if (mealType === "lẩu") {
      suitableProducts = products.filter(p => /cá|tôm|nghêu|ngao|vẹm|mực/i.test(p.name) || p.category === "lẩu");
    } else if (mealType === "hấp") {
      suitableProducts = products.filter(p => /cua|ghẹ|tôm|ngao|nghêu|mực|ốc|sò/i.test(p.name) || p.category === "hấp");
    }

    if (suitableProducts.length === 0) suitableProducts = products;

    const combo = suggestProductsByBudget(targetBudget, suitableProducts);

    if (combo.items.length > 0) {
      let introText = "👨‍👩‍👧‍👦 Mình gợi ý combo";
      if (mealType !== "ăn") introText += ` **${mealType}**`;
      if (peopleCount) introText += ` cho **${peopleCount} người**`;
      if (userBudget) introText += ` với tài chính khoảng **${userBudget.toLocaleString("vi-VN")}đ**`;
      else if (peopleCount) introText += ` (tài chính dự kiến ~${targetBudget.toLocaleString("vi-VN")}đ)`;
      introText += " nhé:\n\n";

      return {
        text: introText
          + combo.items.map(p => {
            const weight = p.weight ? p.weight : 1;
            const unit = p.unit ? p.unit : "kg";
            return `• ${p.name} - ${Number(p.price).toLocaleString("vi-VN")}đ / ${weight}${unit}`;
          }).join("\n")
          + `\n\n💰 Tổng tham khảo: ~**${combo.total.toLocaleString("vi-VN")}đ**\n👉 Bạn muốn chốt combo này không?`,
        quickReplies: ["Lấy combo này", "Đổi món khác"],
        newState: { pendingComboItems: combo.items, pendingPrice: combo.total }
      };
    }
  }

  // 7. SEARCH PRODUCT & ASK PRICE
  // 7.1. SẢN PHẨM BÁN CHẠY (BEST SELLER)
  if (/bán chạy|best seller|hot nhất|mua nhiều/.test(msg)) {
    const topProducts = [...products].sort((a, b) => Number(b.price) - Number(a.price)).slice(0, 5);
    return {
      text: `🔥 Đây là các sản phẩm bán chạy nhất hôm nay:\n\n` + topProducts.map((p) => `• ${p.name} - ${Number(p.price).toLocaleString("vi-VN")}đ`).join("\n") + `\n\n👉 Bạn muốn mình tư vấn loại nào ngon nhất không?`,
      quickReplies: ["Có tôm không", "Có cá không", "Combo 500k"],
    };
  }

  // 7.2. TÌM SẢN PHẨM & HỎI GIÁ
  if (/giá|bao nhiêu|có.*không|còn.*không|tìm/.test(msg)) {
    const kw = extractSeafoodKeyword(msg);
    if (kw) {
      const foundProducts = products.filter(p => p.name.toLowerCase().includes(kw));
      if (foundProducts.length > 0) {
        return {
          text: `🦞 Hiện bên mình đang có các loại ${kw} tươi ngon sau:\n\n`
            + foundProducts.slice(0, 4).map(p => `• **${p.name}**: ${Number(p.price).toLocaleString("vi-VN")}đ`).join("\n")
            + `\n\n💡 Giá có thể thay đổi nhẹ tùy size.\n👉 Bạn cần loại sống hay hấp sẵn để mình tư vấn?`,
          quickReplies: ["Loại sống", "Hấp sẵn", `Mua 1kg ${kw}`],
          newState: { currentKeyword: kw },
        };
      } else {
        const similarCategory = products.filter(p => p.category === SEAFOOD_SYNONYMS[kw]?.[0] || p.name.includes("tươi")).slice(0, 2);
        const similarText = similarCategory.length > 0
          ? `\n👉 Mình có thể gợi ý ${similarCategory.map(p => p.name).join(" hoặc ")} thay thế không?`
          : `\n👉 Bạn xem thử các loại bán chạy khác nhé!`;

        return {
          text: `😢 Hiện bên mình đang tạm hết hoặc không kinh doanh **${kw}** mất rồi.` + similarText,
          quickReplies: ["Xem sản phẩm khác", "Sản phẩm bán chạy"],
        };
      }
    }

    if (/giá bao nhiêu|bao nhiêu tiền|giá sao/.test(msg)) {
      return {
        text: "Bạn muốn hỏi giá sản phẩm nào nha? 🦐",
        quickReplies: ["Tôm", "Cá", "Mực"],
      };
    }
  }

  // 8. BẢO QUẢN & CÔNG THỨC NẤU ĂN
  if (/bảo quản|rã đông|cất|để được bao lâu|tươi lâu/.test(msg)) {
    const matched = Object.keys(PRESERVATION_TIPS).find((k) => msg.includes(k));
    if (matched) return { text: PRESERVATION_TIPS[matched], quickReplies: ["Xem sản phẩm", "Công thức nấu ăn"] };
    return {
      text: "Bạn muốn hỏi cách bảo quản loại hải sản nào ạ? (Ví dụ: Cá hồi, Cua, Mực...)",
      quickReplies: ["Bảo quản cá hồi", "Bảo quản cua"],
    };
  }

  const isRecipeIntent = /công thức|nấu|chế biến|cách làm/.test(msg);
  if (isRecipeIntent) {
    const matched = Object.keys(RECIPES)
      .sort((a, b) => b.length - a.length)
      .find((k) => msg.includes(k));

    if (matched) return { text: RECIPES[matched], quickReplies: ["Công thức khác", "Xem sản phẩm"] };
    return {
      text: "Bạn muốn xem công thức nấu món nào?\n🐟 Cá hồi · 🦐 Tôm · 🦑 Mực · 🦀 Cua",
      quickReplies: ["Nấu cá hồi", "Nấu tôm", "Nấu mực"],
    };
  }

  // 9. CHỐT ĐƠN / ADD TO CART 
  const buyMatch = msg.match(/(?:(?:tôi\s+)?(?:muốn\s+|cần\s+)?(?:mua|đặt|lấy|order)|cho\s+mình)\s+(.+)/);
  if (buyMatch && !/^(gì|bao nhiêu|giá)/.test(buyMatch[1].trim())) {
    const rawItem = buyMatch[1].trim();
    const found = findBestProductMatch(rawItem, products);
    const kw = extractSeafoodKeyword(rawItem) || rawItem;

    if (found || extractSeafoodKeyword(rawItem)) {
      const price = found ? Number(found.price) : 150000;
      const displayName = found?.name || (kw.charAt(0).toUpperCase() + kw.slice(1));

      const baseWeight = found?.weight ? Number(found.weight) : 1;
      const unit = found?.unit ? found.unit : "kg";

      const formatLabel = (w: number, u: string, m: number) => {
        const uLower = u.toLowerCase();
        if (uLower.includes('kg')) return `${w * m}kg`;
        if (uLower.startsWith('g')) {
          const totalG = w * m;
          return totalG >= 1000 ? `${totalG / 1000}kg` : `${totalG}g`;
        }
        return `${w * m} ${uLower.includes('con') ? 'con' : u}`;
      };

      const qtyReplies = [
        formatLabel(baseWeight, unit, 1),
        formatLabel(baseWeight, unit, 2),
        formatLabel(baseWeight, unit, 3)
      ];

      const isCloseToFreeship = price < 300000 && price > 150000;
      const upsellMsg = isCloseToFreeship ? `\n💡 *Gợi ý: Mua thêm chút Mực hoặc Nghêu để đủ 300k nhận Freeship nhé!*` : `\n👉 *Món này đang là best-seller hôm nay đó!*`;

      return {
        text: `🛒 **${displayName}** tươi rói hiện có sẵn tại FishMarket!\n\nGiá: ~**${price.toLocaleString("vi-VN")}đ / ${baseWeight}${unit}**${upsellMsg}\n\nBạn muốn lấy **bao nhiêu** để mình chuẩn bị?`,
        quickReplies: qtyReplies,
        newState: { stage: "awaiting_quantity", pendingProduct: displayName, pendingPrice: price, pendingUnit: unit, pendingWeight: baseWeight },
      };
    }
  }

  if (/(lấy|chốt|ok|oke|có)\s*(combo|này)/.test(msg)) {
    if (convState.pendingComboItems && convState.pendingComboItems.length > 0) {
      return {
        text: `✅ Đã thêm combo vào giỏ hàng 🛒\n\n` + convState.pendingComboItems.map((p) => `• ${p.name} - ${Number(p.price).toLocaleString("vi-VN")}đ`).join("\n"),
        quickReplies: ["🛒 Xem giỏ hàng", "🛒 Mua thêm"],
        newState: {
          stage: "idle",
          pendingProduct: undefined, pendingPrice: undefined, pendingComboItems: undefined,
          cart: [...convState.cart, ...convState.pendingComboItems.map((p) => ({ name: p.name, qty: "1", price: Number(p.price) }))],
        },
      };
    }
    const product = convState.pendingProduct && convState.pendingProduct.includes("Combo") ? convState.pendingProduct : "Combo Hải Sản";
    const price = convState.pendingPrice || 300000;
    return {
      text: `✅ **Đã thêm 1 ${product} vào giỏ hàng** 🛒`,
      quickReplies: ["🛒 Xem giỏ hàng", "🛒 Mua thêm"],
      newState: {
        stage: "idle",
        cart: [...convState.cart, { name: product, qty: "1", price }],
        pendingProduct: undefined, pendingPrice: undefined, pendingComboItems: undefined,
      },
    };
  }

  if (convState.stage === "awaiting_quantity") {
    const msgLower = msg.toLowerCase().replace(/,/g, '.');
    const numMatch = msgLower.match(/(\d+(?:\.\d+)?)/);

    if (numMatch) {
      const inputNum = parseFloat(numMatch[1]);
      const pUnit = (convState.pendingUnit || "kg").toLowerCase();
      const pWeight = convState.pendingWeight || 1;

      let baseInGrams = pWeight;
      if (pUnit.includes('kg')) baseInGrams = pWeight * 1000;
      else if (pUnit.startsWith('g')) baseInGrams = pWeight;

      let userInGrams = inputNum;
      if (msgLower.includes('kg')) {
        userInGrams = inputNum * 1000;
      } else if (msgLower.includes('g') && !msgLower.includes('kg')) {
        userInGrams = inputNum;
      } else {
        if (inputNum > 20 && pUnit.startsWith('g')) {
          userInGrams = inputNum;
        } else {
          userInGrams = inputNum * baseInGrams;
        }
      }

      let finalQty = Math.round(userInGrams / baseInGrams);
      if (finalQty < 1) finalQty = 1;

      const product = convState.pendingProduct || "hải sản";
      const price = convState.pendingPrice || 150000;

      let displayQtyText = `${finalQty}`;
      if (pUnit.includes('/')) displayQtyText = `${finalQty} ${pUnit.split('/')[1]}`;
      else if (pUnit.includes('con')) displayQtyText = `${finalQty} con`;
      else displayQtyText = `${finalQty} phần`;

      let noteText = "";
      if (pUnit.startsWith('g') || pUnit.includes('kg')) {
        const totalKg = (baseInGrams * finalQty) / 1000;
        noteText = ` (${totalKg >= 1 ? totalKg + 'kg' : (baseInGrams * finalQty) + 'g'})`;
      }

      return {
        text: `✅ **Đã thêm ${displayQtyText} ${product}${noteText} vào giỏ hàng** 🛒\n\nTổng tạm tính: ~**${(price * finalQty).toLocaleString("vi-VN")}đ**\n\n👉 Bạn muốn:`,
        quickReplies: ["🛒 Xem giỏ hàng", "🛒 Mua thêm"],
        newState: {
          stage: "idle",
          cart: [...convState.cart, { name: product, qty: finalQty.toString(), price }],
          pendingProduct: undefined, pendingPrice: undefined, pendingUnit: undefined, pendingWeight: undefined,
        },
      };
    }
    const bWeight = convState.pendingWeight || 1;
    const bUnit = convState.pendingUnit || "kg";
    const formatLabel = (w: number, u: string, m: number) => {
      const uLower = u.toLowerCase();
      if (uLower.includes('kg')) return `${w * m}kg`;
      if (uLower.startsWith('g')) {
        const totalG = w * m;
        return totalG >= 1000 ? `${totalG / 1000}kg` : `${totalG}g`;
      }
      return `${w * m} ${uLower.includes('con') ? 'con' : u}`;
    };

    return {
      text: `Bạn muốn mua bao nhiêu **${convState.pendingProduct}**? (ví dụ: ${formatLabel(bWeight, bUnit, 1)}, ${formatLabel(bWeight, bUnit, 2)}...)`,
      quickReplies: [formatLabel(bWeight, bUnit, 1), formatLabel(bWeight, bUnit, 2), "Hủy"],
    };
  }

  if (msg === "xem sản phẩm") {
    if (convState.currentKeyword) {
      const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(convState.currentKeyword!.toLowerCase()));
      if (filteredProducts.length > 0) {
        return {
          text: `🦐 Danh sách ${convState.currentKeyword} hiện có:\n\n` + filteredProducts.map((p) => `• ${p.name} - ${Number(p.price).toLocaleString("vi-VN")}đ`).join("\n") + `\n\n👉 Bạn muốn mua loại nào?`,
          quickReplies: ["Mua 1kg", "Loại bán chạy nhất", "Combo 500k"],
        };
      }
    }
    const topProducts = products.slice(0, 6);
    return {
      text: `🦞 Hải sản nổi bật hôm nay:\n\n` + topProducts.map((p) => `• ${p.name} - ${Number(p.price).toLocaleString("vi-VN")}đ`).join("\n"),
      quickReplies: ["Có tôm không", "Có cá không", "Combo 500k"],
    };
  }

  // 10. FALLBACK - NGOÀI LUỒNG -> ĐẨY CHO GEMINI
  return {
    text: "",
    quickReplies: [],
  };
}

// PROMPT CHO GEMINI KHI VÀO FALLBACK
export function buildSystemPrompt(products: ProductItem[], cart: any[]): string {

  const safeProducts = products || [];

  const productList = safeProducts.map((p) => {
    const price = Number(p.price || 0).toLocaleString("vi-VN");

    const weight = p.weight ? p.weight : 1;
    const unit = p.unit ? p.unit : "kg";

    return `- ${p.name}: ${price}đ / ${weight}${unit}`;
  }).join("\n");

  const safeCart = cart || [];
  const cartSummary = safeCart.length > 0
    ? `Giỏ hàng hiện tại của khách: ${safeCart.map(c => c.qty + ' ' + c.name).join(", ")}.`
    : "Giỏ hàng đang trống.";

  return `Bạn là AI Bán Hàng chuyên nghiệp của FishMarket (Đà Nẵng).
TÌNH TRẠNG HIỆN TẠI: ${cartSummary}
SẢN PHẨM SẴN CÓ THAM KHẢO:\n${productList}

BẠN PHẢI TUÂN THỦ CÁC QUY TẮC SAU (LUÔN ÁP DỤNG):
1. Không bịa ra hải sản không có trong danh sách trên. Nếu khách hỏi loại không có, hãy lịch sự từ chối và gợi ý loại tương tự.
2. Nếu khách hỏi mã đơn hàng hoặc khiếu nại (đồ ươn, hỏng), yêu cầu cung cấp "Mã đơn hàng" hoặc "Số điện thoại" để kiểm tra.
3. Chấp nhận thanh toán COD, Chuyển khoản, MoMo.
4. Đơn trên 300k được freeship, giao nội thành 2-4h. Hotline: 0909 999 999.
5. Nếu khách hỏi chuyện ngoài luồng (thời tiết, linh tinh), hãy đáp lại ngắn gọn và lái câu chuyện về hải sản.
6. Trả lời NGẮN GỌN (dưới 100 chữ), dùng bullet points và emoji (🦐). Xưng "mình" - gọi "bạn".
7. Kết thúc câu trả lời LUÔN bằng 1 câu hỏi gợi mở để chốt đơn.`;
}