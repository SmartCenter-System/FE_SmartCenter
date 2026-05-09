export type RoleType = "ADMIN" | "STUDENT" | "LECTURER" | "STAFF" | "GUEST";

// ─── API Structure ──────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

// .NET standard PaginatedList structure
export interface PaginatedList<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
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
