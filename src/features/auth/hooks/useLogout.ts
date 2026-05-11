import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { authService } from "@/features/services";

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success("Đã đăng xuất");
      navigate("/login", { replace: true });
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  });
}
