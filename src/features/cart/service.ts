import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import { normalizeCart } from "./normalize";
import type { CartItemRaw, CleanCart } from "./type";

export type CartItemType = 1 | 2; // 1: Course, 2: Combo

export const cartService = {
  create: (studentId: string) =>
    apiClient.post(API_ENDPOINTS.CART.CREATE(studentId)),

  get: async (studentId: string): Promise<CleanCart> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient.get<any, any>(API_ENDPOINTS.CART.GET(studentId));
    // Dữ liệu mảng các items thường nằm trong res.items hoặc res data
    const rawItems: CartItemRaw[] = Array.isArray(res) ? res : res?.items ?? res?.data ?? [];
    return normalizeCart(rawItems);
  },

  addItem: (data: { itemId: string; quantity: number; itemType: CartItemType }) =>
    apiClient.post(API_ENDPOINTS.CART.ADD, data),

  removeItem: (itemId: string) =>
    apiClient.delete(API_ENDPOINTS.CART.REMOVE, { data: { itemId } }),
};

