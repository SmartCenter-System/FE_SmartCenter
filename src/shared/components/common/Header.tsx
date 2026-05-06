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

export default function Header({ variant = "fixed", tone = "auto" }: HeaderProps) {
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
  }, [variant]);

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
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        {/* Logo - Left */}
        <Link to="/" className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-700">
            <img src="/images/Logo.png" alt="SmartCenter" className="h-10 w-10 object-contain" />
          </div>
        </Link>

        {/* Center Navigation - Icon to Text Hover */}
        <nav className="hidden flex-1 items-center justify-center px-8 lg:flex">
          <div
            className={
              isScrolledPastHero
                ? "flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-1.5 transition-all duration-300 hover:bg-gray-200"
                : "flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-md px-1.5 py-1.5 transition-all duration-300 hover:bg-white/20 border border-white/20"
            }
          >
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
                        ? isScrolledPastHero
                          ? "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-secondary transition-transform duration-200 group-hover:-translate-y-[100%]"
                          : "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-secondary transition-transform duration-200 group-hover:-translate-y-[100%]"
                        : isScrolledPastHero
                          ? "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-blue-900 transition-transform duration-200 group-hover:-translate-y-[100%]"
                          : "absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-white transition-transform duration-200 group-hover:-translate-y-[100%]"
                    }
                  />
                  <span
                    className={
                      isActive
                        ? isScrolledPastHero
                          ? "pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-medium leading-none text-secondary opacity-0 transition-all duration-200 group-hover:opacity-100"
                          : "pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-medium leading-none text-secondary opacity-0 transition-all duration-200 group-hover:opacity-100"
                        : isScrolledPastHero
                          ? "pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-medium leading-none text-blue-900 opacity-0 transition-all duration-200 group-hover:opacity-100"
                          : "pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-medium leading-none text-white opacity-0 transition-all duration-200 group-hover:opacity-100"
                    }
                  >
                    {label}
                  </span>
                </div>
              </Link>
              );
            })}
          </div>
        </nav>

        {/* Right - Auth Links */}
        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className={
              isScrolledPastHero
                ? "text-sm font-medium text-blue-700 transition-colors hover:text-yellow-400"
                : "text-sm font-medium text-black/80 transition-colors hover:text-yellow-400"
            }
          >
            Đăng ký
          </Link>
          <Button
            asChild
            className={
              isScrolledPastHero
                ? "bg-yellow-400 text-blue-900 hover:bg-yellow-500 hover:text-white"
                : "bg-yellow-400 text-blue-900 hover:bg-yellow-500 hover:text-white"
            }
          >
            <Link to="/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
