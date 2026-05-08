import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export interface Section {
  sectionId: string;
  title: string;
  position: number;
}

export const sectionService = {
  getAll: (courseId: string) =>
    apiClient.get(API_ENDPOINTS.SECTION.BASE, { params: { courseId } }) as unknown as Promise<Section[]>,

  create: (courseId: string, data: { title: string; position?: number }) =>
    apiClient.post(API_ENDPOINTS.SECTION.BASE, data, { params: { courseId } }) as unknown as Promise<Section>,

  update: (courseId: string, sectionId: string, data: { title?: string; position?: number }) =>
    apiClient.put(API_ENDPOINTS.SECTION.BY_ID(sectionId), data, { params: { courseId } }) as unknown as Promise<Section>,

  remove: (courseId: string, sectionId: string) =>
    apiClient.delete(API_ENDPOINTS.SECTION.BY_ID(sectionId), { params: { courseId } }) as unknown as Promise<void>,
};
