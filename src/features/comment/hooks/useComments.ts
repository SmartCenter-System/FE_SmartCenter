import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { commentService } from "../service";
import type { CreateCommentPayload } from "../type";

export const COMMENT_KEYS = {
  all: ["comments"] as const,
  byLesson: (lessonId?: string) => ["comments", "lesson", lessonId ?? ""] as const,
};

export function useLessonComments(lessonId?: string, enabled = true) {
  return useQuery({
    queryKey: COMMENT_KEYS.byLesson(lessonId),
    queryFn: () => commentService.getByLesson(lessonId || ""),
    enabled: Boolean(lessonId) && enabled,
    retry: false,
  });
}

export function useCreateComment(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => commentService.create({ lessonId, content } satisfies CreateCommentPayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.byLesson(lessonId) });
      toast.success("Đã gửi thảo luận!");
    },
  });
}

export function useDeleteComment(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.remove(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.byLesson(lessonId) });
      toast.success("Đã xóa thảo luận");
    },
  });
}
