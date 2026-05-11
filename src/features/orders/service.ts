import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export const orderService = {
  create: (data: any) =>
    apiClient.post(API_ENDPOINTS.ORDER.BASE, data) as unknown as Promise<unknown>,

  getMe: () =>
    apiClient.get(API_ENDPOINTS.ORDER.ME) as unknown as Promise<unknown>,

  getById: (orderId: string) =>
    apiClient.get(API_ENDPOINTS.ORDER.BY_ID(orderId)) as unknown as Promise<unknown>,

  getAll: (params?: any) =>
    apiClient.get(API_ENDPOINTS.ADMIN.ORDERS, { params }) as unknown as Promise<any>,

  getStats: async () => {
    const res = await apiClient.get<any>(API_ENDPOINTS.ADMIN.ORDERS, { params: { PageSize: 100 } });
    const orders = res?.items || (Array.isArray(res) ? res : []);
    
    return {
      total: Number(res?.totalCount ?? res?.total ?? orders.length ?? 0),
      revenue: orders
        .filter((o: any) => {
          const pStatus = String(o.paymentStatus || "").toUpperCase();
          const status = String(o.status || "");
          // Chỉ tính nếu là PAID/SUCCESS và KHÔNG PHẢI là PENDING/0
          const isPaid = ["SUCCESS", "PAID"].includes(pStatus) || status === "1";
          const isNotPending = pStatus !== "PENDING" && status !== "0";
          return isPaid && isNotPending;
        })
        .reduce((sum: number, o: any) => sum + (o.totalAmount || o.amount || 0), 0),
      pending: orders.filter((o: any) => ["PENDING"].includes(String(o.paymentStatus || o.status).toUpperCase()) || o.status === 0).length,
      cancelled: orders.filter((o: any) => ["CANCELLED", "FAILED"].includes(String(o.paymentStatus || o.status).toUpperCase()) || o.status === 2).length,
    };
  },

  cancel: (orderId: string) =>
    apiClient.put(API_ENDPOINTS.ORDER.CANCEL(orderId)) as unknown as Promise<void>,
};
