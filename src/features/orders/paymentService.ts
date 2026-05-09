import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

export interface CreatePaymentLinkRequest {
  courseId: string;
}

export interface PaymentLinkResponse {
  orderId: string;
  orderCode: string;
  totalAmount: number;
  bankName: string;
  bankAccount: string;
  description: string;
  qrCode: string;
  expireAt: string;
}

export const paymentService = {
  createLink: (data: CreatePaymentLinkRequest) =>
    apiClient.post(API_ENDPOINTS.PAYMENT.CREATE_LINK, data) as unknown as Promise<PaymentLinkResponse>,
};
