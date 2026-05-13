import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export interface Section {
  sectionId: string;
  title: string;
  position: number;
}

export const sectionService = {
  async getAll(courseId: string): Promise<Section[]> {
    const data = await apiClient.get<any>(API_ENDPOINTS.SECTION.BASE, { params: { courseId } });
    return Array.isArray(data) ? data : data?.items || [];
  },

  async create(courseId: string, data: { title: string; position?: number }): Promise<Section> {
    const res = await apiClient.post<any>(API_ENDPOINTS.SECTION.BASE, data, { params: { courseId } });
    return res;
  },

  async update(courseId: string, sectionId: string, data: { title?: string; position?: number }): Promise<Section> {
    const res = await apiClient.put<any>(API_ENDPOINTS.SECTION.BY_ID(sectionId), data, { params: { courseId } });
    return res;
  },

  async remove(courseId: string, sectionId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SECTION.BY_ID(sectionId), { params: { courseId } });
  },
};
