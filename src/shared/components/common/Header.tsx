import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, CircleHelp, Phone, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useEffect, useState } from "react";

const navigationItems = [
  { icon: Home, label: "Trang chủ", path: "/" },
  { icon: BookOpen, label: "Khóa học", path: "/courses" },
  { icon: CircleHelp, label: "Hỗ trợ", path: "/help" },
  { icon: Phone, label: "Liên hệ", path: "/contact" },
  { icon: User, label: "Cá nhân", path: "/profile" },
];

interface HeaderProps {
  variant?: "fixed" | "inline";
  tone?: "auto" | "solid";
}

export default function Header({ variant = "fixed", tone = "solid" }: HeaderProps) {
  const location = useLocation();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    if (tone === "solid") {
      setIsScrolledPastHero(true);
      return;
    }

    if (variant !== "fixed") return;

    const updateHeaderBackground = () => {
      setIsScrolledPastHero(window.scrollY > window.innerHeight * 0.8);
    };

    updateHeaderBackground();
    window.addEventListener("scroll", updateHeaderBackground, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateHeaderBackground);
    };
  }, [variant, tone]);

  const headerClassName =
    tone === "solid"
      ? "fixed left-0 top-0 z-50 w-full border-b border-border/50 bg-white/95 backdrop-blur-sm"
      : variant === "inline"
      ? "relative z-20 w-full border-b border-border/50 bg-background/90 backdrop-blur"
      : isScrolledPastHero
        ? "fixed left-0 top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-border/50"
        : "fixed left-0 top-0 z-50 w-full bg-transparent";

  return (
    <header className={headerClassName}>
      <div className="flex items-center justify-between px-4 py-0 md:px-8 ">
        <div className="flex flex-1 items-center gap-4">
          <div
            className={`ml-4 flex items-center gap-3 rounded-full px-4 py-1.5 md:ml-8 ${
              isScrolledPastHero
                ? 'bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]'
                : ''
            }`}
          >
            <Link to="/" className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-transparent">
                <img src="/images/Logo.png" alt="SmartCenter" className="h-[30px] w-[30px] object-contain" />
              </div>
            </Link>

            <nav className="flex items-center justify-start">
              {navigationItems.map(({ icon: Icon, label, path }) => {
                const isActive = location.pathname === path;

                return (
                <Link key={label} to={path} className="group">
                  <div
                    className={
                      isScrolledPastHero
                        ? "relative flex h-10 w-20 items-center justify-center rounded-full transition-all duration-200 hover:bg-gray-200"
                        : "relative flex h-10 w-20 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/20"
                    }
                  >
                    <Icon
                      className={
                        isActive
                          ? "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-secondary transition-transform duration-200 group-hover:-translate-y-[100%] group-hover:text-yellow-400"
                          : isScrolledPastHero
                          ? "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-blue-700 transition-transform duration-200 group-hover:-translate-y-[100%] group-hover:text-yellow-400"
                          : "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-white transition-transform duration-200 group-hover:-translate-y-[100%] group-hover:text-yellow-400"
                      }
                    />
                    <span
                      className={
                        isActive
                          ? "pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-medium leading-none text-secondary opacity-0 transition-all duration-200 group-hover:text-yellow-400 group-hover:opacity-100"
                          : isScrolledPastHero
                            ? "pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-medium leading-none text-blue-900 opacity-0 transition-all duration-200 group-hover:text-yellow-400 group-hover:opacity-100"
                            : "pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-medium leading-none text-white opacity-0 transition-all duration-200 group-hover:text-yellow-400 group-hover:opacity-100"
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

          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/register"
              className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-blue-700 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-colors hover:bg-gray-50"
            >
              Đăng ký
            </Link>
            <Button
              asChild
              className="h-11 rounded-full bg-yellow-400 px-5 text-blue-900 hover:bg-yellow-500 hover:text-white"
            >
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
