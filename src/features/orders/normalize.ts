import type { OrderRaw, CleanOrder } from "./type";

/**
 * Định dạng thời gian chuẩn Việt Nam để UI không phải dùng thư viện Date.
 * Fix lỗi Safari (Invalid Date) bằng cách replace khoảng trắng " " thành "T".
 */
function formatVietnameseDate(dateStr?: string | null): string {
  if (!dateStr) return "N/A";
  try {
    const safeDateStr = dateStr.replace(" ", "T");
    const d = new Date(safeDateStr);
    if (isNaN(d.getTime())) return "N/A";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${mins}`;
  } catch {
    return "N/A";
  }
}

/**
 * Adapter chuẩn hóa dữ liệu Đơn hàng từ API.
 */
export function normalizeOrder(raw: OrderRaw): CleanOrder {
  const rawStatus = String(raw?.paymentStatus ?? raw?.status ?? "").toUpperCase();
  let status: CleanOrder["status"] = "PENDING";
  if (["SUCCESS", "PAID", "1"].includes(rawStatus)) status = "PAID";
  if (["CANCELLED", "FAILED", "2"].includes(rawStatus)) status = "CANCELLED";

  const items = Array.isArray(raw?.items)
    ? raw.items.map((rawItem) => {
        const price = Number(rawItem?.price ?? rawItem?.amount ?? 0);
        const quantity = Number(rawItem?.quantity ?? 1);
        return {
          id: String(rawItem?.id ?? rawItem?.orderItemId ?? ""),
          courseId: String(rawItem?.courseId ?? ""),
          courseName: String(rawItem?.courseName ?? rawItem?.itemName ?? ""),
          price,
          quantity,
          subTotal: price * quantity,
        };
      })
    : [];

  return {
    id: String(raw?.id ?? raw?.orderId ?? ""),
    orderCode: String(raw?.orderCode ?? ""),
    studentId: String(raw?.studentId ?? raw?.userId ?? ""),
    studentName: raw?.studentName,
    studentEmail: raw?.studentEmail,
    phone: raw?.phone,
    courseName: raw?.courseName,
    courseNames: raw?.courseNames,
    totalAmount: Number(raw?.totalAmount ?? raw?.amount ?? 0),
    status,
    paymentMethod: String(raw?.paymentMethod ?? "Chuyển khoản"),
    paymentId: raw?.paymentId,
    createdAt: formatVietnameseDate(raw?.transactionDate ?? raw?.createdAt),
    items,
  };
}
