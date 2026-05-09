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
  getAll: async (courseId: string, sectionId: string): Promise<Lesson[]> => {
    const response = await apiClient.get(API_ENDPOINTS.LESSON.BASE, { params: { courseId, sectionId } });
    return normalizeLessonResponse(response);
  },

  create: (courseId: string, sectionId: string, data: { title: string; content?: string; videoUrl?: string; position?: number }) =>
    apiClient.post(API_ENDPOINTS.LESSON.BASE, data, { params: { courseId, sectionId } }) as unknown as Promise<Lesson>,

  update: (courseId: string, sectionId: string, lessonId: string, data: Partial<Lesson>) =>
    apiClient.put(API_ENDPOINTS.LESSON.BY_ID(lessonId), data, { params: { courseId, sectionId } }) as unknown as Promise<Lesson>,

  remove: (courseId: string, sectionId: string, lessonId: string) =>
    apiClient.delete(API_ENDPOINTS.LESSON.BY_ID(lessonId), { params: { courseId, sectionId } }) as unknown as Promise<void>,
};
