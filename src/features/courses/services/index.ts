export { courseService } from "./courseService";
export { sectionService } from "./sectionService";
export { lessonService } from "./lessonService";
export { examService } from "./examService";

export type { Section } from "./sectionService";
export type { Lesson } from "./lessonService";
export type {
  CreateExamPaperRequest,
  UpdateExamPaperRequest,
  QuestionItemRequest,
} from "./examService";
