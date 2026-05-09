import { apiClient } from "@/lib/axios";

export type ConsultationStatus = "PENDING" | "CONTACTED" | "COMPLETED" | "REJECTED";

export interface ConsultationRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  courseInterest: string;
  status: ConsultationStatus;
  createdAt: string;
  notes?: string;
}

export const consultationService = {
  async getConsultations(): Promise<ConsultationRequest[]> {
    const res = await apiClient.get("/api/ConsultationRequest") as any;
    return Array.isArray(res) ? res : (res?.data || []);
  },

  async updateStatus(id: string, status: ConsultationStatus): Promise<void> {
    return apiClient.patch(`/api/ConsultationRequest/${id}/status`, { status }) as any;
  },
};
