import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services";
import type { CourseFilterParams } from "../type";

export const COURSE_KEYS = {
  all: ["courses"] as const,
  list: (params?: CourseFilterParams) => ["courses", "list", params] as const,
  detail: (id: string) => ["courses", "detail", id] as const,
};

import { useAuthStore } from "@/features/auth/store";

export function useCourses(params?: CourseFilterParams) {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: COURSE_KEYS.list(params),
    queryFn: () => courseService.getCourses(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 1,
    enabled: !!accessToken,
  });
}

export function useCourse(courseId?: string, enabled = true) {
  return useQuery({
    queryKey: COURSE_KEYS.detail(courseId || ""),
    queryFn: () => courseService.getById(courseId || ""),
    enabled: !!courseId && enabled,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
}
