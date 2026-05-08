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

      setAuth: ({ accessToken, refreshToken, role, userId }) =>
        set({
          accessToken,
          refreshToken,
          role,
          userId,
        }),
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
