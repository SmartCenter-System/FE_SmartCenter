import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  order?: number;
  isPreview?: boolean;
  duration?: number;
}

export const lessonService = {
  async getAll(courseId: string, sectionId: string): Promise<Lesson[]> {
    const res = await apiClient.get<any>(API_ENDPOINTS.LESSON.BASE, { params: { courseId, sectionId } });
    const data = res.data;
    return Array.isArray(data) ? data : data?.items || [];
  },

  async create(courseId: string, sectionId: string, data: { title: string; content?: string; videoUrl?: string; position?: number }): Promise<Lesson> {
    const res = await apiClient.post<any>(API_ENDPOINTS.LESSON.BASE, data, { params: { courseId, sectionId } });
    return res.data;
  },

  async update(courseId: string, sectionId: string, lessonId: string, data: Partial<Lesson>): Promise<Lesson> {
    const res = await apiClient.put<any>(API_ENDPOINTS.LESSON.BY_ID(lessonId), data, { params: { courseId, sectionId } });
    return res.data;
  },

  async remove(courseId: string, sectionId: string, lessonId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.LESSON.BY_ID(lessonId), { params: { courseId, sectionId } });
  },
};
