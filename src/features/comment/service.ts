import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

import type { CommentItem, CommentRaw, CreateCommentPayload } from "./type";

function normalizeComment(raw: CommentRaw): CommentItem {
  return {
    id: String(raw.id ?? raw.commentId ?? crypto.randomUUID()),
    lessonId: String(raw.lessonId ?? ""),
    content: String(raw.content ?? ""),
    userId: String(raw.userId ?? ""),
    userName: String(raw.userFullName ?? raw.userName ?? raw.user?.fullName ?? "Người dùng"),
    avatar: raw.avatar ?? raw.user?.avatar,
    parentCommentId: raw.parentCommentId ?? null,
    depthLevel: Number(raw.depthLevel ?? 0),
    isLocked: Boolean(raw.isLocked),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    replies: Array.isArray(raw.replies) ? raw.replies.map(normalizeComment) : [],
  };
}

export const commentService = {
  async getByLesson(lessonId: string): Promise<CommentItem[]> {
    const res = await apiClient.get<{ items?: CommentRaw[]; data?: CommentRaw[] } | CommentRaw[]>(
      API_ENDPOINTS.COMMENT.BY_LESSON(lessonId),
    ) as unknown as { items?: CommentRaw[]; data?: CommentRaw[] } | CommentRaw[];

    const items = Array.isArray(res) ? res : res.items ?? res.data ?? [];

    return (Array.isArray(items) ? items : []).map(normalizeComment);
  },

  async create(payload: CreateCommentPayload): Promise<void> {
    await apiClient.post(API_ENDPOINTS.COMMENT.BASE, payload);
  },

  async remove(commentId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COMMENT.DELETE(commentId));
  },
};
