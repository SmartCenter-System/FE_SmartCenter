import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

import type { ReviewItem } from "./type";

type ReviewRaw = Partial<ReviewItem> & {
  id?: string;
  userId?: string;
  fullName?: string;
};

type ReviewCourseResponse = {
  success: boolean;
  message: string;
  data: ReviewRaw[];
  errors: unknown;
  traceId: string;
  timestampUtc: string;
};

function normalizeReview(raw: ReviewRaw): ReviewItem {
  return {
    reviewId: String(raw?.reviewId ?? raw?.id ?? crypto.randomUUID()),
    rating: Number(raw?.rating ?? 0),
    comment: String(raw?.comment ?? ""),
    createdAt: String(raw?.createdAt ?? new Date().toISOString()),
    studentId: String(raw?.studentId ?? raw?.userId ?? ""),
    studentName: String(raw?.studentName ?? raw?.fullName ?? "Ẩn danh"),
  };
}

export const reviewService = {
  async getReviews(courseId: string, studentId?: string): Promise<ReviewItem[]> {
    const res = await apiClient.get<ReviewCourseResponse | ReviewRaw[]>(API_ENDPOINTS.REVIEW.GET, {
      params: {
        courseId,
        ...(studentId ? { studentId } : {}),
      },
    }) as unknown as ReviewCourseResponse | ReviewRaw[];

    const items = Array.isArray(res) ? res : res.data;

    return (Array.isArray(items) ? items : []).map(normalizeReview);
  },
};
