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

function normalizeLessonResponse(response: any): Lesson[] {
  const items = response?.data ?? response?.items ?? response ?? [];

  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item: any) => ({
    id: String(item.id),
    title: item.title ?? "",
    description: item.description,
    videoUrl: item.videoUrl,
    order: item.order,
    isPreview: Boolean(item.isPreview),
    duration: item.duration,
  }));
}

export const lessonService = {
  async getAll(courseId: string, sectionId: string): Promise<Lesson[]> {
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.LESSON.BASE, { 
        params: { courseId, sectionId } 
      });
      return normalizeLessonResponse(res);
    } catch (error) {
      return [];
    }
  },

  async create(courseId: string, sectionId: string, data: { title: string; description?: string; videoUrl?: string; order?: number; isPreview?: boolean; duration?: number }): Promise<Lesson> {
    const res = await apiClient.post<any>(API_ENDPOINTS.LESSON.BASE, data, { params: { courseId, sectionId } });
    return res;
  },

  async update(courseId: string, sectionId: string, lessonId: string, data: Partial<Lesson>): Promise<Lesson> {
    const res = await apiClient.put<any>(API_ENDPOINTS.LESSON.BY_ID(lessonId), data, { params: { courseId, sectionId } });
    return res;
  },

  async remove(courseId: string, sectionId: string, lessonId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.LESSON.BY_ID(lessonId), { params: { courseId, sectionId } });
  },
};
