import { useState, useRef, useEffect } from "react";
import "./ChatBox.css";
import { productService } from "../../services/user/productService";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

// =============================================
// TYPES
// =============================================
interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  timestamp: Date;
  quickReplies?: string[];
}

interface ProductItem {
  id: number;
  name: string;
  price: number | string;
  image?: string;
}

interface CartItem {
  name: string;
  qty: string;
  price: number;
}

interface ConversationState {
  stage: "idle" | "awaiting_quantity" | "awaiting_address" | "awaiting_phone";
  pendingProduct?: string;
  pendingPrice?: number;
  cart: CartItem[];
  address?: string;
}

// =============================================
// GEMINI CLIENT
// =============================================
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
let genAI: GoogleGenerativeAI | null = null;
if (GEMINI_API_KEY && GEMINI_API_KEY !== "your_gemini_api_key_here") {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

// =============================================
// LOCAL FALLBACK DATA
// =============================================
const DELIVERY_POLICY = `🚚 **Chính sách giao hàng của ObeSeaFood:**

• **Phạm vi giao hàng:** Toàn quốc
• **Thời gian giao hàng:**
  - Nội thành Đà Nẵng: 2–4 giờ
  - Các tỉnh lân cận: 1–2 ngày
  - Toàn quốc: 2–5 ngày làm việc
• **Phí giao hàng:**
  - Đơn hàng từ 300.000đ: **MIỄN PHÍ**
  - Đơn hàng dưới 300.000đ: 30.000đ
• **Đóng gói:** Hải sản được đóng gói cách nhiệt, đảm bảo tươi sống khi đến tay bạn
• **Theo dõi đơn hàng:** Bạn sẽ nhận được SMS/email thông báo khi đơn được xử lý
• **Hoàn trả:** Nếu hàng không đảm bảo chất lượng, chúng tôi hoàn trả 100% trong vòng 24h`;

const RECIPES: Record<string, string> = {
  "cá hồi": `🍽️ **Cá hồi áp chảo sốt chanh bơ**

**Nguyên liệu (2 người):** 400g phi lê cá hồi, 2 muỗng bơ, 2 tép tỏi, nước cốt 1 chanh, muối tiêu, dầu ô liu, ngò thì là

**Cách làm:**
1. Ướp cá với muối, tiêu 15 phút
2. Đun nóng chảo, cho dầu ô liu vào
3. Áp cá 3–4 phút mỗi mặt đến vàng giòn
4. Cho bơ + tỏi vào, rưới liên tục lên cá
5. Vắt chanh, rắc rau thơm – Dùng nóng 🍋`,

  "tôm": `🍽️ **Tôm rang me chua ngọt**

**Nguyên liệu (2 người):** 500g tôm sú, 3 muỗng nước me, 2 muỗng đường, 1 muỗng nước mắm, tỏi ớt hành tím

**Cách làm:**
1. Chiên tôm vàng đều, vớt ra
2. Phi thơm tỏi hành ớt
3. Cho me + đường + nước mắm đun đến sệt
4. Thêm tôm vào đảo đều – Dùng kèm cơm 🍚`,

  "mực": `🍽️ **Mực xào sa tế**

**Nguyên liệu (2 người):** 500g mực tươi, 2 muỗng sa tế, 1 muỗng dầu hào, tỏi sả ớt, hành lá

**Cách làm:**
1. Trần mực qua nước sôi 30 giây
2. Phi thơm tỏi sả ớt
3. Cho sa tế + dầu hào xào 1 phút
4. Thêm mực xào lửa to 2–3 phút – Dùng kèm bún 🌶️`,

  "cua": `🍽️ **Cua rang muối ớt**

**Nguyên liệu (2 người):** 1 con cua biển ~800g, muối hột, ớt đỏ, tỏi, bơ, lá chanh, tiêu xanh

**Cách làm:**
1. Chiên cua ngập dầu đến đỏ gạch
2. Rang muối hột trên chảo nóng
3. Phi thơm tỏi ớt với bơ
4. Thêm cua + muối + tiêu xanh xào đều – Dùng với bánh mì 🦀`,

  "ghẹ": `🍽️ **Ghẹ hấp bia gừng**

**Nguyên liệu (2 người):** 4 con ghẹ tươi, 1 lon bia, gừng thái lát, sả đập dập, muối tiêu chanh

**Cách làm:**
1. Cho bia + gừng + sả vào nồi
2. Xếp ghẹ lên vỉ hấp, đậy kín
3. Hấp 15–20 phút đến chín đỏ
4. Pha muối tiêu chanh chấm – Dùng nóng 🍺`,

  "cá": `🍽️ **Cá kho tộ đậm đà**

**Nguyên liệu (2 người):** 500g cá (basa/thu/trê), 3 muỗng nước mắm, 2 muỗng đường, tỏi gừng ớt tiêu, nước dừa

**Cách làm:**
1. Ướp cá với nước mắm + đường + tiêu 20 phút
2. Phi thơm tỏi gừng trong tộ
3. Xếp cá vào, đổ nước dừa xâm xấp
4. Kho 20–25 phút, thêm ớt – Dùng với cơm 🍲`,
};

// =============================================
// LOCAL FALLBACK RESPONSE
// =============================================
// Danh sách từ khoá hải sản phổ biến để nhận dạng
const SEAFOOD_KEYWORDS = [
  "tôm", "cá", "cua", "mực", "ghẹ", "sò", "ốc", "hàu", "bạch tuộc", "lươn",
  "nghêu", "ngao", "hải sản", "cá hồi", "cá thu", "cá trê", "cá basa",
  "tôm hùm", "tôm sú", "tôm mũ ni", "tôm hổ", "tôm càng", "cá lóc",
  "cá diêu hồng", "cá chép", "cá trắm", "cá mú", "cá nục", "cá ngừ",
];

// Trích xuất từ khóa hải sản từ câu hỏi người dùng
function extractSeafoodKeyword(msg: string): string | null {
  const normalized = msg.toLowerCase().trim();
  // Tìm từ khóa dài nhất khớp trong câu
  const matched = SEAFOOD_KEYWORDS
    .filter((k) => normalized.includes(k))
    .sort((a, b) => b.length - a.length); // ưu tiên từ khoá dài hơn
  return matched.length > 0 ? matched[0] : null;
}

// Kiểm tra câu có phải hỏi về sản phẩm/hải sản không
function isProductQuery(msg: string): boolean {
  const normalized = msg.toLowerCase().trim();
  const hasProductIntent = /giá|bao nhiêu|mua|bán|có không|còn không|sản phẩm|danh sách|xem sản phẩm|tìm|order|đặt|kg|kilogram|có gì|bán gì|bán không|có bán/.test(normalized);
  const hasSeafoodKeyword = extractSeafoodKeyword(normalized) !== null;
  return hasProductIntent || hasSeafoodKeyword;
}

function extractBudget(msg: string): number | null {
  const lower = msg.toLowerCase();
  // Negative lookahead: Không bắt 'k' nếu theo sau là 'g' hoặc 'm' đứng một mình (tức là 'kg', 'km')
  const kMatch = lower.match(/(\d+)\s*(k|ngàn|nghìn|củ)(?!g\b|m\b)/);
  if (kMatch) {
    if (kMatch[2] === 'củ') return parseInt(kMatch[1]) * 1000000;
    return parseInt(kMatch[1]) * 1000;
  }
  
  const normalized = lower.replace(/\s+/g, "");
  const dotMatch = normalized.match(/(\d{1,3}(?:\.\d{3})+)/);
  if (dotMatch) {
    return parseInt(dotMatch[1].replace(/\./g, ""));
  }
  const exactMatch = normalized.match(/(\d{5,})/);
  if (exactMatch) {
    return parseInt(exactMatch[1]);
  }
  return null;
}


// Trích xuất số lượng từ câu như "1kg", "500g", "2 con", "nửa kg"
function extractQuantity(msg: string): string | null {
  const n = msg.toLowerCase().replace(/\s+/g, "");
  const m = n.match(/(\d+(?:[.,]\d+)?)\s*(kg|gram|g|con|ký)/);
  if (m) return `${m[1]}${m[2]}`;
  if (/nửa/.test(n)) return "0.5kg";
  const numOnly = n.match(/^(\d+(?:[.,]\d+)?)$/);
  if (numOnly) return `${numOnly[1]}kg`;
  return null;
}

function findBestProductMatch(text: string, products: ProductItem[]): ProductItem | undefined {
  const normalized = text.toLowerCase().trim();
  const exact = products.find(p => p.name.toLowerCase().includes(normalized));
  if (exact) return exact;

  const stopWords = /tôi|muốn|cần|mua|đặt|lấy|order|cho|mình|tìm|xem|giá|bao nhiêu|có|bán|không|còn|của|là|thế nào|như thế nào|thế|như|nhỉ|nha|nhé|đi|nữa|với|gì|hôm nay|hôm|nay|đây|ở đây|nào|loại nào|các loại|những loại/g;
  const keyword = normalized.replace(stopWords, " ").replace(/\s+/g, " ").trim();
  const words = keyword.split(" ").filter(w => w.length > 1);
  
  if (words.length > 0) {
    let bestProduct: ProductItem | undefined;
    let maxScore = 0;
    for (const p of products) {
      const pName = p.name.toLowerCase();
      let score = 0;
      for (const w of words) {
        if (pName.includes(w)) score++;
      }
      if (pName.includes(keyword)) score += 5;
      if (score > maxScore) {
        maxScore = score;
        bestProduct = p;
      }
    }
    if (bestProduct) return bestProduct;
  }

  const kw = extractSeafoodKeyword(normalized);
  if (kw) return products.find(p => p.name.toLowerCase().includes(kw));
  return undefined;
}

type LocalResponse = { text: string; quickReplies?: string[]; newState?: Partial<ConversationState> };

function getLocalResponse(
  userMsg: string,
  products: ProductItem[],
  convState: ConversationState
): LocalResponse {
  const msg = userMsg.toLowerCase().trim();

  // ── COMMANDS (Override mọi stage) ────────────────────────────
  // SCENARIO 6: Thanh toán
  if (/thanh toán|checkout|💳 thanh toán|đặt hàng ngay|xem giỏ hàng|🛒 xem giỏ hàng/.test(msg)) {
    if (convState.cart.length === 0) {
      return {
        text: "Giỏ hàng của bạn đang trống 🛒\n\nBạn muốn mua gì? Mình tư vấn ngay!",
        quickReplies: ["Xem sản phẩm", "Mua tôm", "Mua cá hồi", "Mua mực"],
        newState: { stage: "idle", pendingProduct: undefined, pendingPrice: undefined },
      };
    }
    return {
      text: "📋 Mời bạn đến trang Giỏ hàng để kiểm tra và tiến hành thanh toán nhé!",
      quickReplies: ["🛒 Xem giỏ hàng"],
      newState: { stage: "idle", pendingProduct: undefined, pendingPrice: undefined },
    };
  }

  // Lệnh: Mua thêm / Tiếp tục mua
  if (/mua thêm|tiếp tục mua|🛒 mua thêm/.test(msg)) {
    return {
      text: "Bạn muốn mua thêm gì nè? 🐟🦐🦑\n\nBạn có thể gõ tên hải sản hoặc xem các danh mục bên dưới nhé!",
      quickReplies: ["Xem sản phẩm", "Mua tôm", "Mua cá", "Mua mực", "Mua cua"],
      newState: { stage: "idle", pendingProduct: undefined, pendingPrice: undefined },
    };
  }

  // Lệnh: Hủy
  if (/hủy|thôi|không mua nữa/.test(msg)) {
    return {
      text: "Đã hủy thao tác hiện tại. Bạn cần hỗ trợ gì khác không? 😊",
      quickReplies: ["Xem sản phẩm", "Công thức nấu ăn"],
      newState: { stage: "idle", pendingProduct: undefined, pendingPrice: undefined },
    };
  }

  // ── STATE MACHINE ────────────────────────────
  // Stage: đang chờ số lượng sau "mua X"
  if (convState.stage === "awaiting_quantity") {
    // Chỉ lấy số lượng thật sự, không dùng fallback thô bạo (/\d/.test(msg))
    const qty = extractQuantity(msg);
    if (qty) {
      const product = convState.pendingProduct || "hải sản";
      const price = convState.pendingPrice || 150000;
      const UPSELL: Record<string, string> = {
        tôm: "mực 🦑 hoặc nghêu 🐚",
        mực: "tôm 🦐 hoặc sò 🐚",
        cá: "tôm 🦐 hoặc mực 🦑",
        cua: "nghêu 🐚 hoặc tôm 🦐",
        ghẹ: "tôm 🦐 hoặc sò 🐚",
      };
      const upsellKey = Object.keys(UPSELL).find((k) => product.toLowerCase().includes(k));
      const upsellLine = upsellKey
        ? `\n\n💡 **Gợi ý:** Thêm ${UPSELL[upsellKey]} → **giảm 10%** và nấu ngon hơn!`
        : "";
      return {
        text: `✅ **Đã thêm ${qty} ${product} vào giỏ hàng** 🛒\n\nTổng tạm tính: ~**${price.toLocaleString("vi-VN")}đ**${upsellLine}\n\n👉 Bạn muốn:`,
        quickReplies: ["🛒 Xem giỏ hàng", "🛒 Mua thêm", "Chính sách giao hàng"],
        newState: {
          stage: "idle",
          cart: [...convState.cart, { name: product, qty, price }],
          pendingProduct: undefined,
          pendingPrice: undefined,
        },
      };
    }
    return {
      text: `Bạn muốn mua bao nhiêu **${convState.pendingProduct}**? (ví dụ: 1kg, 500g, 2 con)`,
      quickReplies: ["0.5kg", "1kg", "2kg", "Hủy"],
    };
  }

  // Stage: đang chờ địa chỉ
  if (convState.stage === "awaiting_address") {
    if (userMsg.trim().length > 5) {
      return {
        text: "📍 Đã lưu địa chỉ! Bạn cho mình **số điện thoại** để xác nhận đơn nhé 📞",
        quickReplies: [],
        newState: { stage: "awaiting_phone", address: userMsg.trim() },
      };
    }
    return { text: "Bạn nhập địa chỉ giao hàng đầy đủ giúp mình nhé 📍", quickReplies: [] };
  }

  // Stage: đang chờ SĐT
  if (convState.stage === "awaiting_phone") {
    const phone = userMsg.match(/\d{9,11}/)?.[0];
    if (phone) {
      const cartText =
        convState.cart.length > 0
          ? convState.cart.map((i) => `• ${i.qty} ${i.name}: ~${i.price.toLocaleString("vi-VN")}đ`).join("\n")
          : "• Đơn hàng của bạn";
      return {
        text: `✅ **Đơn hàng đã xác nhận!** 🎉\n\n${cartText}\n\n📍 ${convState.address}\n📞 ${phone}\n\n🚚 **Giao trong 1–2 giờ** — Mình sẽ liên hệ xác nhận ngay!`,
        quickReplies: ["Mua thêm sản phẩm", "Xem chính sách giao hàng"],
        newState: { stage: "idle", cart: [], address: undefined },
      };
    }
    return { text: "Bạn nhập số điện thoại để mình xác nhận đơn nhé 📞", quickReplies: [] };
  }

  // ── INTENT DETECTION ─────────────────────────
  const isPriceOrProduct =
    /giá|bao nhiêu|mua|bán|có không|còn không|sản phẩm|danh sách|xem sản phẩm|tìm|order|đặt|kg|kilogram/.test(msg);
  const isRecipeIntent =
    /công thức|nấu|chế biến|cách làm|cách nấu|làm món|recipe/.test(msg);
  const containsSeafoodName =
    SEAFOOD_KEYWORDS.some((k) => msg.includes(k)) ||
    products.some((p) => msg.split(" ").some((w) => w.length > 2 && p.name.toLowerCase().includes(w)));

  // Greeting
  if (/^(xin chào|hello|hi|chào|hey|alo|ok|oke|bắt đầu)$/.test(msg)) {
    return {
      text: "Xin chào! 👋 Tôi là trợ lý AI của **ObeSeaFood**. Tôi có thể giúp bạn:\n\n• 🐟 Thông tin về sản phẩm hải sản\n• 🍽️ Công thức nấu món từ hải sản\n• 🚚 Chính sách giao hàng\n\nBạn cần tư vấn gì không?",
      quickReplies: ["Xem sản phẩm", "Công thức nấu ăn", "Chính sách giao hàng"],
    };
  }



  // SCENARIO 4: Lẩu
  if (/lẩu|nấu lẩu|hotpot/.test(msg) && !isRecipeIntent) {
    return {
      text: "Để nấu lẩu ngon 🍲 bạn nên chọn:\n\n• 🦐 **Tôm** (ngọt nước)\n• 🦑 **Mực** (giòn dai)\n• 🐟 **Cá** (béo thơm)\n• 🐚 **Nghêu** (tăng vị ngọt)\n\n👉 Bạn muốn:",
      quickReplies: ["🛒 Combo lẩu sẵn", "Nguyên liệu riêng", "Xem giá tôm"],
    };
  }

  // SCENARIO 4: Nướng
  if (/nướng|bbq|barbecue/.test(msg) && !isRecipeIntent) {
    return {
      text: "Hải sản nướng ngon nhất 🔥:\n\n• 🦑 **Mực nướng sa tế**\n• 🦐 **Tôm nướng muối ớt**\n• 🐚 **Sò nướng mỡ hành**\n• 🦀 **Ghẹ nướng muối ớt**\n\nMình có **combo nướng sẵn** 👍\nBạn muốn xem không?",
      quickReplies: ["Xem combo nướng", "Mua tôm", "Mua mực"],
    };
  }

  // SCENARIO 4: Hấp
  if (/hấp/.test(msg) && !isRecipeIntent && !isPriceOrProduct) {
    return {
      text: "Hải sản hấp tươi ngon 🍽️:\n\n• 🦐 **Tôm hấp bia** (ngọt giòn)\n• 🦀 **Cua hấp gừng** (béo ngậy)\n• 🐚 **Sò hấp sả** (thơm)\n• 🐟 **Cá hấp gừng hành**\n\n👉 Bạn muốn combo hấp hay nguyên liệu riêng?",
      quickReplies: ["Combo hấp", "Nguyên liệu riêng"],
    };
  }

  // SCENARIO 5: Đặt mua — bắt nhiều dạng câu tự nhiên
  const buyMatch = msg.match(
    /(?:(?:tôi\s+)?(?:muốn\s+|cần\s+)?(?:mua|đặt|lấy|order)|cho\s+mình)\s+(.+)/
  );
  if (buyMatch) {
    const rawItem = buyMatch[1].trim();
    // Loại trừ các câu hỏi mở
    if (!/^(gì|được gì|cái gì|những gì|với|tầm|giá|ở đây|bao nhiêu)$/.test(rawItem)) {
      const found = findBestProductMatch(rawItem, products);
      const kw = extractSeafoodKeyword(rawItem) || rawItem;
      // Chỉ kích hoạt khi tìm thấy sản phẩm hoặc là keyword hải sản hợp lệ
      if (found || extractSeafoodKeyword(rawItem)) {
        const price = found ? Number(found.price) : 150000;
        const displayName = found?.name || (kw.charAt(0).toUpperCase() + kw.slice(1));
        return {
          text: `🛒 **${displayName}** hiện có tại ObeSeaFood!\n\nGiá: ~**${price.toLocaleString("vi-VN")}đ/kg**\n\nBạn muốn mua **bao nhiêu**?`,
          quickReplies: ["0.5kg", "1kg", "2kg"],
          newState: { stage: "awaiting_quantity", pendingProduct: displayName, pendingPrice: price },
        };
      }
    }
  }

  // SCENARIO 7: Ship bao lâu
  if (/ship bao lâu|giao bao lâu|bao lâu giao|thời gian giao/.test(msg)) {
    return {
      text: "🚚 **Thời gian giao hàng:**\n\n• 🏙️ **Nội thành Đà Nẵng:** 1–2 giờ\n• 🌆 **Ngoại thành:** 1 ngày\n• 🗺️ **Toàn quốc:** 2–5 ngày\n\nGiao nhanh, đảm bảo tươi ngon 🐟",
      quickReplies: ["Có freeship không?", "Xem sản phẩm"],
    };
  }

  // SCENARIO 7: Freeship
  if (/freeship|miễn phí ship|free ship/.test(msg)) {
    return {
      text: "🎁 **Freeship** cho đơn từ **300.000đ** nhé 👍\n\nĐơn dưới 300k phí ship chỉ **30.000đ** thôi!",
      quickReplies: ["Xem sản phẩm", "Mua tôm"],
    };
  }

  // SCENARIO 8: Chất lượng
  if (/tươi không|có tươi|chất lượng|tươi sống|còn sống/.test(msg)) {
    return {
      text: "🦐 **Cam kết của ObeSeaFood:**\n\n• ✅ Hải sản **tươi sống 100%**\n• ✅ Đổi trả ngay nếu không hài lòng\n• ✅ Đóng gói cách nhiệt, giữ tươi trong vận chuyển\n\nBạn cần mình tư vấn loại ngon nhất không?",
      quickReplies: ["Tư vấn theo món", "Xem sản phẩm"],
    };
  }

  // SCENARIO 9: Khiếu nại
  if (/không tươi|hàng hỏng|chết|ươn|khiếu nại|đổi trả|hoàn tiền/.test(msg)) {
    return {
      text: "Mình rất xin lỗi vì sự cố này 🙏\n\nBạn cho mình xin:\n📦 **Mã đơn hàng**\n📸 **Hình ảnh sản phẩm**\n\n→ Mình xử lý ngay trong **5 phút**!",
      quickReplies: ["Liên hệ hotline", "Chính sách hoàn trả"],
    };
  }

  // Delivery policy (chung)
  if (/giao hàng|vận chuyển|phí ship|ship|thời gian giao|đóng gói|hoàn trả|chính sách/.test(msg)) {
    return { text: DELIVERY_POLICY, quickReplies: ["Xem sản phẩm", "Công thức nấu ăn"] };
  }

  // Contact
  if (/liên hệ|hỗ trợ|điện thoại|email|địa chỉ|hotline/.test(msg)) {
    return {
      text: "📞 **Liên hệ ObeSeaFood:**\n\n• Địa chỉ: 999 Nguyễn Tất Thành, Đà Nẵng\n• Hotline: **0909 999 999**\n• Email: fishmarket@gmail.com\n• Giờ làm việc: 7:00 – 21:00",
      quickReplies: ["Chính sách giao hàng", "Xem sản phẩm"],
    };
  }

  // Promotions
  if (/khuyến mãi|giảm giá|voucher|coupon|ưu đãi/.test(msg)) {
    return {
      text: "🎉 **Ưu đãi hiện có:**\n\n• Freeship đơn từ **300.000đ**\n• Giảm 10% đơn đầu tiên: mã **WELCOME10**\n• Flash sale 12:00 và 20:00 hàng ngày 🔥",
      quickReplies: ["Xem sản phẩm", "Chính sách giao hàng"],
    };
  }

  // Recipe
  if (isRecipeIntent && !isPriceOrProduct) {
    const matched = Object.keys(RECIPES).find((k) => msg.includes(k));
    if (matched) return { text: RECIPES[matched], quickReplies: ["Công thức khác", "Xem sản phẩm"] };
    return {
      text: "Bạn muốn xem công thức nấu món nào?\n\n🐟 Cá hồi · 🦐 Tôm · 🦑 Mực · 🦀 Cua · 🦞 Ghẹ · 🐟 Cá kho",
      quickReplies: ["Nấu cá hồi", "Nấu tôm", "Nấu mực", "Nấu cua", "Nấu ghẹ"],
    };
  }

  if (msg === "công thức nấu ăn" || msg === "công thức khác") {
    return {
      text: "Bạn muốn xem công thức nấu món nào?\n\n🐟 Cá hồi · 🦐 Tôm · 🦑 Mực · 🦀 Cua · 🦞 Ghẹ · 🐟 Cá kho",
      quickReplies: ["Nấu cá hồi", "Nấu tôm", "Nấu mực", "Nấu cua", "Nấu ghẹ"],
    };
  }

  // Product / Price search
  if (isPriceOrProduct || containsSeafoodName || msg === "xem sản phẩm") {
    let matched: ProductItem[] = [];
    let isBudgetSearch = false;
    const budget = extractBudget(msg);

    if (budget && budget > 0) {
      isBudgetSearch = true;
      matched = products.filter((p) => Number(p.price) <= budget).sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      const stopWords = /tôi|muốn|cần|mua|đặt|lấy|order|cho|mình|tìm|xem|giá|bao nhiêu|có|bán|không|còn|của|là|thế nào|như thế nào|thế|như|nhỉ|nha|nhé|đi|nữa|với|gì|hôm nay|hôm|nay|đây|ở đây|nào|loại nào|các loại|những loại/g;
      const keyword = msg.toLowerCase().replace(stopWords, " ").replace(/\s+/g, " ").trim();
      const words = keyword.split(" ").filter(w => w.length > 1);
      const scored = products.map(p => {
        let score = 0;
        const pName = p.name.toLowerCase();
        words.forEach(w => { if (pName.includes(w)) score++; });
        if (pName.includes(keyword)) score += 5;
        return { p, score };
      }).filter(item => item.score > 0);
      scored.sort((a, b) => b.score - a.score);
      matched = scored.map(item => item.p);
    }

    if (matched.length > 0) {
      const list = matched.slice(0, 5).map((p) => `• **${p.name}**: ${Number(p.price).toLocaleString("vi-VN")}đ`).join("\n");
      const intro = isBudgetSearch
        ? `🛍️ **Hải sản có giá dưới ${budget?.toLocaleString("vi-VN")}đ:**\n\n`
        : `🛍️ **Thông tin sản phẩm:**\n\n`;
      return {
        text: `${intro}${list}\n\n👉 Xem chi tiết tại [Cửa hàng](/shop-grid)`,
        quickReplies: ["Chính sách giao hàng", "Công thức nấu ăn"],
      };
    }

    const notFound = isBudgetSearch
      ? `Rất tiếc, chưa có sản phẩm nào dưới mức giá ${budget?.toLocaleString("vi-VN")}đ. `
      : containsSeafoodName && !isPriceOrProduct
      ? `Rất tiếc, chưa có thông tin sản phẩm bạn hỏi. `
      : "";

    if (products.length > 0) {
      const list = products.slice(0, 5).map((p, i) => `${i + 1}. **${p.name}** — ${Number(p.price).toLocaleString("vi-VN")}đ`).join("\n");
      return {
        text: `${notFound}🛍️ **Sản phẩm nổi bật:**\n\n${list}\n\n👉 Xem tất cả tại [Cửa hàng](/shop-grid)`,
        quickReplies: ["Chính sách giao hàng", "Công thức nấu ăn"],
      };
    }
    return {
      text: `${notFound}Chúng tôi có đa dạng hải sản tươi: cá, tôm, cua, mực, ghẹ, sò,... Xem tại [Cửa hàng](/shop-grid) nhé!`,
      quickReplies: ["Chính sách giao hàng", "Công thức nấu ăn"],
    };
  }

  // Fallback
  return {
    text: "Tôi có thể giúp bạn tìm hiểu về:\n\n• 🐟 **Giá sản phẩm** — gõ tên hải sản bạn muốn hỏi\n• 🍽️ **Công thức nấu ăn** — gõ tên món như: tôm, cua, cá hồi\n• 🚚 **Chính sách giao hàng**\n• 📞 **Liên hệ hỗ trợ**",
    quickReplies: ["Xem sản phẩm", "Công thức nấu ăn", "Chính sách giao hàng"],
  };
}

// =============================================
// BUILD SYSTEM PROMPT
// =============================================
function buildSystemPrompt(products: ProductItem[]): string {
  const productList = products
    .slice(0, 20)
    .map((p) => `- ${p.name}: ${Number(p.price).toLocaleString("vi-VN")}đ`)
    .join("\n");

  return `Bạn là trợ lý AI chăm sóc khách hàng của cửa hàng hải sản tươi sống ObeSeaFood (Đà Nẵng).
Nhiệm vụ của bạn là tư vấn bán hàng, chốt đơn, và giải đáp thắc mắc chuyên nghiệp, thân thiện.

THÔNG TIN CỬA HÀNG:
- Địa chỉ: 999 Nguyễn Tất Thành, Đà Nẵng
- Hotline: 0909 999 999
- Giao hàng: 1-2h nội thành, freeship đơn từ 300k (dưới 300k phí 30k).
- Cam kết: Tươi sống 100%, đổi trả ngay nếu không hài lòng.
- Danh sách sản phẩm tiêu biểu:
${productList}

BẠN PHẢI ÁP DỤNG CÁC KỊCH BẢN (SCENARIOS) SAU KHI TƯƠNG TÁC:
1. KHÁCH MỚI (CHƯA BIẾT MUA GÌ): Chào hỏi, gợi ý món theo hoàn cảnh (Trời nóng -> lẩu; Nhậu -> nướng; Gia đình -> hấp/canh) và hỏi khách đi mấy người.
2. TÌM SẢN PHẨM: Nếu khách hỏi "có tôm không", dùng dữ liệu Hệ thống mớm cho để báo giá. Nếu khách cần "rẻ", ưu tiên món giá thấp. Luôn gợi ý "Bạn muốn xem chi tiết hay thêm vào giỏ?".
3. TƯ VẤN NGÂN SÁCH ("300k mua gì"): Lên combo phù hợp với số tiền (VD: 500g tôm + 300g mực) và hỏi họ muốn lấy combo không.
4. TƯ VẤN MÓN ("nấu lẩu", "nướng"): Gợi ý hải sản phù hợp (Lẩu: tôm, mực, nghêu; Nướng: mực sa tế, hàu). Gợi ý bán "combo sẵn".
5. ĐẶT HÀNG ("mua tôm", "lấy 1kg"): Xác nhận số lượng, giả định báo "✅ Đã thêm vào giỏ. Tổng: ...đ", hỏi khách có muốn "Xem giỏ hàng" hay mua thêm.
6. THANH TOÁN: Hướng dẫn khách click vào nút "Xem giỏ hàng" để đến trang giỏ hàng và tiến hành thanh toán.
7. GIAO HÀNG & CHẤT LƯỢNG: Trả lời tự tin về freeship 300k, giao 1-2h, cam kết tươi sống 100%.
8. KHIẾU NẠI ("không tươi"): Xin lỗi ngay lập tức, xin mã đơn và ảnh chụp để xử lý trong 5 phút.
9. UPSELL / CROSS-SELL: Khi khách định mua tôm, gợi ý mua thêm nghêu/mực để nấu ngon hơn và được ưu đãi.

QUY TẮC CỐT LÕI:
- Phản hồi NGẮN GỌN (dưới 100 chữ), dùng định dạng danh sách (bullet points) cho dễ đọc.
- Sử dụng emoji sinh động (🦐🦑🦀).
- Xưng "mình" - gọi "bạn".
- LUÔN kết thúc câu trả lời bằng một câu hỏi mở hoặc gọi ý hành động (Call-to-Action) để điều hướng khách.`;
}

// =============================================
// CHAT HISTORY (dùng cho Gemini multi-turn)
// =============================================
let msgIdCounter = 1;

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: msgIdCounter++,
      role: "bot",
      text: "Xin chào! 👋 Tôi là trợ lý AI của **ObeSeaFood**. Tôi có thể giúp bạn tư vấn về sản phẩm hải sản, công thức nấu ăn và chính sách giao hàng!",
      timestamp: new Date(),
      quickReplies: ["Xem sản phẩm", "Công thức nấu ăn", "Chính sách giao hàng"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [usingGemini, setUsingGemini] = useState(!!genAI);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Trạng thái kéo thả
  const positionRef = useRef({ x: 0, y: 0 });
  const [renderPos, setRenderPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Lưu chat history cho Gemini multi-turn
  const chatHistoryRef = useRef<{ role: "user" | "model"; parts: { text: string }[] }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversation state (ordering flow)
  const convStateRef = useRef<ConversationState>({ stage: "idle", cart: [] });

  // Abandoned cart timer (Scenario 10)
  const abandonedCartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging.current) return;
      e.preventDefault();
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      positionRef.current = {
        x: positionRef.current.x + dx,
        y: positionRef.current.y + dy,
      };
      dragStart.current = { x: e.clientX, y: e.clientY };
      setRenderPos({ ...positionRef.current });
    }
    function handleMouseUp() {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.userSelect = 'auto'; // Khôi phục chọn văn bản
      }
    }
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function handleMouseDown(e: React.MouseEvent<Element>) {
    // Không drag nếu click vào nút tắt
    if ((e.target as HTMLElement).closest('.chatbox-close-btn')) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    document.body.style.userSelect = 'none'; // Ngăn bôi đen khi kéo
  }

  useEffect(() => {
    productService
      .getHome()
      .then((res) => {
        // Backend API trả về dữ liệu nằm trong res.data.data
        const data = res.data?.data || res.data;
        const list: ProductItem[] = [
          ...(data.best_sellers || []),
          ...(data.fresh || []),
          ...(data.imported || []),
          ...(data.shellfish || []),
          ...(data.crab || []),
          ...(data.shrimp || [])
        ];
        
        // Lọc trùng lặp sản phẩm (vì một sản phẩm có thể thuộc nhiều danh mục)
        const uniqueList = Array.from(new Map(list.map(p => [p.id, p])).values());
        
        setProducts(uniqueList);
      })
      .catch((err) => console.log("Chatbox failed to load products", err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // SCENARIO 12: Returning customer detection
  useEffect(() => {
    const lastProduct = localStorage.getItem("obseafood_last_product");
    if (lastProduct) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: msgIdCounter++,
            role: "bot" as const,
            text: `Chào bạn quay lại! 👋\n\nLần trước bạn quan tâm đến **${lastProduct}** 🦐\n👉 Hôm nay mình có loại mới tươi hơn, bạn muốn xem không?`,
            timestamp: new Date(),
            quickReplies: [`Xem ${lastProduct}`, "Xem sản phẩm mới", "Không, cảm ơn"],
          },
        ]);
      }, 800);
    }
    localStorage.setItem("obseafood_last_visit", new Date().toISOString());
  }, []);

  // SCENARIO 10: Abandoned cart reminder khi chat mở
  useEffect(() => {
    if (open) {
      // Reset timer mỗi lần mở
      if (abandonedCartTimerRef.current) clearTimeout(abandonedCartTimerRef.current);
      abandonedCartTimerRef.current = setTimeout(() => {
        if (convStateRef.current.cart.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              id: msgIdCounter++,
              role: "bot" as const,
              text: "Bạn vẫn còn sản phẩm trong giỏ hàng 🛒\n\n🎁 Đặt ngay để nhận **giảm 10%**!\n\n👉 Xem giỏ hàng luôn nhé?",
              timestamp: new Date(),
              quickReplies: ["🛒 Xem giỏ hàng", "Tiếp tục mua"],
            },
          ]);
        }
      }, 5 * 60 * 1000); // 5 phút (demo), production dùng 30 phút
    } else {
      if (abandonedCartTimerRef.current) clearTimeout(abandonedCartTimerRef.current);
    }
    return () => {
      if (abandonedCartTimerRef.current) clearTimeout(abandonedCartTimerRef.current);
    };
  }, [open]);

  // ——————————————————————————————
  // Call Gemini API
  // ——————————————————————————————
  async function callGemini(userText: string, dynamicContext: string = ""): Promise<string> {
    if (!genAI) throw new Error("Gemini not initialized");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const promptText = dynamicContext ? `${userText}\n${dynamicContext}` : userText;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: buildSystemPrompt(products) }],
        },
        {
          role: "model",
          parts: [{ text: "Xin chào! Tôi đã sẵn sàng tư vấn về hải sản ObeSeaFood. Bạn cần hỗ trợ gì?" }],
        },
        // Thêm lịch sử hội thoại trước
        ...chatHistoryRef.current,
      ],
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(promptText);
    const responseText = result.response.text();

    // Lưu lịch sử (chỉ lưu userText để AI không bị rối bởi context ẩn)
    chatHistoryRef.current.push(
      { role: "user", parts: [{ text: userText }] },
      { role: "model", parts: [{ text: responseText }] }
    );

    return responseText;
  }

  async function getOrFetchProducts(): Promise<ProductItem[]> {
    if (products.length > 0) return products;
    try {
      const res = await productService.getHome();
      const data = res.data?.data || res.data;
      const list: ProductItem[] = [
        ...(data.best_sellers || []),
        ...(data.fresh || []),
        ...(data.imported || []),
        ...(data.shellfish || []),
        ...(data.crab || []),
        ...(data.shrimp || [])
      ];
      const uniqueList = Array.from(new Map(list.map(p => [p.id, p])).values());
      setProducts(uniqueList);
      return uniqueList;
    } catch {
      return [];
    }
  }

  // ——————————————————————————————
  // Tìm sản phẩm từ DB theo từ khoá
  // ——————————————————————————————
  async function searchProductsAndRespond(keyword: string, currentProducts: ProductItem[]): Promise<{ text: string; quickReplies?: string[] }> {
    try {
      const res = await productService.search(keyword);
      // Backend có thể trả về { data: [...] } hoặc trực tiếp mảng
      const raw = res.data;
      const list: ProductItem[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      if (list.length > 0) {
        const lines = list
          .slice(0, 6)
          .map(
            (p) =>
              `• **${p.name}**: ${Number(p.price).toLocaleString("vi-VN")}đ`
          )
          .join("\n");
        return {
          text: `🛍️ **Sản phẩm "${keyword}" hiện có tại ObeSeaFood:**\n\n${lines}\n\n👉 Xem thêm tại [Cửa hàng](/shop-grid)`,
          quickReplies: ["Chính sách giao hàng", "Công thức nấu ăn"],
        };
      } else {
        return {
          text: `😔 Hiện tại chúng tôi chưa có sản phẩm **"${keyword}"** trong kho.\n\nBạn có thể xem các sản phẩm khác tại [Cửa hàng](/shop-grid) hoặc liên hệ **0909 999 999** để đặt trước nhé!`,
          quickReplies: ["Xem sản phẩm", "Chính sách giao hàng"],
        };
      }
    } catch {
      // Nếu API lỗi, fallback sang local
      return getLocalResponse(keyword, currentProducts, convStateRef.current);
    }
  }

  // ——————————————————————————————
  // Send message
  // ——————————————————————————————
  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    if (trimmed.toLowerCase() === "🛒 xem giỏ hàng" || trimmed.toLowerCase() === "xem giỏ hàng") {
      navigate("/shoping-cart");
      setOpen(false);
      return;
    }

    const userMsg: Message = {
      id: msgIdCounter++,
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      let responseText: string;
      let quickReplies: string[] | undefined;
      const safeProducts = await getOrFetchProducts();

      if (genAI && usingGemini) {
        let dynamicContext = "";
        const seafoodKw = extractSeafoodKeyword(trimmed.toLowerCase());
        const isRecipeIntent = /công thức|nấu|chế biến|cách làm|cách nấu|làm món|recipe/.test(trimmed.toLowerCase());
        
        const stopWordsSearch = /tôi|muốn|cần|mua|đặt|lấy|order|cho|mình|tìm|xem|giá|bao nhiêu|có|bán|không|còn|của|là|thế nào|như thế nào|thế|như|nhỉ|nha|nhé|đi|nữa|với|gì|hôm nay|hôm|nay|đây|ở đây|nào|loại nào|các loại|những loại/g;
        const cleanedQuery = trimmed.toLowerCase().replace(stopWordsSearch, " ").replace(/\s+/g, " ").trim();
        const searchKw = cleanedQuery.length > 1 ? cleanedQuery : (seafoodKw || trimmed.toLowerCase());

        // Cung cấp bối cảnh sản phẩm từ DB cho AI để tư vấn chuẩn xác hơn
        if (isProductQuery(trimmed) && seafoodKw && !isRecipeIntent) {
          try {
            const res = await productService.search(searchKw);
            const raw = res.data;
            const list: ProductItem[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
            if (list.length > 0) {
              const lines = list.slice(0, 5).map(p => `- ${p.name}: ${Number(p.price).toLocaleString("vi-VN")}đ`).join("\n");
              dynamicContext = `\n[Hệ thống ẩn: Kết quả tìm kiếm DB cho "${searchKw}":\n${lines}\nHãy ưu tiên dùng dữ liệu này để tư vấn báo giá cho khách]`;
            } else {
              dynamicContext = `\n[Hệ thống ẩn: Không tìm thấy "${searchKw}" trong DB. Hãy báo hết hàng nhẹ nhàng và gợi ý hải sản khác]`;
            }
          } catch { /* ignore: search error, dynamicContext stays empty */ }
        }

        responseText = await callGemini(trimmed, dynamicContext);
        quickReplies = getQuickRepliesFromContext(trimmed);
      } else {
        // Fallback local khi không có Gemini — dùng state machine
        const conv = convStateRef.current;
        const seafoodKw = extractSeafoodKeyword(trimmed.toLowerCase());
        const isRecipeIntent = /công thức|nấu|chế biến|cách làm|cách nấu|làm món|recipe/.test(trimmed.toLowerCase());

        // Buy intent pattern — phải kiểm tra TRƯỚC isProductQuery
        const hasBuyIntent = /(?:(?:tôi\s+)?(?:muốn\s+|cần\s+)?(?:mua|đặt|lấy|order)|cho\s+mình)\s+(?!(?:được\s+gì|gì|bao nhiêu|giá))\S+/.test(trimmed.toLowerCase());

        // Nếu đang trong flow đặt hàng → ưu tiên state machine
        if (conv.stage !== "idle") {
          const local = getLocalResponse(trimmed, safeProducts, conv);
          responseText = local.text;
          quickReplies = local.quickReplies;
          if (local.newState) convStateRef.current = { ...conv, ...local.newState };

          // Khi xác nhận số lượng → thêm vào giỏ hàng thật
          if (conv.stage === "awaiting_quantity" && local.newState?.stage === "idle") {
            const productName = conv.pendingProduct || "";
            const foundProduct = safeProducts.find((p) =>
              p.name.toLowerCase().includes(productName.toLowerCase()) ||
              productName.toLowerCase().includes(p.name.toLowerCase())
            );
            const qtyStr = extractQuantity(trimmed) || trimmed;
            const qtyNum = Math.max(1, parseFloat(qtyStr.replace(/[^0-9.]/g, "")) || 1);
            if (foundProduct) {
              addToCart(foundProduct, qtyNum);
            }
          }
        } else if (hasBuyIntent) {
          // Buy intent: đưa qua getLocalResponse để cập nhật state awaiting_quantity
          const local = getLocalResponse(trimmed, safeProducts, conv);
          responseText = local.text;
          quickReplies = local.quickReplies;
          if (local.newState) convStateRef.current = { ...conv, ...local.newState };
          if (seafoodKw) localStorage.setItem("obseafood_last_product", seafoodKw);
        } else if (isProductQuery(trimmed) && seafoodKw && !isRecipeIntent) {
          const searchKw = trimmed.toLowerCase().replace(/tôi|muốn|cần|mua|đặt|lấy|order|cho|mình|tìm|xem|giá|bao nhiêu|có|bán|không|còn|của|là|thế nào|như thế nào|thế|như|nhỉ|nha|nhé|đi|nữa|với|gì|hôm nay|hôm|nay|đây|ở đây|nào|loại nào|các loại|những loại/g, " ").replace(/\s+/g, " ").trim();
          const finalKw = searchKw.length > 1 ? searchKw : seafoodKw;
          const result = await searchProductsAndRespond(finalKw, safeProducts);
          responseText = result.text;
          quickReplies = result.quickReplies;
          // Lưu sản phẩm vừa hỏi cho returning customer
          localStorage.setItem("obseafood_last_product", finalKw);
        } else {
          const local = getLocalResponse(trimmed, safeProducts, conv);
          responseText = local.text;
          quickReplies = local.quickReplies;
          if (local.newState) convStateRef.current = { ...conv, ...local.newState };
        }
      }

      const botMsg: Message = {
        id: msgIdCounter++,
        role: "bot",
        text: responseText,
        timestamp: new Date(),
        quickReplies,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn("Chatbox lỗi, chuyển sang local fallback:", err);

      // Nếu Gemini lỗi → tắt Gemini và dùng local
      if (usingGemini) {
        setUsingGemini(false);
        genAI = null;
      }

      const safeProducts = products.length > 0 ? products : await getOrFetchProducts();
      const catchConv = convStateRef.current;
      const local = getLocalResponse(trimmed, safeProducts, catchConv);
      // Cập nhật state machine ngay cả trong catch (trường hợp API thất bại)
      if (local.newState) convStateRef.current = { ...catchConv, ...local.newState };
      const botMsg: Message = {
        id: msgIdCounter++,
        role: "bot",
        text: local.text,
        timestamp: new Date(),
        quickReplies: local.quickReplies,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function getQuickRepliesFromContext(msg: string): string[] {
    const m = msg.toLowerCase();
    if (/giao hàng|ship/.test(m)) return ["Xem sản phẩm", "Công thức nấu ăn", "Liên hệ"];
    if (/công thức|nấu|chế biến/.test(m)) return ["Công thức khác", "Xem sản phẩm", "Chính sách giao hàng"];
    if (/sản phẩm|mua|giá/.test(m)) return ["Chính sách giao hàng", "Công thức nấu ăn"];
    return ["Xem sản phẩm", "Công thức nấu ăn", "Chính sách giao hàng"];
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage(input);
  }

  // Simple markdown renderer
  function renderText(text: string) {
    return text.split("\n").map((line, i, arr) => {
      // Split by **...** OR [text](url) to keep all text parts
      const parts = line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
      return (
        <span key={i}>
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            if (linkMatch) {
              return (
                <a key={j} href={linkMatch[2]} style={{ color: "#0ea5e9", textDecoration: "underline" }}>
                  {linkMatch[1]}
                </a>
              );
            }
            return part;
          })}
          {i < arr.length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <div 
      className="chatbox-wrapper"
      style={{ transform: `translate(${renderPos.x}px, ${renderPos.y}px)` }}
    >
      {/* Toggle Button */}
      <button
        className={`chatbox-toggle ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        onMouseDown={handleMouseDown as React.MouseEventHandler<HTMLButtonElement>}
        style={{ cursor: "grab" }}
        aria-label="Mở chatbox hỗ trợ"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        )}
        {!open && <span className="chatbox-badge">AI</span>}
      </button>

      {/* Chat Window */}
      <div className={`chatbox-window ${open ? "visible" : ""}`}>
        {/* Header */}
        <div 
          className="chatbox-header" 
          onMouseDown={handleMouseDown}
          style={{ cursor: "grab" }}
        >
          <div className="chatbox-header-avatar">🐟</div>
          <div className="chatbox-header-info">
            <div className="chatbox-header-name">ObeSeaFood AI</div>
            <div className="chatbox-header-status">
              <span className="status-dot" />
              {usingGemini ? "Gemini AI · Trực tuyến" : "Trợ lý · Trực tuyến"}
            </div>
          </div>
          {usingGemini && (
            <div className="gemini-badge">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
              Gemini
            </div>
          )}
          <button className="chatbox-close-btn" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbox-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.role}`}>
              {msg.role === "bot" && <div className="bot-avatar">🐟</div>}
              <div className="message-content">
                <div className="message-bubble">{renderText(msg.text)}</div>
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="quick-replies">
                    {msg.quickReplies.map((qr) => (
                      <button key={qr} className="quick-reply-btn" onClick={() => sendMessage(qr)}>
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-message bot">
              <div className="bot-avatar">🐟</div>
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbox-input-area">
          <input
            type="text"
            className="chatbox-input"
            placeholder={usingGemini ? "Hỏi bất kỳ điều gì về hải sản..." : "Nhập câu hỏi của bạn..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button
            className="chatbox-send-btn"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
