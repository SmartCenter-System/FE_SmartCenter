import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export const orderService = {
  create: (data: any) =>
    apiClient.post(API_ENDPOINTS.ORDER.BASE, data) as unknown as Promise<unknown>,

  getMe: () =>
    apiClient.get(API_ENDPOINTS.ORDER.ME) as unknown as Promise<unknown>,

  getById: (orderId: string) =>
    apiClient.get(API_ENDPOINTS.ORDER.BY_ID(orderId)) as unknown as Promise<unknown>,

  cancel: (orderId: string) =>
    apiClient.put(API_ENDPOINTS.ORDER.CANCEL(orderId)) as unknown as Promise<void>,
};
