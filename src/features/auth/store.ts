import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthActions, AuthState } from "./type";

const ROLE_MAP: Record<string, string> = {
  "1": "ADMIN",
  "ADMIN": "ADMIN",
  "2": "STUDENT",
  "STUDENT": "STUDENT",
  "3": "LECTURER",
  "LECTURER": "LECTURER",
  "4": "STAFF",
  "STAFF": "STAFF",
};

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

      setAuth: (data) => {
        const rawRole = String(data.role || "");
        const normalizedRole = ROLE_MAP[rawRole.toUpperCase()] || null;

        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          role: normalizedRole as any,
          userId: data.userId,
          email: data.email ?? null,
          firstName: data.firstName ?? null,
          lastName: data.lastName ?? null,
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
    },
  ),
);

// Multi-tab synchronization
window.addEventListener("storage", (event) => {
  if (event.key === "auth-storage") {
    // Re-hydrate the store if localStorage changes in another tab
    useAuthStore.persist.rehydrate();
    
    // If we just logged out in another tab, redirect to login
    const newState = JSON.parse(event.newValue || "{}");
    if (!newState.state?.accessToken && !window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }
});
