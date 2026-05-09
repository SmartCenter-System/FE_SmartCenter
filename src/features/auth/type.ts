import type { RoleType } from "@/shared/types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterLecturerRequest extends RegisterRequest {
  bio: string;
  expertise: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: RoleType;
  avatar?: string | null;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: RoleType | null;
  userId: string | null;
}

export interface AuthActions {
  setAuth: (payload: { accessToken: string; refreshToken: string; role: RoleType; userId: string | null }) => void;

  clearAuth: () => void;
}
