import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send, Trash2, User, Loader2, MessageSquare } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAuthStore } from "@/features/auth/store";
import { EmptyState } from "@/shared/components/common/EmptyState";

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  avatar?: string;
  createdAt: string;
}

interface CommentSectionProps {
  lessonId: string;
}

export function CommentSection({ lessonId }: CommentSectionProps) {
  const queryClient = useQueryClient();
  const { userId, accessToken } = useAuthStore();
  const [newComment, setNewComment] = useState("");

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", lessonId],
    queryFn: async () => {
      const res = await apiClient.get<any>(API_ENDPOINTS.COMMENT.BY_LESSON(lessonId));
      const rawData = res?.items || (Array.isArray(res) ? res : []);
      return rawData.map((c: any) => ({
        id: c.id || c.commentId,
        content: c.content,
        userId: c.userId,
        userName: c.userName || c.user?.fullName || "Người dùng",
        avatar: c.avatar || c.user?.avatar,
        createdAt: c.createdAt,
      }));
    },
    enabled: !!lessonId,
  });

  const createMutation = useMutation({
    mutationFn: (content: string) =>
      apiClient.post(API_ENDPOINTS.COMMENT.BASE, {
        lessonId,
        content,
      }),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", lessonId] });
      toast.success("Đã gửi thảo luận!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) =>
      apiClient.delete(API_ENDPOINTS.COMMENT.DELETE(commentId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lessonId] });
      toast.success("Đã xóa thảo luận");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để tham gia thảo luận");
      return;
    }
    if (!newComment.trim()) return;
    createMutation.mutate(newComment);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">Thảo luận ({comments.length})</h3>
      </div>

      {/* Input Section */}
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
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] rounded-2xl resize-none focus-visible:ring-primary/20"
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
            <div key={comment.id} className="flex gap-4 group">
              <Avatar className="h-10 w-10 shrink-0 border">
                <AvatarImage src={comment.avatar} />
                <AvatarFallback className="bg-muted text-muted-foreground uppercase text-xs">
                  {comment.userName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{comment.userName}</span>
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
                      className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 hover:bg-red-50"
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
                <p className="text-sm mt-1 text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-2xl rounded-tl-none">
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
