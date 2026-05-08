import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export type CartItemType = 1 | 2; // 1: Course, 2: Combo

export const cartService = {
  create: (studentId: string) =>
    apiClient.post(API_ENDPOINTS.CART.CREATE(studentId)) as unknown as Promise<unknown>,

  get: (studentId: string) =>
    apiClient.get(API_ENDPOINTS.CART.GET(studentId)) as unknown as Promise<unknown>,

  addItem: (data: { itemId: string; quantity: number; itemType: CartItemType }) =>
    apiClient.post(API_ENDPOINTS.CART.ADD, data) as unknown as Promise<unknown>,

  removeItem: (itemId: string) =>
    apiClient.delete(API_ENDPOINTS.CART.REMOVE, { data: { itemId } }) as unknown as Promise<void>,
};
