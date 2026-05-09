import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { cartService } from "../service";
import { useAuthStore } from "@/features/auth/store";

function resolveUserIdFromToken(token?: string | null) {
  if (!token) return null;
  try {
    const decoded = jwtDecode<Record<string, unknown>>(token);
    return (
      (decoded.sub as string | undefined) ??
      (decoded.userId as string | undefined) ??
      (decoded.nameid as string | undefined) ??
      (decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] as string | undefined) ??
      null
    );
  } catch {
    return null;
  }
}

export function useCart() {
  const { userId, accessToken } = useAuthStore();
  const effectiveUserId = userId ?? resolveUserIdFromToken(accessToken);

  return useQuery({
    queryKey: ["cart", effectiveUserId],
    queryFn: () => cartService.get(effectiveUserId as string),
    enabled: !!effectiveUserId,
  });
}
