import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export interface Combo {
  comboId: string;
  name: string;
  discountPercent: number;
  isActive: boolean;
}

export const comboService = {
  getAll: () =>
    apiClient.get(API_ENDPOINTS.COMBO.BASE) as unknown as Promise<Combo[]>,

  getById: (comboId: string) =>
    apiClient.get(API_ENDPOINTS.COMBO.BY_ID(comboId)) as unknown as Promise<Combo>,

  create: (data: Omit<Combo, "comboId">) =>
    apiClient.post(API_ENDPOINTS.COMBO.BASE, data) as unknown as Promise<Combo>,

  update: (comboId: string, data: Partial<Combo>) =>
    apiClient.put(API_ENDPOINTS.COMBO.BY_ID(comboId), data) as unknown as Promise<Combo>,

  remove: (comboId: string) =>
    apiClient.delete(API_ENDPOINTS.COMBO.BY_ID(comboId)) as unknown as Promise<void>,
};
