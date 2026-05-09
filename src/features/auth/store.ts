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

      setAuth: ({ accessToken, refreshToken, role, userId, email, firstName, lastName }) =>
        set({
          accessToken,
          refreshToken,
          role,
          userId,
          email: email ?? null,
          firstName: firstName ?? null,
          lastName: lastName ?? null,
        }),
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
