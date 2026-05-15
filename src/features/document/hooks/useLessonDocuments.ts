import { useQuery } from "@tanstack/react-query";
import { documentService } from "@/features/document/service";

export const DOCUMENT_QUERY_KEYS = {
  all: ["documents"] as const,
  byLesson: (lessonId?: string) => [...DOCUMENT_QUERY_KEYS.all, "lesson", lessonId || ""] as const,
};

export function useLessonDocuments(lessonId?: string, enabled = true) {
  return useQuery({
    queryKey: DOCUMENT_QUERY_KEYS.byLesson(lessonId),
    queryFn: () => documentService.getByLesson(lessonId as string),
    enabled: enabled && Boolean(lessonId),
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    retry: false,
  });
}
