export interface CommentItem {
  id: string;
  lessonId: string;
  content: string;
  userId: string;
  userName: string;
  avatar?: string;
  parentCommentId: string | null;
  depthLevel: number;
  isLocked: boolean;
  createdAt: string;
  replies: CommentItem[];
}

export interface CommentRaw {
  id?: string;
  commentId?: string;
  lessonId?: string;
  content?: string;
  userId?: string;
  userName?: string;
  userFullName?: string;
  avatar?: string;
  parentCommentId?: string | null;
  depthLevel?: number;
  isLocked?: boolean;
  createdAt?: string;
  replies?: CommentRaw[];
  user?: {
    fullName?: string;
    avatar?: string;
  };
}

export interface CreateCommentPayload {
  lessonId: string;
  content: string;
}
