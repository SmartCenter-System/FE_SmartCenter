import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

export interface LessonFormValues {
  title: string;
  description?: string;
  videoUrl?: string;
  isPreview?: boolean;
}

interface LessonFormProps {
  initialValues?: LessonFormValues;
  isSubmitting?: boolean;
  onSubmit: (values: LessonFormValues) => void;
}

export function LessonForm({ initialValues, isSubmitting, onSubmit }: LessonFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [videoUrl, setVideoUrl] = useState(initialValues?.videoUrl ?? "");
  const [isPreview, setIsPreview] = useState(Boolean(initialValues?.isPreview));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      isPreview,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tiêu đề bài học</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề bài học" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Mô tả</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả ngắn cho bài học"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Video URL</label>
        <Input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPreview}
          onChange={(e) => setIsPreview(e.target.checked)}
          className="h-4 w-4"
        />
        Cho phép xem trước
      </label>

      <Button type="submit" disabled={isSubmitting || !title.trim()}>
        {isSubmitting ? "Đang lưu..." : "Lưu bài học"}
      </Button>
    </form>
  );
}
