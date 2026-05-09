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
      email: null,
      firstName: null,
      lastName: null,

      setAuth: ({ accessToken, refreshToken, role, userId, email, firstName, lastName }) => {
        // Normalize role from Backend (1: Admin, 2: Student, 3: Lecturer, 4: Staff)
        let normalizedRole = role;
        const roleStr = String(role);
        
        if (roleStr === "1" || roleStr === "Admin" || roleStr === "ADMIN") normalizedRole = "ADMIN";
        else if (roleStr === "2" || roleStr === "Student" || roleStr === "STUDENT") normalizedRole = "STUDENT";
        else if (roleStr === "3" || roleStr === "Lecturer" || roleStr === "LECTURER") normalizedRole = "LECTURER";
        else if (roleStr === "4" || roleStr === "Staff" || roleStr === "STAFF") normalizedRole = "STAFF";

        set({
          accessToken,
          refreshToken,
          role: normalizedRole as any,
          userId,
          email: email ?? null,
          firstName: firstName ?? null,
          lastName: lastName ?? null,
        });
      },
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          role: null,
          userId: null,
          email: null,
          firstName: null,
          lastName: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist selected fields; don't persist `role` to localStorage
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
        email: state.email,
        firstName: state.firstName,
        lastName: state.lastName,
      }),
    },
  ),
);
