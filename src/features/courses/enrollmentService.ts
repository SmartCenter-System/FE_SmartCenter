import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export interface Enrollment {
  courseId?: string;
  courseName: string;
  basePrice: number;
  courseType: number;
  imgUrl?: string | null;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
  academicYear?: number;
  enrollmentDate: string;
  status: number;
  progress?: number;
}

const normalizeEnrollment = (item: any): Enrollment => ({
  courseId: item.courseId || item.id,
  courseName: item.courseName || item.title,
  basePrice: Number(item.basePrice ?? 0),
  courseType: Number(item.courseType ?? 1),
  imgUrl: item.imgUrl ?? item.thumbnail ?? null,
  isActive: Boolean(item.isActive ?? true),
  startAt: item.startAt,
  endAt: item.endAt,
  academicYear: item.academicYear ? Number(item.academicYear) : undefined,
  enrollmentDate: item.enrollmentDate,
  status: Number(item.status ?? 0),
  progress: Number(item.progress ?? 0),
});

export const enrollmentService = {
  getMyEnrollments: async (): Promise<{ items: Enrollment[]; total: number }> => {
    const response = await apiClient.get<any>(API_ENDPOINTS.ENROLLMENT.MY);
    const rawItems = response?.items || (Array.isArray(response) ? response : []);
    const items = rawItems.map(normalizeEnrollment);
    return {
      items,
      total: response?.totalCount || items.length,
    };
  },

  getMyEnrollmentCourses: async (): Promise<Enrollment[]> => {
    const response = await apiClient.get<any>(API_ENDPOINTS.ENROLLMENT.MY);
    const rawItems = response?.items || (Array.isArray(response) ? response : []);
    return rawItems.map(normalizeEnrollment);
  },

  enroll: (courseId: string, transactionId: string, studentId?: string) =>
    apiClient.post(API_ENDPOINTS.ENROLLMENT.BASE, { 
      courseId, 
      transactionId,
      studentId: studentId // Optional: Support manual enrollment by staff if backend allows extra fields
    }),
};
