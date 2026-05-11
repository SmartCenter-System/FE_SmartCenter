import { useMutation } from "@tanstack/react-query";
import { orderService } from "../service";
import { toast } from "sonner";

export function useCreateOrder() {
  return useMutation({
    mutationFn: (data: { studentId?: string; cartId: string }) => orderService.create(data),
    onSuccess: (res: any) => {
      toast.success("Đang chuyển hướng thanh toán...");
      if (res?.paymentUrl) {
        window.location.href = res.paymentUrl;
      }
    }
  });
}
