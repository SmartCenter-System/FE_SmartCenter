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

export interface SepayWebhookRequest {
  id?: number;
  gateway?: string;
  transactionDate?: string; // "2023-12-08 15:43:00"
  accountNumber?: string;
  subAccount?: string;
  code?: string;
  content?: string;
  transferType?: string;
  description?: string;
  transferAmount?: number;
  accumulated?: number;
  referenceCode?: string; // Mã đơn hàng để đối chiếu
}

export const paymentService = {
  createLink: (data: CreatePaymentLinkRequest) =>
    apiClient.post(API_ENDPOINTS.PAYMENT.CREATE_LINK, data) as unknown as Promise<PaymentLinkResponse>,
};
