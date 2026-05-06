import { Outlet, Link, useLocation } from "react-router-dom";
import { CreditCard, Menu } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function StaffLayout() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen w-full">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-background p-4 hidden md:block">
          <div className="flex items-center gap-2 mb-8 px-2 text-primary font-bold text-xl">
            <span>Staff Portal</span>
          </div>
          <p className="text-sm font-semibold text-muted-foreground mb-4 px-2">Menu chính</p>
          <nav className="space-y-2">
            <Link 
              to="/staff/enrollments" 
              className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm transition-colors ${location.pathname.includes('/staff/enrollments') ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              <CreditCard className="h-4 w-4" />
              Ghi danh & Tư vấn
            </Link>
            {/* Thêm các menu khác cho Staff sau này nếu cần */}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b bg-background flex items-center px-4 md:hidden gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-bold text-primary">Staff Portal</span>
          </header>
          <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
