import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import { useAuthStore } from "@/features/auth/store";

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

export type ConsultationStatus =
  | "PENDING"
  | "PROCESSING"
  | "CONSULTING"
  | "ACCEPTED"
  | "PROCESSED"
  | "REJECTED"
  | "CANCELLED";

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

export interface ConsultationQueryParams {
  Status?: number;
  PageIndex?: number;
  PageSize?: number;
  Search?: string;
}

interface RawConsultationItem {
  id?: string;
  consultationId?: string;
  fullName?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  courseId?: string;
  courseName?: string;
  courseInterest?: string;
  note?: string | null;
  message?: string | null;
  status?: unknown;
  createdAt?: string;
  createAt?: string;
}

interface ConsultationListPayload {
  data?: RawConsultationItem[];
  Data?: RawConsultationItem[];
  items?: RawConsultationItem[];
  Items?: RawConsultationItem[];
  totalCount?: number | string;
  TotalCount?: number | string;
  totalItems?: number | string;
  TotalItems?: number | string;
  total?: number | string;
  Total?: number | string;
  count?: number | string;
  Count?: number | string;
}

function normalizeConsultationStatus(status: unknown): ConsultationStatus {
  const value = String(status ?? "PENDING").trim().toUpperCase();

  if (value === "PROCESSING") return "PROCESSING";
  if (value === "CONSULTING") return "CONSULTING";
  if (value === "ACCEPTED") return "ACCEPTED";
  if (value === "PROCESSED") return "PROCESSED";
  if (value === "REJECTED") return "REJECTED";
  if (value === "CANCELLED") return "CANCELLED";
  return "PENDING";
}

function toApiConsultationStatus(status: ConsultationStatus) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "PROCESSING":
    case "CONSULTING":
    case "ACCEPTED":
      return "Processing";
    case "PROCESSED":
      return "Processed";
    case "REJECTED":
      return "Rejected";
    case "CANCELLED":
      return "Cancelled";
  }
}

function toNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function buildConsultationQuery(params?: ConsultationQueryParams) {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export const consultationService = {
  async getConsultations(params?: ConsultationQueryParams): Promise<{ totalCount: number; items: ConsultationRequest[] }> {
    const res = await apiClient.get<unknown>(
      `${API_ENDPOINTS.CONSULTATION.BASE}${buildConsultationQuery(params)}`,
    );
    const payload = res as ConsultationListPayload | RawConsultationItem[];
    // Handle both {items: []} and direct array responses
    const items = Array.isArray(payload) ? payload : payload.items ?? payload.Items ?? payload.data ?? payload.Data ?? [];
    const totalCount = Array.isArray(payload)
      ? items.length
      : toNumber(
          payload.totalCount ??
            payload.TotalCount ??
            payload.totalItems ??
            payload.TotalItems ??
            payload.total ??
            payload.Total ??
            payload.count ??
            payload.Count,
        ) ?? items.length;
    
    // Normalize fields
    const normalizedItems = items.map((item) => ({
      id: item.id || item.consultationId || "",
      fullName: item.fullName || item.customerName || "N/A",
      email: item.email || "N/A",
      phone: item.phone || item.phoneNumber || "N/A",
      courseId: item.courseId || "",
      courseName: item.courseName || item.courseInterest || "N/A",
      note: item.note || item.message || "",
      status: normalizeConsultationStatus(item.status),
      createdAt: item.createdAt || item.createAt || new Date().toISOString(),
    }));

    return { totalCount, items: normalizedItems };
  },

  async accept(staffId: string, consultationId: string): Promise<void> {
    return apiClient.post(API_ENDPOINTS.CONSULTATION.ACCEPT(staffId), {}, {
      params: { consultationId },
    }) as unknown as Promise<void>;
  },

  async reject(staffId: string, consultationId: string): Promise<void> {
    return apiClient.post(API_ENDPOINTS.CONSULTATION.REJECT(staffId), {}, {
      params: { consultationId },
    }) as unknown as Promise<void>;
  },

  async updateStatus(consultationId: string, status: ConsultationStatus): Promise<void> {
    const apiStatus = toApiConsultationStatus(status);
    const staffId = useAuthStore.getState().userId;

    if (status === "PROCESSING" || status === "CONSULTING" || status === "ACCEPTED" || status === "PROCESSED") {
      if (!staffId) {
        throw new Error("Không tìm thấy ID nhân viên trong phiên đăng nhập");
      }

      return this.accept(staffId, consultationId);
    }

    if (status === "REJECTED" || status === "CANCELLED") {
      if (!staffId) {
        throw new Error("Không tìm thấy ID nhân viên trong phiên đăng nhập");
      }

      return this.reject(staffId, consultationId);
    }

    throw new Error(`Trạng thái ${apiStatus} chưa được hỗ trợ`);
  },

  create(payload: CreateConsultationPayload) {
    return apiClient.post(API_ENDPOINTS.CONSULTATION.CREATE, toFormData(payload), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as unknown as Promise<unknown>;
  },
};
