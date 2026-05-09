import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CourseForm } from "@/features/courses/components/CourseForm";
import { ClassManagement } from "@/features/classes/components/ClassManagement";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/courses/services";

export default function CourseEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: course, isLoading } = useQuery({
    queryKey: ["admin-course", id],
    queryFn: () => courseService.getById(id!),
    enabled: isEditMode,
  });

  if (isEditMode && isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Đang tải thông tin khóa học...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/courses")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? `Cập nhật thông tin chi tiết cho: ${course?.courseName || "Khóa học"}` 
              : "Điền thông tin bên dưới để tạo khóa học mới."}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <CourseForm initialData={course} courseId={id} />
      </div>

      {isEditMode && id && (
        <ClassManagement courseId={id} />
      )}
    </div>
  );
}
