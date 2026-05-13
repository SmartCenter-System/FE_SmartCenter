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

interface ApiEnvelope<T> {
	success?: boolean;
	message?: string;
	data?: T;
	errors?: unknown;
	traceId?: string;
	timestampUtc?: string;
}

function normalizeDocument(raw: any): LessonDocument {
	return {
		documentId: String(raw?.documentId ?? ""),
		lessonId: String(raw?.lessonId ?? ""),
		fileName: String(raw?.fileName ?? ""),
		fileUrl: String(raw?.fileUrl ?? ""),
		fileType: raw?.fileType ? String(raw.fileType) : undefined,
		createdAt: raw?.createdAt ? String(raw.createdAt) : undefined,
	};
}

export const documentService = {
	async getByLesson(lessonId: string): Promise<LessonDocument[]> {
		const response = await apiClient.get<LessonDocument[] | ApiEnvelope<LessonDocument[]>>(
			API_ENDPOINTS.DOCUMENT.BY_LESSON(lessonId),
		);

		if (Array.isArray(response)) {
			return response.map(normalizeDocument);
		}

		if (Array.isArray((response as ApiEnvelope<LessonDocument[]>)?.data)) {
			return ((response as ApiEnvelope<LessonDocument[]>).data ?? []).map(normalizeDocument);
		}

		return [];
	},
};
