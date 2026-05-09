import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { CreateConsultationPayload } from "../type";

export function useCreateConsultation() {
  return useMutation({
    mutationFn: async (payload: CreateConsultationPayload) => {
      // API này sử dụng FormData theo spec (multipart/form-data)
      const formData = new FormData();
      formData.append("FullName", payload.fullName);
      formData.append("Email", payload.email);
      formData.append("PhoneNumber", payload.phoneNumber);
      if (payload.courseId) formData.append("CourseId", payload.courseId);
      if (payload.description) formData.append("Description", payload.description);

      const response = await apiClient.post(API_ENDPOINTS.CONSULTATION.CREATE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
}

