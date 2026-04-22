import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url("VITE_API_URL phải là một URL hợp lệ"),
});

// Parse và validate các biến có tiền tố VITE_ từ import.meta.env
const _env = envSchema.safeParse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
});

if (!_env.success) {
  console.error("❌ THIẾU HOẶC SAI BIẾN MÔI TRƯỜNG:", _env.error.format());
  throw new Error("Invalid/Missing environment variables. Khai báo ngay VITE_API_URL trong file .env!");
}

export const env = {
  API_URL: _env.data.VITE_API_URL,
} as const;
