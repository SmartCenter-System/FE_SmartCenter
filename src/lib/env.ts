const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    "THIẾU BIẾN MÔI TRƯỜNG: VITE_API_URL\n" +
      "Vui lòng tạo file .env ở thư mục gốc và thêm: VITE_API_URL=http://localhost:3000",
  );
}

export const env = {
  API_URL,
} as const;
