import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export interface LessonDocument {
	documentId: string;
	lessonId: string;
	fileName: string;
	fileUrl: string;
	fileType?: string;
	createdAt?: string;
}

export const documentService = {
	async getByLesson(lessonId: string): Promise<LessonDocument[]> {
		const response = await apiClient.get<LessonDocument[] | { data?: LessonDocument[] }>(API_ENDPOINTS.DOCUMENT.BY_LESSON(lessonId));
		if (Array.isArray(response)) {
			return response;
		}

		if (Array.isArray((response as { data?: LessonDocument[] })?.data)) {
			return (response as { data: LessonDocument[] }).data;
		}

		return [];
	},
};
