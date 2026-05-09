import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings,
  ShieldCheck,
  ChevronRight,
  ShoppingCart,
  MessageSquare
} from "lucide-react";
import ProgressBar from "@/shared/components/common/ProgressBar";
import ScrollToTop from "@/shared/components/common/ScrollToTop";
import Header from "@/shared/components/common/Header";

export default function AdminLayout() {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: BookOpen, label: "Khóa học", path: "/admin/courses" },
    { icon: Users, label: "Người dùng", path: "/admin/users" },
    { icon: ShoppingCart, label: "Đơn hàng", path: "/admin/orders" },
    { icon: MessageSquare, label: "Tư vấn", path: "/admin/consultations" },
    { icon: Settings, label: "Cài đặt", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <ScrollToTop />
      <ProgressBar />
      <Header tone="solid" />
      
      <div className="flex flex-1 w-full pt-[72px]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-background p-4 hidden lg:block">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Admin</span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path) || (item.path === "/admin/dashboard" && location.pathname === "/admin");
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between group px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8 lg:p-10 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
