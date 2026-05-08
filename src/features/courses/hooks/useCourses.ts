import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services";
import type { CourseFilterParams } from "../type";

export const COURSE_KEYS = {
  all: ["courses"] as const,
  list: (params?: CourseFilterParams) => ["courses", "list", params] as const,
  detail: (id: string) => ["courses", "detail", id] as const,
};

export function useCourses(params?: CourseFilterParams) {
  return useQuery({
    queryKey: COURSE_KEYS.list(params),
    queryFn: () => courseService.getAll(params),
  });
}

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: COURSE_KEYS.detail(courseId),
    queryFn: () => courseService.getById(courseId),
    enabled: !!courseId,
  });
}
