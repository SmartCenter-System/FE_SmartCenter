import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export interface CreateExamPaperRequest {
  title: string;
  countDown: number;
  totalPoints: number;
  lessonId: string;
}

export interface UpdateExamPaperRequest {
  title: string;
  countDown?: number;
  totalPoints?: number;
  status: number; // 1: Draft, 2: Active, 3: Archived
}

export interface QuestionItemRequest {
  title: string;
  typeOfQuestion: number; // 1: MultipleChoice, 2: Essay
  multipleChoiceAnswers?: {
    content: string;
    isCorrect: boolean;
  }[];
  essayContext?: string;
}

export const examService = {
  async getByCourseId(courseId: string) {
    return apiClient.get(API_ENDPOINTS.EXAM_PAPER.BASE, { params: { courseId } });
  },

  async create(data: CreateExamPaperRequest) {
    return apiClient.post(API_ENDPOINTS.EXAM_PAPER.BASE, data);
  },

  async update(examId: string, data: UpdateExamPaperRequest) {
    return apiClient.put(API_ENDPOINTS.EXAM_PAPER.BY_ID(examId), data);
  },

  async delete(examId: string) {
    return apiClient.delete(API_ENDPOINTS.EXAM_PAPER.BY_ID(examId));
  },

  async setDeadline(examId: string, title: string, endedAt: string) {
    return apiClient.post(API_ENDPOINTS.EXAM_PAPER.DEADLINE(examId), { title, endedAt });
  },

  async addQuestions(examId: string, questions: QuestionItemRequest[]) {
    return apiClient.post(API_ENDPOINTS.EXAM_PAPER.ADD_QUESTIONS, { questions }, { params: { ExamID: examId } });
  },

  // Grading
  async gradeExam(data: { examId: string; studentId: string; gradeDetails: any[] }) {
    return apiClient.post(API_ENDPOINTS.GRADE_EXAM.BASE, data);
  }
};
