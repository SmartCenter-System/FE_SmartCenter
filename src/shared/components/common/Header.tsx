import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Phone, Star, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { LogOut, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";

const navigationItems = [
  { icon: Home, label: "Trang chủ", path: "/" },
  { icon: BookOpen, label: "Khóa học", path: "/courses" },
  { icon: Star, label: "Đánh giá", path: "/review" },
  { icon: Phone, label: "Tư vấn", path: "/consultation" },
  { icon: User, label: "Cá nhân", path: "/profile" },
];

interface HeaderProps {
  variant?: "fixed" | "inline";
  tone?: "auto" | "solid";
}

export default function Header({ variant = "fixed", tone = "solid" }: HeaderProps) {
  const location = useLocation();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(tone === "solid");

  // Đồng bộ trạng thái scroll khi tone thay đổi giữa các trang
  useEffect(() => {
    if (tone === "solid") {
      setIsScrolledPastHero(true);
      return;
    }
    
    // Nếu là auto (trang chủ), khởi tạo là false
    setIsScrolledPastHero(window.scrollY > window.innerHeight * 0.8);
  }, [tone]);

  useEffect(() => {
    if (tone === "solid") return;
    if (variant !== "fixed") return;

    const updateHeaderBackground = () => {
      setIsScrolledPastHero(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", updateHeaderBackground, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateHeaderBackground);
    };
  }, [variant, tone]);

  const headerClassName =
    tone === "solid"
      ? "fixed left-0 top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-sm shadow-sm"
      : variant === "inline"
      ? "relative z-20 w-full border-b border-border/50 bg-background/90 backdrop-blur"
      : isScrolledPastHero
        ? "fixed left-0 top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm"
        : "fixed left-0 top-0 z-50 w-full bg-transparent";

  const accessToken = useAuthStore((state) => state.accessToken);
  const role = useAuthStore((state) => state.role);
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={`${headerClassName} transition-all duration-300`}>
      <div className="flex items-center justify-between px-2 py-1.5 sm:px-4 md:px-8">
        <div className="flex flex-1 items-center gap-2 sm:gap-4">
          <div
            className={`ml-1 flex items-center gap-2 sm:gap-3 rounded-full px-3 py-1.5 sm:ml-4 md:ml-8 transition-all ${
              isScrolledPastHero
                ? "bg-card shadow-sm border border-border/50"
                : ""
            }`}
          >
            <Link to="/" className="flex-shrink-0">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md bg-transparent">
                <img src="/images/Logo.png" alt="SmartCenter" className="h-[24px] w-[24px] sm:h-[30px] sm:w-[30px] object-contain" />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center justify-start">
              {navigationItems.map(({ icon: Icon, label, path }) => {
                const isActive = location.pathname === path;

                return (
                <Link key={label} to={path} className="group">
                  <div
                    className={
                      isScrolledPastHero
                        ? "relative flex h-10 w-20 items-center justify-center rounded-full transition-all duration-200 hover:bg-muted"
                        : "relative flex h-10 w-20 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10"
                    }
                  >
                    <Icon
                      className={
                        isActive
                          ? "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-primary transition-transform duration-200 group-hover:-translate-y-[100%]"
                          : isScrolledPastHero
                          ? "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-foreground/70 transition-transform duration-200 group-hover:-translate-y-[100%] group-hover:text-primary"
                          : "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-white transition-transform duration-200 group-hover:-translate-y-[100%] group-hover:text-yellow-400"
                      }
                    />
                    <span
                      className={
                        isActive
                          ? "pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[12px] font-bold leading-none text-primary opacity-0 transition-all duration-200 group-hover:opacity-100"
                          : isScrolledPastHero
                            ? "pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[12px] font-medium leading-none text-primary opacity-0 transition-all duration-200 group-hover:opacity-100"
                            : "pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[12px] font-medium leading-none text-white opacity-0 transition-all duration-200 group-hover:text-yellow-400 group-hover:opacity-100"
                      }
                    >
                      {label}
                    </span>
                  </div>
                </Link>
                );
              })}
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            <ThemeToggle className={isScrolledPastHero ? "text-foreground" : "text-white"} />
            {accessToken ? (
              <>
                {(() => {
                  let dashboardPath = "/dashboard";
                  const r = String(role).toUpperCase();
                  
                  if (r === "ADMIN" || r === "1") dashboardPath = "/admin";
                  else if (r === "STAFF" || r === "4") dashboardPath = "/staff";
                  else if (r === "LECTURER" || r === "3") dashboardPath = "/lecturer";
                  
                  return (
                    <div className="flex items-center gap-1.5 sm:gap-4">
                      {(r === "STUDENT" || r === "LECTURER" || r === "3") && (
                        <Link
                          to={r === "STUDENT" ? "/dashboard/my-courses" : "/lecturer/courses"}
                          className={`hidden md:flex items-center gap-2 text-sm font-bold transition-all hover:text-primary ${isScrolledPastHero ? "text-foreground" : "text-white"}`}
                        >
                          <BookOpen className="h-4 w-4" />
                          Khóa học của tôi
                        </Link>
                      )}
                      <Link
                        to={dashboardPath}
                        title="Dashboard"
                        aria-label="Dashboard"
                        className="flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                      </Link>
                    </div>
                  );
                })()}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                  onClick={() => handleLogout()}
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex h-9 sm:h-11 items-center rounded-full bg-card px-4 sm:px-5 text-xs sm:text-sm font-semibold text-primary shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-border/50 transition-colors hover:bg-muted"
                >
                  Đăng ký
                </Link>
                <Button
                  asChild
                  className="h-9 sm:h-11 rounded-full bg-yellow-400 px-3 sm:px-5 text-xs sm:text-sm text-blue-900 hover:bg-yellow-500 hover:text-white font-bold"
                >
                  <Link to="/login">Đăng nhập</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on screens < 768px) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border/50 bg-background/95 backdrop-blur-md py-2 md:hidden shadow-lg">
        {navigationItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={label} to={path} className="flex flex-col items-center gap-1 px-2 py-1">
              <Icon className={`h-4 w-4 ${isActive ? "text-primary scale-110 transition-transform font-black" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-bold leading-none ${isActive ? "text-primary font-black" : "text-muted-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
