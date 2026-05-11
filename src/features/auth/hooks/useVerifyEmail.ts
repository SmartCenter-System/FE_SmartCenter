import { useMutation } from "@tanstack/react-query";
import { authService } from "@/features/services";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

export function useVerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useAuthStore((state) => state.role);

  return useMutation<void, Error, number>({
    mutationFn: (code) => authService.verifyEmail(code),
    onSuccess: () => {
      toast.success("Xác thực thành công");
      
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      
      if (from && from !== "/") {
        navigate(from, { replace: true });
      } else {
        // Default redirection based on role
        const r = String(role).toUpperCase();
        if (r === "ADMIN" || r === "1") navigate("/admin", { replace: true });
        else if (r === "STAFF" || r === "4") navigate("/staff", { replace: true });
        else if (r === "LECTURER" || r === "3") navigate("/lecturer", { replace: true });
        else navigate("/dashboard", { replace: true });
      }
    }
  });
}
