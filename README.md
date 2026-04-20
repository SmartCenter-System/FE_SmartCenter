<<<<<<< HEAD
# FE_SmartCenter
=======
# FE SmartCenter

Dự án Frontend cho hệ thống **SmartCenter**, được xây dựng dựa trên nguyên tắc kiến trúc **Feature-based Architecture** (chuẩn Bulletproof React), giúp code base dễ mở rộng, dễ quản lý và dễ maintain khi làm việc nhóm.

## 🛠 Công nghệ sử dụng
- **Core**: React 19, TypeScript 6, Vite 8
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix UI primitives)
- **Routing**: React Router v7
- **State Management**: Zustand v5
- **Data Fetching & Caching**: TanStack Query (React Query) v5 & Axios
- **Form & Validation**: React Hook Form & Zod
- **Notifications**: Sonner

---

## 📁 Cấu trúc thư mục (Advanced Architecture)

Dự án được phân chia triệt để theo các module tính năng (`features/*`). Mỗi tính năng là một "domain" độc lập, tự giới hạn logic bên trong nó:

```text
src/
├── app/               # Setup cấu hình bắt đầu cho app (App.tsx, Router, Global Providers)
├── features/          # ⭐ Nơi chứa các module tính năng chính (Domain-driven)
│   ├── auth/          # VD: Đăng nhập, Đăng ký, Quên mật khẩu
│   ├── course/        # VD: Quản lý khóa học
│   ├── user/          # VD: Quản lý người dùng
│   └── ...
├── lib/               # Các thư viện/cấu hình tiện ích gốc (axios interceptors, env parsers, utils)
├── shared/            # Các thành phần tái sử dụng chia sẻ ở mọi nơi (UI, Layouts, Generic Hooks)
└── styles/            # Thiết lập biến CSS toàn cục (globals.css, tailwind base)
```

### 🧩 Mô phẫu 1 Feature Module
Để không bị nhập nhằng logic (Separation of Concerns), tất cả code thuộc về ví dụ tính năng `user` sẽ nằm gọn trong:

```text
features/user/
├── components/        # Dummy/Smart components dành riêng cho tính năng user
├── hooks/             # Custom React Hooks chứa logic xử lý
├── pages/             # Các trang (views) của tính năng này gắn với Route
├── services.ts        # Tổng hợp các hàm gọi REST API (tương tác qua Axios)
├── store.ts           # Quản lý state đặc thù của tính năng này qua Zustand
├── schema.ts          # Zod validation schemas
├── types.ts           # TypeScript interfaces/types
└── index.ts           # Barrel file để export các component ra ngoài giao tiếp
```

---

## 💻 Hướng dẫn chạy dự án

### Cài đặt dependencies
Make sure bạn đang dùng Node.js bản khá mới (>=20).
```bash
npm install
```

### Cấu hình môi trường (.env)
Tạo file `.env` ở root rắc vào các key cần thiết của dự án, trong template mẫu dùng bắt buộc:
```env
VITE_API_URL=http://localhost:3000/api
```

### Chạy môi trường Dev
```bash
npm run dev
```
> **Tip:** Dự án đã được tinh chỉnh tính năng VS Code Task, bạn có thể gõ `Ctrl + Shift + B` và chọn **"Mở server Dev"** để chạy nền siêu mượt.

### Lệnh đóng gói và kiểm lỗi
- Build App: `npm run build`
- Chạy Linter: `npm run lint`

---

## 📝 Quy chuẩn chung
1. **Thư mục & File thường**: Tên viết thường (lowercase) phân cách gạch ngang nếu dài.
2. **Feature Name**: Ưu tiên **số ít** (`auth`, `user`, `course`) để kiến trúc đồng bộ nhất quán.
3. **Components**: PascalCase (VD: `LoginForm.tsx`, `Header.tsx`).
4. **Export (Barrel Pattern)**: Tránh import sâu `../features/abc/pages/Xyx.tsx`. Luôn tạo `index.ts` để export tập trung và xài `../features/abc`.
>>>>>>> a15c26d (feat: initialize React project with Vite, TypeScript, Tailwind CSS, and core dependencies)
