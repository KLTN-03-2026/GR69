import type { ProductItem } from "../types/types";
import { SEAFOOD_SYNONYMS, FOOD_INTENT_KEYWORDS } from "../data/constants";

export function extractSeafoodKeyword(msg: string): string | null {
  const normalized = msg.toLowerCase();
  for (const [main, aliases] of Object.entries(SEAFOOD_SYNONYMS)) {
    if (aliases.some((a) => normalized.includes(a))) return main;
  }
  return null;
}

export function extractBudget(msg: string): number | null {
  const lower = msg.toLowerCase();
  const millionMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(triệu|tr)/);
  if (millionMatch) return Math.round(parseFloat(millionMatch[1].replace(",", ".")) * 1000000);

  const kMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(k|ngàn|nghìn|củ)(?!g\b|m\b)/);
  if (kMatch) {
    const value = parseFloat(kMatch[1].replace(",", "."));
    return kMatch[2] === "củ" ? value * 1000000 : value * 1000;
  }

  const dotMatch = lower.replace(/\s+/g, "").match(/(\d{1,3}(?:\.\d{3})+)/);
  if (dotMatch) return parseInt(dotMatch[1].replace(/\./g, ""));

  const exactMatch = lower.replace(/\s+/g, "").match(/(\d{5,})/);
  if (exactMatch) return parseInt(exactMatch[1]);

  return null;
}

export function isProductQuery(msg: string): boolean {
  const normalized = msg.toLowerCase().trim();
  const hasProductIntent = /giá|bao nhiêu|mua|bán|có không|còn không|sản phẩm|tìm|order|đặt/.test(normalized);
  const hasFoodIntent = FOOD_INTENT_KEYWORDS.some((k) => normalized.includes(k));
  const hasBudget = extractBudget(normalized) !== null;

  return hasProductIntent || hasFoodIntent || hasBudget || extractSeafoodKeyword(normalized) !== null;
}

export function extractQuantity(msg: string): string | null {
  const n = msg.toLowerCase().replace(/\s+/g, "");
  const m = n.match(/(\d+(?:[.,]\d+)?)\s*(kg|gram|g|con|ký|combo|phần|set)/);
  if (m) return `${m[1]} ${m[2]}`;
  if (/nửa/.test(n)) return "0.5kg";
  const numOnly = n.match(/^(\d+(?:[.,]\d+)?)$/);
  if (numOnly) return `${numOnly[1]}`;
  return null;
}

export function findBestProductMatch(text: string, products: ProductItem[]): ProductItem | undefined {
  const normalized = text.toLowerCase().trim();
  const exact = products.find(p => p.name.toLowerCase().includes(normalized));
  if (exact) return exact;

  const kw = extractSeafoodKeyword(normalized);
  if (kw) return products.find(p => p.name.toLowerCase().includes(kw));
  return undefined;
}

export function suggestProductsByBudget(budget: number, products: ProductItem[]) {
  // 1. Thiết lập giá trần: Không có món nào được chiếm > 40% ngân sách (nếu ngân sách >= 600k)
  // Việc này ngăn chặn bot dồn tiền mua 1 con Tôm Hùm đắt đỏ cho nhóm đông người.
  const maxPricePerItem = budget >= 600000 ? budget * 0.4 : budget;

  // 2. Lọc danh sách hợp lệ và đảo ngẫu nhiên để combo luôn đa dạng mỗi lần hỏi
  let availableProducts = [...products]
    .map(p => ({ ...p, price: Number(p.price) }))
    .filter(p => p.price <= maxPricePerItem)
    .sort(() => Math.random() - 0.5);

  // Fallback: Nếu ngân sách quá thấp lọc xong không còn gì, lấy lại mảng gốc và ưu tiên món rẻ nhất
  if (availableProducts.length === 0) {
    availableProducts = [...products]
      .map(p => ({ ...p, price: Number(p.price) }))
      .sort((a, b) => a.price - b.price);
  }

  const selected: ProductItem[] = [];
  let total = 0;
  const usedCategory = new Set<string>();

  // 3. Vòng 1: Ưu tiên mỗi danh mục (Tôm, Mực, Nghêu...) lấy 1 món cho đa dạng
  for (const p of availableProducts) {
    if (total + p.price > budget) continue;
    
    // Nếu danh mục đã có trong combo thì bỏ qua để nhường chỗ cho loại hải sản khác
    if (p.category && usedCategory.has(p.category)) continue;

    selected.push(p);
    total += p.price;
    if (p.category) usedCategory.add(p.category);

    // Đạt đủ 4 món và chiếm > 75% ngân sách thì dừng
    if (selected.length >= 4 && total >= budget * 0.85) break;
  }

  // 4. Vòng 2: Nếu vòng 1 lấy chưa đủ 4 món (hoặc dư quá nhiều tiền), nhặt thêm món bất kỳ
  if (selected.length < 4 || total < budget * 0.6) {
    for (const p of availableProducts) {
      if (selected.some(s => s.id === p.id)) continue;
      if (total + p.price > budget) continue;

      selected.push(p);
      total += p.price;

      if (selected.length >= 6 || total >= budget * 0.90) break;
    }
  }

  return {
    items: selected,
    total,
  };
}