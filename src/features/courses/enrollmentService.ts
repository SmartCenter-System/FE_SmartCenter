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

function resolveEnrollmentCourseId(item: any): string | undefined {
  const primaryCandidate =
    item?.courseId ??
    item?.course?.courseId ??
    item?.course?.id ??
    item?.courseInfo?.courseId ??
    item?.courseInfo?.id ??
    item?.course?.courseID ??
    item?.courseID ??
    item?.courseName; // Use courseName as fallback

  if (primaryCandidate !== undefined && primaryCandidate !== null && primaryCandidate !== "") {
    return String(primaryCandidate);
  }

  // Some enrollment APIs return the course id in `id`.
  const fallbackId = item?.id;
  if (fallbackId === undefined || fallbackId === null || fallbackId === "") {
    return undefined;
  }

  return String(fallbackId);
}

function normalizeEnrollment(item: any): Enrollment {
  return {
    courseId: resolveEnrollmentCourseId(item),
    courseName: item.courseName || item.title || item?.course?.courseName || item?.course?.title || "",
    basePrice: Number(item.basePrice ?? item?.course?.basePrice ?? 0),
    courseType: Number(item.courseType ?? item?.course?.courseType ?? 1),
    imgUrl: item.imgUrl ?? item.thumbnail ?? item?.course?.imgUrl ?? item?.course?.thumbnail ?? null,
    isActive: Boolean(item.isActive ?? true),
    startAt: item.startAt ?? item?.course?.startAt,
    endAt: item.endAt ?? item?.course?.endAt,
    academicYear: item.academicYear
      ? Number(item.academicYear)
      : item?.course?.academicYear
        ? Number(item.course.academicYear)
        : undefined,
    enrollmentDate: item.enrollmentDate,
    status: Number(item.status ?? 0),
    progress: Number(item.progress ?? 0),
  };
}

export const enrollmentService = {
  getMyEnrollments: async (): Promise<{ items: Enrollment[]; total: number }> => {
    const response = (await apiClient.get<any>(API_ENDPOINTS.ENROLLMENT.MY)) as any;
    const rawItems = response?.data ?? response?.items ?? response ?? [];
    const items = Array.isArray(rawItems) ? rawItems.map((item: any) => normalizeEnrollment(item)) : [];

    return {
      items,
      total: Number(response?.total ?? items.length),
    };
  },

  getMyEnrollmentCourses: async (): Promise<Enrollment[]> => {
    const response = (await apiClient.get<any>(API_ENDPOINTS.ENROLLMENT.MY)) as any;
    const rawItems = response?.data ?? response?.items ?? response ?? [];
    return Array.isArray(rawItems) ? rawItems.map((item: any) => normalizeEnrollment(item)) : [];
  },

  enroll: (courseId: string, transactionId: string) =>
    apiClient.post(API_ENDPOINTS.ENROLLMENT.BASE, { courseId, transactionId }),
};
