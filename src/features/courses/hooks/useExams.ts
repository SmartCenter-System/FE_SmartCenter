import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examService } from "../services/examService";
import type { CreateExamPaperRequest, UpdateExamPaperRequest, QuestionItemRequest } from "../services/examService";
import { toast } from "sonner";

export const EXAM_QUERY_KEYS = {
  all: ["exams"] as const,
  byCourse: (courseId: string) => [...EXAM_QUERY_KEYS.all, "course", courseId] as const,
  byId: (examId: string) => [...EXAM_QUERY_KEYS.all, examId] as const,
  submissions: (examId: string) => [...EXAM_QUERY_KEYS.all, examId, "submissions"] as const,
};

export function useExams(courseId?: string) {
  return useQuery({
    queryKey: EXAM_QUERY_KEYS.byCourse(courseId || ""),
    queryFn: () => examService.getByCourseId(courseId || ""),
    enabled: !!courseId,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExamPaperRequest) => examService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EXAM_QUERY_KEYS.all });
      toast.success("Tạo đề thi thành công!");
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message || "Không thể tạo đề thi"}`);
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, data }: { examId: string; data: UpdateExamPaperRequest }) =>
      examService.update(examId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_QUERY_KEYS.all });
      toast.success("Cập nhật đề thi thành công!");
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => examService.delete(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_QUERY_KEYS.all });
      toast.success("Đã xóa đề thi!");
    },
  });
}

export function useGradeExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { examId: string; studentId: string; gradeDetails: any[] }) => examService.gradeExam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_QUERY_KEYS.all });
      toast.success("Chấm điểm thành công!");
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message || "Không thể chấm điểm"}`);
    },
  });
}

export function useAddQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, questions }: { examId: string; questions: QuestionItemRequest[] }) =>
      examService.addQuestions(examId, questions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_QUERY_KEYS.all });
      toast.success("Đã thêm câu hỏi vào đề thi!");
    },
  });
}
