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
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
