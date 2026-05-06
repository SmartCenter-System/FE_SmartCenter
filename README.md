# FE SmartCenter 🎓

Dự án **Frontend** cho hệ thống **SmartCenter** — Nền tảng B2C EdTech phân phối khóa học luyện thi THPT.

Được xây dựng theo kiến trúc **Feature-based (Bulletproof React)**, hướng tới khả năng mở rộng, dễ maintain và làm việc nhóm hiệu quả.

---

## 🛠 Tech Stack

| Hạng mục | Công nghệ |
|---|---|
| **Core** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS v4 + shadcn/ui (Light/Dark Mode) |
| **Routing** | React Router v7 |
| **State** | Zustand v5 (+ persist middleware) |
| **Data Fetching** | TanStack Query v5 + Axios |
| **Form & Validation** | React Hook Form + Zod |
| **Notifications** | Sonner |

---

## 📁 Cấu Trúc Thư Mục

```text
src/
├── app/               # Bootstrap: App.tsx, Router, Global Providers
├── features/          # ⭐ Core modules (auth, courses, users, classes, landing)
├── lib/               # Configs & utils (axios instance, queryClient, env)
├── pages/             # Page-level components, phân theo role:
│   ├── admin/         #   └── courses/, users/, enrollments/
│   ├── staff/         #   └── enrollments/
│   ├── courses/       # User-facing course pages
│   ├── checkout/      # Checkout flow
│   └── auth/          # Login, Register
├── shared/            # Reusable code: UI components, layouts, services, types
└── styles/            # Global CSS (Tailwind base)
```

---

## ✅ Tính Năng Đã Hoàn Thành

### 🔐 Authentication System
- Login / Register với Shadcn UI Form + `react-hook-form` + Zod validation
- Quản lý session bằng **Zustand** (kèm `persist` → `localStorage`)
- Custom hooks: `useLogin`, `useRegister`, `useLogout` tích hợp React Query
- Axios interceptor: tự đính token Bearer, bắt lỗi 401 toàn cục

### 🎨 Design System
- Component library 100% từ **shadcn/ui** — Dark / Light Mode native
- `ThemeToggle` component chuyển chế độ linh hoạt
- Landing Page glassmorphism (HeroSection, FAQ, Testimonials)

### 📚 User — Khóa Học
- Danh sách khóa học với filter (format Online/Offline, level, search)
- Trang chi tiết khóa học (`/courses/:id`)
- Checkout page: chọn phương thức SePay / VietQR, nhập voucher, tính giá

### 🛡 Admin Panel (`/admin`)
- **Quản lý Khóa Học**: Danh sách + tạo/sửa khóa học (CourseEditorPage)
- **Course Content Editor**: Editor nội dung chương trình học
- **Quản lý Người Dùng**: Table phân trang, filter role/status, khoá/mở tài khoản, tạo tài khoản mới (Staff/Lecturer)

### 👔 Staff Panel (`/staff`)
- **Quản lý Đăng Ký**: Xem và xử lý danh sách enrollment

### 🔐 Route Guard & Phân Quyền
- **`PrivateRoute`**: Bảo vệ route yêu cầu đăng nhập — redirect về `/login` nèu chưa có session
- **`RoleGuard`**: Bảo vệ route theo role — redirect về `/unauthorized` nếu không đủ quyền
  - `/admin/*` → chỉ role `ADMIN`
  - `/staff/*` → role `STAFF` hoặc `ADMIN`
  - `/checkout/:id`, `/dashboard` → mọi user đã đăng nhập
- Post-login redirect thông minh: `ADMIN` → `/admin` · `STAFF` → `/staff/enrollments` · `STUDENT` → `/dashboard`

### 🎓 Student Dashboard (`/dashboard`)
- Trang tổng quan sau đăng nhập: thống kê học tập (streak, thời gian, chứng chỉ)
- Danh sách khóa học đang học kèm progress bar trực quan
- Section gợi ý khóa học phù hợp

### ⚙️ Hạ Tầng
- `createBaseService` factory: CRUD generic cho mọi model, không viết lại code
- `PaginatedResponse<T>`, `BaseFilterParams`, `ApiError` — type-safe data layer
- TanStack Query: `staleTime` 5 phút, auto-refetch on focus

---

## ⏳ Đang Phát Triển (WIP)

- **Payment Integration**: Kết nối SePay API tạo đơn hàng + QR thanh toán thực
- **Dashboard mock data**: `StudentDashboardPage` hiện dùng mock enrollments — cần BE endpoint `/me/enrollments`
- **Admin – Enrollment Management**: Submodule quản lý đăng ký từ góc nhìn Admin
- **Classes / Lịch Học**: Module quản lý lớp học (đang skeleton, chưa route)
- **Voucher API**: Thay thế hardcode `"SMARTCENTER"` bằng API call thực

---

## 💻 Hướng Dẫn Chạy Dự Án

### Yêu cầu
- Node.js ≥ 20
- npm

### Cài đặt
```bash
npm install
```

### Cấu hình môi trường
Tạo file `.env.local` ở gốc dự án:
```env
VITE_API_URL=http://localhost:3000/api
```

### Chạy Dev Server
```bash
npm run dev
```
> 💡 Tip: Dùng `Ctrl + Shift + B` → VS Code Task "Mở server Dev"

### Lệnh khác
```bash
npm run build   # Build production → dist/
npm run lint    # Chạy ESLint
```

---

## 📐 Quy Chuẩn Code

| Loại | Quy tắc | Ví dụ |
|---|---|---|
| Thư mục / File thường | `kebab-case` | `auth-guard/`, `base-service.ts` |
| Feature name | **Số ít** | `auth`, `user`, `course` |
| Component | `PascalCase` | `LoginForm.tsx`, `CourseTable.tsx` |
| Export | Barrel pattern (`index.ts`) | `import { CourseTable } from "@/features/courses"` |

---

## 🗺 Kiến Trúc Route

```
/                     → Landing Page (LandingLayout)
├── /login            → Đăng nhập
├── /register         → Đăng ký
├── /courses          → Danh sách khóa học
└── /courses/:id      → Chi tiết khóa học

[PrivateRoute — yêu cầu đăng nhập]
├── /dashboard        → Student Dashboard 🎓
└── /checkout/:id     → Thanh toán

[RoleGuard: ADMIN only]
/admin                → Admin Panel (AdminLayout)
├── /admin/courses          → Quản lý khóa học
├── /admin/courses/create   → Tạo mới
├── /admin/courses/:id/edit → Chỉnh sửa
├── /admin/courses/:id/content → Content Editor
└── /admin/users            → Quản lý người dùng

[RoleGuard: STAFF + ADMIN]
/staff                → Staff Panel (StaffLayout)
└── /staff/enrollments      → Quản lý đăng ký

/unauthorized         → Trang không có quyền
```

---

*Cập nhật lần cuối: 06/05/2026*
