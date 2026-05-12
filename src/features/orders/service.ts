import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import { normalizeOrder } from "./normalize";
import type { OrderRaw, CleanOrder, CreateOrderRequest } from "./type";

export const orderService = {
  create: (data: CreateOrderRequest) =>
    apiClient.post(API_ENDPOINTS.ORDER.BASE, data),

  getMe: async (): Promise<CleanOrder[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient.get<any, any>(API_ENDPOINTS.ORDER.ME);
    const rawOrders: OrderRaw[] = Array.isArray(res) ? res : res?.items ?? res?.data ?? [];
    return rawOrders.map(normalizeOrder).filter(o => o.id !== "");
  },

  getById: async (orderId: string): Promise<CleanOrder | null> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient.get<any, any>(API_ENDPOINTS.ORDER.BY_ID(orderId));
    // Check if empty
    if (!res) return null;
    return normalizeOrder(res as OrderRaw);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: async (params?: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await apiClient.get(API_ENDPOINTS.ADMIN.ORDERS, { params });
    const rawItems = Array.isArray(res) ? res : res?.items ?? res?.data ?? [];
    return {
      ...res,
      items: rawItems.map(normalizeOrder),
      totalCount: res?.totalCount ?? res?.total ?? rawItems.length,
      total: res?.totalCount ?? res?.total ?? rawItems.length,
    };
  },

  getStats: async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient.get<any, any>(API_ENDPOINTS.ADMIN.ORDERS, { params: { PageSize: 100 } });
    const rawOrders: OrderRaw[] = res?.items || (Array.isArray(res) ? res : []);
    
    // Đưa qua máy lọc
    const cleanOrders = rawOrders.map(normalizeOrder);
    
    return {
      total: Number(res?.totalCount ?? res?.total ?? cleanOrders.length ?? 0),
      revenue: cleanOrders
        .filter((o) => o.status === "PAID")
        .reduce((sum, o) => sum + o.totalAmount, 0),
      pending: cleanOrders.filter((o) => o.status === "PENDING").length,
      cancelled: cleanOrders.filter((o) => o.status === "CANCELLED" || o.status === "FAILED").length,
    };
  },

  cancel: (orderId: string) =>
    apiClient.put(API_ENDPOINTS.ORDER.CANCEL(orderId)),
};
