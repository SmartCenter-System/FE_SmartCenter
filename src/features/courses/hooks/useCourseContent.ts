import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { courseService } from "../services";
import { toast } from "sonner";

export const COURSE_CONTENT_KEYS = {
  all: ["course-content"] as const,
  sections: (courseId: string) => [...COURSE_CONTENT_KEYS.all, "sections", courseId] as const,
  lessons: (courseId: string, sectionId: string) => [...COURSE_CONTENT_KEYS.all, "lessons", courseId, sectionId] as const,
};

export function useSections(courseId: string) {
  return useQuery({
    queryKey: COURSE_CONTENT_KEYS.sections(courseId),
    queryFn: () => courseService.getSections(courseId),
    enabled: !!courseId,
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, title }: { courseId: string; title: string }) => 
      courseService.createSection(courseId, { title }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_CONTENT_KEYS.sections(variables.courseId) });
      toast.success("Đã thêm chương");
    }
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, courseId, title }: { sectionId: string; courseId: string; title: string }) => 
      courseService.updateSection(sectionId, courseId, { title }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_CONTENT_KEYS.sections(variables.courseId) });
      toast.success("Đã cập nhật chương");
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, courseId }: { sectionId: string; courseId: string }) => 
      courseService.deleteSection(sectionId, courseId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_CONTENT_KEYS.sections(variables.courseId) });
      toast.success("Đã xóa chương");
    },
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, sectionId, data }: { courseId: string; sectionId: string; data: any }) => 
      courseService.createLesson(courseId, sectionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_CONTENT_KEYS.sections(variables.courseId) });
      toast.success("Đã thêm bài giảng");
    }
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, courseId, sectionId, data }: { lessonId: string; courseId: string; sectionId: string; data: any }) => 
      courseService.updateLesson(lessonId, courseId, sectionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_CONTENT_KEYS.sections(variables.courseId) });
      toast.success("Đã cập nhật bài giảng");
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, courseId, sectionId }: { lessonId: string; courseId: string; sectionId: string }) => 
      courseService.deleteLesson(lessonId, courseId, sectionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_CONTENT_KEYS.sections(variables.courseId) });
      toast.success("Đã xóa bài giảng");
    },
  });
}

export function useLessons(courseId: string, sectionId: string) {
  return useQuery({
    queryKey: COURSE_CONTENT_KEYS.lessons(courseId, sectionId),
    queryFn: () => courseService.getLessons(courseId, sectionId),
    enabled: !!courseId && !!sectionId,
  });
}
