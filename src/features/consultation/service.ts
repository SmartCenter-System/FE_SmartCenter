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

export type ConsultationStatus = "PENDING" | "PROCESSED" | "CANCELLED";

export interface ConsultationRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  courseId: string;
  courseName: string;
  note: string;
  status: ConsultationStatus;
  createdAt: string;
}

export const consultationService = {
  async getConsultations(params?: any): Promise<{ totalCount: number; items: ConsultationRequest[] }> {
    const res = await apiClient.get<any>(API_ENDPOINTS.CONSULTATION.BASE, { params });
    // Handle both {items: []} and direct array responses
    const items = res?.items || (Array.isArray(res) ? res : []);
    const totalCount = res?.totalCount ?? items.length;
    
    // Normalize fields
    const normalizedItems = items.map((item: any) => ({
      id: item.id || item.consultationId,
      fullName: item.fullName || item.customerName || "N/A",
      email: item.email || "N/A",
      phone: item.phone || item.phoneNumber || "N/A",
      courseId: item.courseId,
      courseName: item.courseName || item.courseInterest || "N/A",
      note: item.note || item.message || "",
      status: item.status || "PENDING",
      createdAt: item.createdAt || new Date().toISOString(),
    }));

    return { totalCount, items: normalizedItems };
  },

  async updateStatus(id: string, status: ConsultationStatus): Promise<void> {
    return apiClient.patch(API_ENDPOINTS.CONSULTATION.STATUS(id), { status }) as any;
  },

  create(payload: CreateConsultationPayload) {
    return apiClient.post(API_ENDPOINTS.CONSULTATION.CREATE, toFormData(payload), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as unknown as Promise<unknown>;
  },
};
