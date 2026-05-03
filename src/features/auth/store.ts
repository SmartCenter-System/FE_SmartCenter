import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthActions, AuthState } from "./type";

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      role: null,

      setAuth: ({ accessToken, refreshToken, role }) =>
        set({
          accessToken,
          refreshToken,
          role,
        }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          role: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
