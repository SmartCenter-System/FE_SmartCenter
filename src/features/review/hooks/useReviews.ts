import { useQueries, useQuery } from "@tanstack/react-query";

import { reviewService } from "../service";

export const REVIEW_KEYS = {
  all: ["reviews"] as const,
  list: (courseId?: string, studentId?: string) => ["reviews", "list", courseId ?? "", studentId ?? ""] as const,
};

export function useReviews(courseId?: string, studentId?: string, enabled = true) {
  return useQuery({
    queryKey: REVIEW_KEYS.list(courseId, studentId),
    queryFn: () => reviewService.getReviews(courseId || "", studentId),
    enabled: Boolean(courseId) && enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 1,
  });
}

export function useCourseReviewQueries(courseIds: string[]) {
  return useQueries({
    queries: courseIds.map((courseId) => ({
      queryKey: REVIEW_KEYS.list(courseId),
      queryFn: () => reviewService.getReviews(courseId),
      enabled: Boolean(courseId),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 15,
      retry: 1,
    })),
  });
}
