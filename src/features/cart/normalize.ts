import type { CartItemRaw, CleanCartItem, CleanCart } from "./type";

export function normalizeCartItem(raw: CartItemRaw): CleanCartItem {
  // Ép kiểu tàn nhẫn bằng Number() để triệt tiêu mọi rủi ro chuỗi hóa
  const price = Number(raw?.price ?? raw?.basePrice ?? 0);
  const quantity = Number(raw?.quantity ?? 1);
  
  return {
    id: String(raw?.id ?? raw?.itemId ?? ""),
    courseId: String(raw?.courseId ?? ""),
    title: String(raw?.itemName ?? raw?.title ?? "Khóa học"),
    imgUrl: raw?.imgUrl ?? null,
    price,
    quantity,
    subTotal: price * quantity, // Xử lý ngay tại gốc
    itemType: Number(raw?.itemType ?? 1) === 2 ? 2 : 1,
  };
}

export function normalizeCart(itemsRaw: CartItemRaw[]): CleanCart {
  const items = (Array.isArray(itemsRaw) ? itemsRaw : [])
    .map(normalizeCartItem)
    .filter(item => item.id !== "");
    
  const totalCartPrice = items.reduce((acc, curr) => acc + curr.subTotal, 0);
  
  return { items, totalCartPrice };
}
