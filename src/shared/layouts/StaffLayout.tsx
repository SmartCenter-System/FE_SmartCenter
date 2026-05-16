import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CreditCard, ChevronRight, Users, Settings } from "lucide-react";
import ProgressBar from "@/shared/components/common/ProgressBar";
import ScrollToTop from "@/shared/components/common/ScrollToTop";
import Header from "@/shared/components/common/Header";

export default function StaffLayout() {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/staff/dashboard" },
    { icon: CreditCard, label: "Yêu cầu mới", path: "/staff/enrollments" },
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

        {/* Main Content with Mobile Submenu */}
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden pb-16 md:pb-0">
          {/* Mobile Portal Sub-header & Navigation */}
          <div className="border-b bg-background sticky top-[56px] sm:top-[64px] z-30 lg:hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border/40 bg-muted/10">
              <div className="h-6 w-6 bg-blue-600 rounded-md flex items-center justify-center text-white flex-shrink-0">
                <Users className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-sm tracking-tight text-primary">Staff Portal</span>
            </div>
            {/* Horizontal Scrolling Menu Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 scrollbar-none">
              {menuItems.map((item) => {
                const isActive = location.pathname.includes(item.path) || (item.path === "/staff/dashboard" && location.pathname === "/staff");
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="p-4 md:p-8 lg:p-10 flex-1 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
