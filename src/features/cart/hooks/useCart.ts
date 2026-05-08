import { useQuery } from "@tanstack/react-query";
import { cartService } from "../service";
import { useAuthStore } from "@/features/auth/store";

export function useCart() {
  const { userId } = useAuthStore();
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: () => cartService.get(userId as string),
    enabled: !!userId,
  });
}
