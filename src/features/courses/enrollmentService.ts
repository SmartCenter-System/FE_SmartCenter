import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export interface Enrollment {
  courseId: string;
  courseName: string;
  enrollmentDate: string;
  status: string;
  progress: number;
}

export const enrollmentService = {
  getMyEnrollments: async (): Promise<{ items: Enrollment[]; total: number }> => {
    const response = (await apiClient.get<any>(API_ENDPOINTS.ENROLLMENT.MY)) as any;
    const items = response?.items || response || [];
    return items.map((item: any) => ({
      courseId: item.courseId || item.id,
      courseName: item.courseName || item.title,
      enrollmentDate: item.enrollmentDate,
      status: item.status,
      progress: item.progress || 0,
    }));
  },

  enroll: (courseId: string, transactionId: string) =>
    apiClient.post(API_ENDPOINTS.ENROLLMENT.BASE, { courseId, transactionId }),
};
