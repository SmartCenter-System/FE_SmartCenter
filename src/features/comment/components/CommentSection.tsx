import { useState } from "react";
import { toast } from "sonner";
import { Send, Trash2, User, Loader2, MessageSquare } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAuthStore } from "@/features/auth/store";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { useCreateComment, useDeleteComment, useLessonComments } from "../hooks";

interface CommentSectionProps {
  lessonId: string;
}

export function CommentSection({ lessonId }: CommentSectionProps) {
  const { userId, accessToken } = useAuthStore();
  const [newComment, setNewComment] = useState("");
  const isAuthenticated = Boolean(accessToken);

  const { data: comments = [], isLoading } = useLessonComments(lessonId, isAuthenticated);
  const createMutation = useCreateComment(lessonId);
  const deleteMutation = useDeleteComment(lessonId);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để tham gia thảo luận");
      return;
    }

    const content = newComment.trim();
    if (!content) return;

    createMutation.mutate(content, {
      onSuccess: () => setNewComment(""),
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">Thảo luận ({comments.length})</h3>
      </div>

      <div className="flex gap-4">
        <Avatar className="h-10 w-10 shrink-0 border">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <form onSubmit={handleSubmit} className="flex-1 space-y-3">
          <Textarea
            placeholder="Đặt câu hỏi hoặc chia sẻ cảm nghĩ của bạn..."
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            className="min-h-[100px] resize-none rounded-2xl focus-visible:ring-primary/20"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createMutation.isPending || !newComment.trim()}
              isLoading={createMutation.isPending}
              className="rounded-full px-6"
            >
              Gửi thảo luận <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-6 pt-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
          </div>
        ) : comments.length === 0 ? (
          <EmptyState
            title="Chưa có thảo luận nào"
            description="Hãy là người đầu tiên đặt câu hỏi cho bài học này!"
            icon={MessageSquare}
          />
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="group flex gap-4">
              <Avatar className="h-10 w-10 shrink-0 border">
                <AvatarImage src={comment.avatar} />
                <AvatarFallback className="bg-muted text-xs uppercase text-muted-foreground">
                  {comment.userName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{comment.userName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {userId === comment.userId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                      onClick={() => {
                        if (confirm("Xóa thảo luận này?")) {
                          deleteMutation.mutate(comment.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="mt-1 rounded-2xl rounded-tl-none bg-muted/30 p-3 text-sm leading-relaxed text-foreground/80">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
