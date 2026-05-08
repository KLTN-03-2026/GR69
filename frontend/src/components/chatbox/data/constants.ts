export const DELIVERY_POLICY = `🚚 **Chính sách giao hàng của FishMarket:**

• **Phạm vi giao hàng:** Toàn quốc
• **Thời gian giao hàng:**
  - Nội thành Đà Nẵng: 2–4 giờ
  - Các tỉnh lân cận: 1–2 ngày
  - Toàn quốc: 2–5 ngày làm việc
• **Phí giao hàng:**
  - Đơn hàng từ 300.000đ: **MIỄN PHÍ**
  - Đơn hàng dưới 300.000đ: 30.000đ
• **Đóng gói:** Hải sản được đóng gói cách nhiệt, đảm bảo tươi sống khi đến tay bạn
• **Hoàn trả:** Nếu hàng không đảm bảo chất lượng, chúng tôi hoàn trả 100% trong vòng 24h`;

export const RECIPES: Record<string, string> = {
  "cá hồi": `🍽️ **Cá hồi áp chảo sốt chanh bơ**\n\n**Nguyên liệu:** 400g phi lê cá hồi, bơ, tỏi, chanh, muối tiêu.\n**Cách làm:** Ướp cá 15p. Áp chảo 3-4p mỗi mặt. Cho bơ, tỏi vào rưới lên cá. Vắt chanh và dùng nóng 🍋`,
  "tôm": `🍽️ **Tôm rang me chua ngọt**\n\n**Nguyên liệu:** 500g tôm sú, nước me, đường, nước mắm.\n**Cách làm:** Chiên tôm vàng. Phi tỏi, cho nước me đường đun sệt, bỏ tôm vào đảo đều 🍤`,
  "mực": `🍽️ **Mực xào sa tế**\n\n**Nguyên liệu:** 500g mực tươi, sa tế, tỏi sả.\n**Cách làm:** Trần mực 30s. Phi tỏi sả, cho sa tế xào 1p. Thêm mực xào lửa to 2-3p 🦑`,
  "cua": `🍽️ **Cua rang muối ớt**\n\n**Nguyên liệu:** 1 con cua ~800g, muối hột, ớt, bơ.\n**Cách làm:** Chiên cua ngập dầu. Rang muối hột, phi tỏi bơ, cho cua và muối vào xào đều 🦀`,
  "ghẹ": `🍽️ **Ghẹ hấp bia gừng**\n\n**Nguyên liệu:** 4 con ghẹ, bia, gừng, sả.\n**Cách làm:** Cho bia, gừng, sả vào nồi. Xếp ghẹ lên vỉ, hấp 15-20 phút đến khi chín đỏ 🍺`,
  "cá": `🍽️ **Cá kho tộ đậm đà**\n\n**Nguyên liệu:** 500g cá, nước mắm, đường, nước dừa.\n**Cách làm:** Ướp cá 20p. Kho với nước dừa trong tộ đất 20-25p cho keo lại 🍲`,
};

export const SEAFOOD_KEYWORDS = [
  "tôm", "cá", "cua", "mực", "ghẹ", "sò", "ốc", "hàu", "bạch tuộc", "lươn",
  "nghêu", "ngao", "hải sản", "cá hồi", "cá thu", "cá trê", "cá basa",
  "tôm hùm", "tôm sú", "tôm mũ ni", "tôm hổ", "tôm càng", "cá lóc",
];

export const FOOD_INTENT_KEYWORDS = [
  "ăn gì", "ăn lẩu", "lẩu", "nhậu", "tiệc", "bbq", "nướng", "hấp", "ăn hải sản", "combo", "tụ tập", "đãi khách", "ăn tối", "ăn khuya", "ăn ngon", "món ngon", "đồ nhắm",
  "họp mặt", "liên hoan", "sinh nhật", "tiệc gia đình", "đám bạn", "lai rai", "hải sản tươi", "ăn với budget", "gợi ý món",
];

export const SEAFOOD_SYNONYMS: Record<string, string[]> = {
  tôm: ["tôm", "tôm sú", "tôm hùm", "tôm càng"],
  cá: ["cá", "cá hồi", "cá thu", "cá basa"],
  mực: ["mực", "bạch tuộc"],
};
export const PRESERVATION_TIPS: Record<string, string> = {
  "cá hồi": "🧊 **Bảo quản Cá hồi:** Bọc kín bằng màng bọc thực phẩm. Để ngăn mát dùng trong 24h, ngăn đông để được 1-2 tháng. Rã đông tự nhiên trong ngăn mát tủ lạnh từ đêm hôm trước nhé!",
  "cua": "🦀 **Bảo quản Cua/Ghẹ:** Không nên cho ngay vào nước lạnh sẽ làm cua chết. Hãy để nơi thoáng mát, phủ khăn ẩm lên. Tốt nhất nên chế biến ngay trong ngày để thịt chắc ngọt nhất.",
  "mực": "🦑 **Bảo quản Mực:** Rửa sạch, lấy túi mực, để ráo nước rồi cho vào hộp kín hoặc túi zip cấp đông. Khi rã đông không nên ngâm trực tiếp vào nước lâu nhé."
};