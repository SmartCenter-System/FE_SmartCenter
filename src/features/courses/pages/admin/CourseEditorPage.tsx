import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CourseForm } from "@/features/courses/components/CourseForm";
import { ClassManagement } from "@/features/classes/components/ClassManagement";

export default function CourseEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // TODO: Fetch course data if isEditMode is true using react-query
  // const { data: course, isLoading } = useQuery(...)

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
              ? "Cập nhật thông tin chi tiết của khóa học." 
              : "Điền thông tin bên dưới để tạo khóa học mới."}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <CourseForm />
      </div>

      {isEditMode && id && (
        <ClassManagement courseId={id} />
      )}
    </div>
  );
}
