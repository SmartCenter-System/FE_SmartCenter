import { jwtDecode } from "jwt-decode";
import type { AuthResponseRaw, CleanUser, JwtClaimsRaw } from "./type";
import type { RoleType } from "@/shared/types";

const ROLE_MAP: Record<string, RoleType> = {
  "1": "ADMIN",     "ADMIN": "ADMIN",
  "2": "STUDENT",   "STUDENT": "STUDENT",
  "3": "LECTURER",  "LECTURER": "LECTURER",
  "4": "STAFF",     "STAFF": "STAFF",
};

/**
 * Tách họ và tên từ chuỗi fullname đầy đủ để phù hợp với văn hóa Việt Nam.
 * Ví dụ: "Nguyễn Văn A" -> firstName: "A", lastName: "Nguyễn Văn"
 */
function splitFullName(fullname: string) {
  const parts = fullname.trim().replace(/\s+/g, " ").split(" ");
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[parts.length - 1], // "A"
    lastName: parts.slice(0, -1).join(" "), // "Nguyễn Văn"
  };
}

/**
 * Adapter chuẩn hóa dữ liệu User từ Auth API và JWT Token.
 * Gom rác từ JWT và API vào một object CleanUser duy nhất.
 */
export function normalizeAuthResponse(raw: AuthResponseRaw, token?: string): CleanUser {
  let claims: JwtClaimsRaw = {};
  
  if (token) {
    try {
      claims = jwtDecode<JwtClaimsRaw>(token);
    } catch (e) {
      console.error("JWT Decode failed", e);
    }
  }

  // 1. Chuẩn hóa ID (Ưu tiên claims nameid/sub từ Microsoft)
  const userId = String(raw?.userId ?? raw?.user?.userId ?? claims?.nameid ?? claims?.sub ?? claims?.userId ?? "");

  // 2. Chuẩn hóa Email
  const email = String(raw?.email ?? raw?.user?.email ?? claims?.email ?? claims?.unique_name ?? "");

  // 3. Chuẩn hóa Tên (Xử lý chuỗi fullname gộp theo văn hóa Việt Nam)
  const fallbackName = splitFullName(raw?.fullname ?? "");
  const firstName = String(raw?.user?.firstName ?? claims?.given_name ?? fallbackName.firstName ?? "");
  const lastName = String(raw?.user?.lastName ?? claims?.family_name ?? fallbackName.lastName ?? "");

  // 4. Chuẩn hóa Role (Ưu tiên Microsoft claim dài, rồi tới role thường)
  const rawRole = String(
    claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? 
    claims?.role ?? claims?.Role ?? raw?.role ?? raw?.user?.role ?? ""
  );
  
  const role: RoleType = ROLE_MAP[rawRole.toUpperCase()] || "GUEST";

  return {
    userId,
    email,
    firstName,
    lastName,
    role,
    avatar: raw?.user?.avatar ?? null,
  };
}
