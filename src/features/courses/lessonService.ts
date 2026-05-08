import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export interface Lesson {
  lessonId: string;
  title: string;
  content: string;
  videoUrl?: string;
  position: number;
}

export const lessonService = {
  getAll: (courseId: string, sectionId: string) =>
    apiClient.get(API_ENDPOINTS.LESSON.BASE, { params: { courseId, sectionId } }) as unknown as Promise<Lesson[]>,

  create: (courseId: string, sectionId: string, data: { title: string; content?: string; videoUrl?: string; position?: number }) =>
    apiClient.post(API_ENDPOINTS.LESSON.BASE, data, { params: { courseId, sectionId } }) as unknown as Promise<Lesson>,

  update: (courseId: string, sectionId: string, lessonId: string, data: Partial<Lesson>) =>
    apiClient.put(API_ENDPOINTS.LESSON.BY_ID(lessonId), data, { params: { courseId, sectionId } }) as unknown as Promise<Lesson>,

  remove: (courseId: string, sectionId: string, lessonId: string) =>
    apiClient.delete(API_ENDPOINTS.LESSON.BY_ID(lessonId), { params: { courseId, sectionId } }) as unknown as Promise<void>,
};
