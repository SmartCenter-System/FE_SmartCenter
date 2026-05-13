import { useCourse } from "./useCourses";

export function useCourseDetail(courseId?: string, enabled = true) {
  return useCourse(courseId, enabled);
}
