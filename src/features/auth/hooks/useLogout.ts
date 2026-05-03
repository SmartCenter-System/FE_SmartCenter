import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { authService } from "@/features/services";

export function useLogout() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success("Đăng xuất thành công!");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      clearAuth();
      queryClient.clear();
      toast.error(error.message || "Có lỗi xảy ra khi đăng xuất");
      navigate("/login", { replace: true });
    },
  });
}
