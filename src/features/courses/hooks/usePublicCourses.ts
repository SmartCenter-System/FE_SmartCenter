import { useMutation, useQuery } from "@tanstack/react-query";
import { courseService } from "../services";
import type { PublicCourseQueryParams } from "../type";

export interface PublicCourseFilterState {
  keyword: string;
  mode?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function usePublicCourses(params: PublicCourseQueryParams) {
  return useQuery({
    queryKey: ["public-courses", params],
    queryFn: () => courseService.getPublicCourses(params),
    placeholderData: (prev) => prev,
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useApplyPublicCourseFiltersMutation(
  onApplied: (next: PublicCourseFilterState) => void,
) {
  return useMutation({
    mutationFn: async (next: PublicCourseFilterState) => next,
    onSuccess: (next) => {
      onApplied(next);
    },
  });
}
