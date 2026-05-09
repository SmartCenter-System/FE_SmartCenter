import { z } from "zod";
import { consultationSchema } from "./schema";

export type CreateConsultationPayload = z.infer<typeof consultationSchema>;
