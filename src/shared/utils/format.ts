/**
 * Định dạng giá tiền sang chuẩn VND
 * @param price Số tiền cần định dạng
 * @returns Chuỗi định dạng tiền tệ (VD: 500.000 ₫)
 */
export const formatPrice = (price: number | string) => {
  const amount = typeof price === "string" ? parseFloat(price) : price;
  
  if (isNaN(amount)) return "0 ₫";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
