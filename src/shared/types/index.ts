export type RoleType = "ADMIN" | "STUDENT" | "LECTURER" | "STAFF" | "GUEST";

// ─── API Structure ──────────────────────────────────────────
/**
 * Chuẩn chung cho mọi Response trả về từ Server.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
  traceId?: string;
  timestampUtc?: string;
}

/**
 * Chuẩn chung cho cấu trúc phân trang từ .NET
 */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export type PaginatedList<T> = PaginatedData<T>;

/**
 * Các trường dữ liệu hệ thống chung của một Raw Entity
 */
export interface BaseEntityRaw {
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
}

// ─── Base filter params ──────────────────────────────────
export interface BaseFilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  search?: string;
}

// ─── API Error ───────────────────────────────────────────
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

// ─── Select Option ───────────────────────────────────────
export interface SelectOption {
  id: string;
  name: string;
}
