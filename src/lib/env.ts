function isValidUrlOrPath(v: unknown) {
  if (typeof v !== "string") return false;
  if (v.startsWith("/")) return true;
  try {
    // eslint-disable-next-line no-new
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

const raw = import.meta.env.VITE_API_URL;

let apiUrl: string | undefined;

if (isValidUrlOrPath(raw)) {
  apiUrl = raw as string;
} else if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn("VITE_API_URL is missing or invalid — falling back to '/api' for dev proxy.");
  apiUrl = "/api";
} else {
  // eslint-disable-next-line no-console
  console.error("❌ THIẾU HOẶC SAI BIẾN MÔI TRƯỜNG: VITE_API_URL", { raw });
  throw new Error("Invalid/Missing environment variables. Khai báo ngay VITE_API_URL trong file .env!");
}

export const env = {
  API_URL: apiUrl!,
} as const;
