import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export interface Section {
  sectionId: string;
  title: string;
  position: number;
}

export const sectionService = {
  async getAll(courseId: string): Promise<Section[]> {
    const data: any = await apiClient.get(API_ENDPOINTS.SECTION.BASE, { params: { courseId } });
    return Array.isArray(data) ? data : data?.items || [];
  },

  async create(courseId: string, data: { title: string; position?: number }): Promise<Section> {
    const res: any = await apiClient.post(API_ENDPOINTS.SECTION.BASE, data, { params: { courseId } });
    return res;
  },

  async update(courseId: string, sectionId: string, data: { title?: string; position?: number }): Promise<Section> {
    const res: any = await apiClient.put(API_ENDPOINTS.SECTION.BY_ID(sectionId), data, { params: { courseId } });
    return res;
  },

  async remove(courseId: string, sectionId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SECTION.BY_ID(sectionId), { params: { courseId } });
  },
};
