import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthActions, AuthState } from "./type";

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      userId: null,

      setAuth: ({ accessToken, refreshToken, role, userId }) => {
        // Normalize role from Backend (1: Admin, 2: Student, 3: Lecturer, 4: Staff)
        let normalizedRole = role;
        const roleStr = String(role);
        
        if (roleStr === "1" || roleStr === "Admin") normalizedRole = "ADMIN";
        else if (roleStr === "2" || roleStr === "Student") normalizedRole = "STUDENT";
        else if (roleStr === "3" || roleStr === "Lecturer") normalizedRole = "LECTURER";
        else if (roleStr === "4" || roleStr === "Staff") normalizedRole = "STAFF";

        set({
          accessToken,
          refreshToken,
          role: normalizedRole as any,
          userId,
        });
      },
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          role: null,
          userId: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
