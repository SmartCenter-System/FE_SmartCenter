import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CreditCard, Menu, ChevronRight, Users, Settings } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import ProgressBar from "@/shared/components/common/ProgressBar";
import ScrollToTop from "@/shared/components/common/ScrollToTop";
import Header from "@/shared/components/common/Header";

export default function StaffLayout() {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/staff/dashboard" },
    { icon: CreditCard, label: "Ghi danh học viên", path: "/staff/enrollments" },
    { icon: Users, label: "Quản lý Tư vấn", path: "/staff/consultations" },
    { icon: Settings, label: "Cài đặt", path: "/staff/settings" },
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
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Users className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Staff</span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path) || (item.path === "/staff/dashboard" && location.pathname === "/staff");
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

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b bg-background flex items-center px-4 lg:hidden gap-3 sticky top-0 z-10">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-bold text-primary">Staff Portal</span>
          </header>
          <div className="p-4 md:p-8 lg:p-10 flex-1 overflow-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
