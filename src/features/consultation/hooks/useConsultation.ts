import { useMutation } from "@tanstack/react-query";

import { consultationService } from "../service";
import type { CreateConsultationPayload } from "../type";

export function useCreateConsultation() {
  return useMutation({
    mutationFn: (data: CreateConsultationPayload) => consultationService.create(data),
  });
}
