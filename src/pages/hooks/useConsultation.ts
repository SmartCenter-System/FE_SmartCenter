import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { CreateConsultationPayload } from "../type";

export function useCreateConsultation() {
  return useMutation({
    mutationFn: async (payload: CreateConsultationPayload) => {
      // API này sử dụng FormData theo spec (multipart/form-data)
      const formData = new FormData();
      
      // Tách FullName thành FirstName và LastName (giả định đơn giản)
      const nameParts = payload.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      formData.append("FirstName", firstName);
      formData.append("LastName", lastName);
      formData.append("Email", payload.email);
      formData.append("PhoneNumber", payload.phoneNumber);
      if (payload.courseId) formData.append("CourseId", payload.courseId);
      if (payload.description) formData.append("Message", payload.description);

      const response = await apiClient.post(API_ENDPOINTS.CONSULTATION.CREATE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    },
  });
}

