import type { BaseEntityRaw } from "@/shared/types";
import type { SepayWebhookRequest } from "./paymentService";

export interface CreateOrderRequest {
  studentId?: string;
  cartId: string;
}

export interface OrderItemRaw {
  id?: string;
  orderItemId?: string;
  orderId?: string;
  courseId?: string;
  courseName?: string;
  itemName?: string;
  price?: number | string;
  amount?: number | string;
  quantity?: number | string;
}

export interface OrderRaw extends BaseEntityRaw {
  id?: string;
  orderId?: string;
  orderCode?: string;
  studentId?: string;
  userId?: string;
  studentName?: string;
  studentEmail?: string;
  phone?: string;
  courseName?: string;
  courseNames?: string[];
  totalAmount?: number | string;
  amount?: number | string;
  status?: string | number;
  paymentStatus?: string;
  paymentMethod?: string;
  paymentId?: string;
  transactionDate?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  paymentDetails?: SepayWebhookRequest;
}

export interface CleanOrderItem {
  id: string;
  courseId: string;
  courseName: string;
  price: number;
  quantity: number;
  subTotal: number;
}

export interface CleanOrder {
  id: string;
  orderCode: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  phone?: string;
  courseName?: string;
  courseNames?: string[];
  totalAmount: number;
  status: "PENDING" | "PAID" | "CANCELLED" | "FAILED";
  paymentMethod: string;
  paymentId?: string;
  createdAt: string; // DD/MM/YYYY HH:mm
  items: CleanOrderItem[];
}
