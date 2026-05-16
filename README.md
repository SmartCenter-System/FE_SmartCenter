# FE SmartCenter 🎓

Dự án **Frontend** cho hệ thống **SmartCenter** — Nền tảng EdTech B2C chuyên biệt cho luyện thi THPT và phát triển kỹ năng.

Được xây dựng theo kiến trúc **Feature-based (Bulletproof React)**, hướng tới khả năng mở rộng cao, tối ưu hiệu năng và trải nghiệm người dùng premium.

---

## 🚀 Quick Start

### Yêu cầu
- **Node.js**: ≥ 20.x
- **Package Manager**: npm hoặc pnpm

### Cài đặt & Chạy Local
1. **Clone project & Install**:
   ```bash
   npm install
   ```
2. **Cấu hình môi trường**:
   Tạo file `.env.local` (nếu chưa có) và cấu hình URL Backend:
   ```env
   VITE_API_URL=/api
   ```
3. **Chạy Dev Server**:
   ```bash
   npm run dev
   ```
   > Truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🛠 Tech Stack

| Thành phần | Công nghệ sử dụng |
|---|---|
| **Core** | React 19 (Latest), TypeScript, Vite |
| **Styling** | Tailwind CSS v4, shadcn/ui, Lucide Icons |
| **Routing** | React Router v7 |
| **State** | Zustand v5 (+ persist middleware) |
| **Data Fetching** | TanStack Query v5 + Axios (Interceptor-based) |
| **Form Management** | React Hook Form + Zod Validation |
| **UX/UI Components** | Radix UI, Sonner (Toast), NProgress |

---

## 📁 Cấu Trúc Dự Án

Chúng tôi áp dụng cấu trúc **Feature-based Architecture** để tách biệt module:

```text
src/
├── app/               # Root: Providers, Router, App Entry
├── features/          # ⭐ Các module chức năng chính:
│   ├── auth/          #   - Authentication & Profile
│   ├── courses/       #   - Quản lý & Hiển thị Khóa học
│   ├── dashboard/     #   - Student Dashboard
│   ├── exam/          #   - Hệ thống bài thi & chấm điểm
│   ├── enrollment/    #   - Quy trình đăng ký & thanh toán
│   ├── review/        #   - Đánh giá & Feedback khóa học
│   └── ...            #   - Users, Classes, Combo, etc.
├── lib/               # Cấu hình thư viện (Axios, React Query, Env)
├── shared/            # Reusable code (UI Components, Layouts, Types)
└── styles/            # Global styles (Tailwind base)
```

---

## ✨ Tính Năng Nổi Bật

### 👔 Quản lý Đào tạo (Admin & Staff)
- **CMS Khóa học**: Bộ soạn thảo nội dung (Section/Lesson) chuyên sâu.
- **Quản lý Học viên**: Theo dõi tiến độ học tập và ghi danh (Enrollment).
- **User Management**: Phân quyền chi tiết (Admin, Staff, Lecturer, Student).

### 🎓 Hệ thống Học tập (Student & Lecturer)
- **Lecturer Portal**: Giảng viên chấm điểm bài thi, quản lý lớp học và tương tác học viên.
- **Smart Dashboard**: Thống kê streak học tập, tiến độ khóa học và chứng chỉ.
- **Review System**: Hệ thống đánh giá khóa học minh bạch cho học viên.

### 💳 Giao dịch & Thanh toán
- **Checkout Flow**: Tích hợp mã giảm giá (Voucher) và phương thức thanh toán VietQR/SePay.
- **Cart System**: Quản lý giỏ hàng khóa học linh hoạt.

---

## 🌐 Deployment (Vercel)

Dự án đã được cấu hình sẵn sàng để deploy lên **Vercel**.

### Các bước chuẩn bị:
1. Đảm bảo file `vercel.json` đã cấu hình các **Rewrites** cho API Proxy.
2. Thiết lập các Environment Variables trên Vercel:
   - `VITE_API_URL`: `/api`
   - `VITE_CLOUDINARY_CLOUD_NAME`: (Tên cloud của bạn)
   - `VITE_CLOUDINARY_UPLOAD_PRESET`: (Preset upload)

### Lệnh Build:
```bash
npm run build
```
Thư mục đầu ra sẽ là `dist/`.

---

## 📐 Quy Chuẩn Phát Triển

- **Naming**: `kebab-case` cho file/thư mục, `PascalCase` cho React Components.
- **Data Flow**: Luôn sử dụng `apiClient` từ `lib/axios` và bọc qua `React Query hooks`.
- **Git Strategy**: Tuân thủ conventional commits (feat, fix, refactor, docs).

---

*Cập nhật lần cuối: 16/05/2026*
