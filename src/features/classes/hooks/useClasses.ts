import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classService } from "../services/classService";
import { toast } from "sonner";
import type { CreateClassInput } from "../schema";

export function useClasses(courseId: string) {
  const queryClient = useQueryClient();

  // Query lấy danh sách lớp học
  const classesQuery = useQuery({
    queryKey: ["classes", courseId],
    queryFn: () => classService.getClassesByCourseId(courseId),
    enabled: !!courseId,
  });

  // Mutation tạo lớp học mới
  const createClassMutation = useMutation({
    mutationFn: (data: CreateClassInput) => classService.createClass(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes", courseId] });
      toast.success("Đã tạo lớp học mới thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể tạo lớp học. Vui lòng thử lại.");
    }
  });

  // Mutation cập nhật lớp học
  const updateClassMutation = useMutation({
    mutationFn: ({ classId, data }: { classId: string; data: Partial<CreateClassInput> }) => 
      classService.updateClass(classId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes", courseId] });
      toast.success("Đã cập nhật thông tin lớp học!");
    },
  });

  // Mutation xóa lớp học
  const deleteClassMutation = useMutation({
    mutationFn: (classId: string) => classService.deleteClass(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes", courseId] });
      toast.success("Đã xóa lớp học!");
    },
  });

  return {
    classes: classesQuery.data || [],
    isLoading: classesQuery.isLoading,
    isError: classesQuery.isError,
    createClass: createClassMutation.mutateAsync,
    isCreating: createClassMutation.isPending,
    updateClass: updateClassMutation.mutateAsync,
    isUpdating: updateClassMutation.isPending,
    deleteClass: deleteClassMutation.mutateAsync,
    isDeleting: deleteClassMutation.isPending,
  };
}
