import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

import type { CreateConsultationPayload } from "./type";

function splitFullName(fullName: string) {
  const normalized = fullName.trim().replace(/\s+/g, " ");
  const parts = normalized.split(" ");

  if (parts.length <= 1) {
    return {
      firstName: normalized,
      lastName: "",
    };
  }

  return {
    firstName: parts[parts.length - 1],
    lastName: parts.slice(0, -1).join(" "),
  };
}

function toFormData(payload: CreateConsultationPayload) {
  const formData = new FormData();
  const { firstName, lastName } = splitFullName(payload.fullName);

  formData.append("FirstName", firstName);
  formData.append("LastName", lastName);
  formData.append("Email", payload.email);
  formData.append("PhoneNumber", payload.phoneNumber);

  formData.append("RequestDate", new Date().toISOString());
  formData.append("Status", "Pending");

  if (payload.courseId) {
    formData.append("CourseId", payload.courseId);
  }

  if (payload.description) {
    formData.append("Message", payload.description);
  }

  return formData;
}

export const consultationService = {
  create(payload: CreateConsultationPayload) {
    return apiClient.post(API_ENDPOINTS.CONSULTATION.CREATE, toFormData(payload), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as unknown as Promise<unknown>;
  },
};
