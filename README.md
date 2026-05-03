# FE SmartCenter 🚀

Dự án Frontend cho hệ thống **SmartCenter** (Nền tảng B2C EdTech - Phân phối khóa học luyện thi THPT), được xây dựng dựa trên nguyên tắc kiến trúc **Feature-based Architecture** (chuẩn Bulletproof React), giúp code base dễ mở rộng, dễ quản lý và dễ maintain khi làm việc nhóm.

## 🛠 Công nghệ sử dụng
- **Core**: React 19, TypeScript 6, Vite 8
- **Styling**: Tailwind CSS v4, shadcn/ui (Hỗ trợ Light/Dark Mode hoàn hảo)
- **Routing**: React Router v7
- **State Management**: Zustand v5 (kèm persist middleware)
- **Data Fetching & Caching**: TanStack Query (React Query) v5 & Axios
- **Form & Validation**: React Hook Form & Zod
- **Notifications**: Sonner

---

## 📁 Cấu trúc thư mục (Advanced Architecture)

Dự án được phân chia triệt để theo các module tính năng (`features/*`). Mỗi tính năng tự giới hạn logic bên trong nó:

```text
src/
├── app/               # Setup cấu hình bắt đầu cho app (App.tsx, Router, Global Providers)
├── features/          # ⭐ Nơi chứa các module tính năng chính (auth, course, user...)
├── lib/               # Utility libs & configs (axios interceptors, env parsers, queryClient)
├── shared/            # Các code tái sử dụng (components UI chung, generic types, BaseService factory)
└── styles/            # Thiết lập CSS toàn cục (tailwind base)
```

### 🧩 Core Features & Utilities (Tính năng cốt lõi đã xây dựng)

1. **Authentication Flow Hoàn Chỉnh (Card 2.1)**
   - Quản lý phiên đăng nhập (Token/Role) bằng `Zustand` kết hợp `persist` lưu trữ an toàn dưới `localStorage`.
   - Tích hợp các Custom Hooks API (`useLogin`, `useRegister`, `useLogout`) với React Query.
   - Các Form Đăng nhập/Đăng ký chuẩn mực bằng Shadcn UI `Form`, quản lý trạng thái qua `react-hook-form` và kiểm tra logic bằng `zod`.
   - Bảo vệ thông tin đăng nhập Dev (không hardcode) thông qua biến môi trường tại `.env.local`.

2. **Hệ thống Design System Hiện Đại**
   - Các components tái sử dụng 100% bằng Shadcn UI, hỗ trợ mượt mà **Dark/Light Mode** bằng biến CSS toàn cục.
   - Tích hợp component `ThemeToggle` để chuyển đổi giao diện linh hoạt.
   - Giao diện Landing Page cực đẹp, phong cách Glassmorphism, thân thiện với đối tượng Học sinh THPT.

3. **Khởi tạo và Intercept Axios (`src/lib/axios.ts`)**
   - Đính kèm Token Bearer tự động vào mọi request.
   - Bắt lỗi HTTP 4xx, 5xx toàn cục và hiển thị Toast thông báo.
   - Xử lý hết hạn phiên đăng nhập (lỗi 401) và điều hướng về trang Login.

4. **Generic BaseService Factory (`src/shared/services/BaseService.ts`)**
   - Cung cấp hàm `createBaseService` trả về 100% các thao tác CRUD cơ bản cho các Model mà không cần viết lại mã.

5. **Khai báo Type Toàn Cục & Query Config**
   - `Tanstack Query`: Cài đặt thời gian `staleTime` 5 phút, tự động refetch lúc focus trình duyệt.
   - Generic intefaces phục vụ fetch data chuẩn như `PaginatedResponse<T>`, `BaseFilterParams`, `ApiError`.

---

## 💻 Hướng dẫn chạy dự án

### Cài đặt dependencies
Yêu cầu: Node.js bản mới (>=20) + `npm`.
```bash
npm install
```

### Cấu hình môi trường (.env)
Tạo file `.env` ở gốc (đã được Ignore):
```env
VITE_API_URL=http://localhost:3000/api
```

### Chạy môi trường Dev
```bash
npm run dev
# Tip: Sử dụng `Ctrl + Shift + B` để truy cập VS Code Tasks -> "Mở server Dev"
```

### Lệnh đóng gói 
- Build App ra `dist`: `npm run build`
- Chạy Linter: `npm run lint`

---

## 📝 Quy chuẩn chung
1. **Thư mục & File thường**: Tên viết thường (lowercase) dùng gạch ngang (`-`).
2. **Feature Name**: Luôn là **số ít** (`auth`, `user`, `course`) để kiến trúc đồng bộ nhất quán.
3. **Components**: Sống bên trong feature hoặc `shared` cần định dạng PascalCase (VD: `LoginForm.tsx`).
4. **Export (Barrel Pattern)**: Tránh import sâu `../auth/pages/Xyz.tsx`. Luôn tạo `index.ts` để gộp export và rút ngắn đường dẫn thành `../auth`.
