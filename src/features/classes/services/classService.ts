import { apiClient } from "@/lib/axios";
import type { Class, CreateClassInput } from "../schema";

export const classService = {
  /**
   * Lấy danh sách lớp học theo ID khóa học
   */
  getClassesByCourseId: async (courseId: string): Promise<Class[]> => {
    // Giả định endpoint là /api/Class/by-course/{courseId} hoặc dùng query params
    const res = await apiClient.get<Class[]>("/api/Class", { params: { courseId } });
    return Array.isArray(res) ? res : [];
  },

  /**
   * Tạo mới một lớp học
   */
  createClass: async (courseId: string, data: CreateClassInput): Promise<Class> => {
    const payload = {
      ...data,
      courseId,
    };
    return apiClient.post<Class>("/api/Class", payload);
  },

  /**
   * Cập nhật thông tin lớp học
   */
  updateClass: async (classId: string, data: Partial<CreateClassInput>): Promise<Class> => {
    return apiClient.put<Class>(`/api/Class/${classId}`, data);
  },

  /**
   * Xóa lớp học
   */
  deleteClass: async (classId: string): Promise<void> => {
    await apiClient.delete(`/api/Class/${classId}`);
  }
};
