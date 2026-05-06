import { Outlet, Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";

export default function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-primary transition-transform hover:scale-105"
          >
            <GraduationCap className="h-6 w-6" />
            <span>Smart Center</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex font-medium">
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button className="font-medium rounded-full px-4 sm:px-6">Dùng thử miễn phí</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Logo and Contact */}
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span>Smart Center</span>
              </Link>
              <div className="space-y-4 text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span>hello@smartcenter.edu.vn</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span>+84 918 123 456</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <span>TPHCM, Việt Nam</span>
                </div>
              </div>
            </div>

            {/* Home Links */}
            <div className="space-y-6">
              <h3 className="font-bold text-foreground text-lg">Trang chủ</h3>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Lợi ích
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Khóa học
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Cảm nhận
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Hỏi đáp (FAQ)
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Us Links */}
            <div className="space-y-6">
              <h3 className="font-bold text-foreground text-lg">Về chúng tôi</h3>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Công ty
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Thành tựu
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Mục tiêu
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Profiles */}
            <div className="space-y-6">
              <h3 className="font-bold text-foreground text-lg">Mạng xã hội</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FaFacebookF className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FaLinkedinIn className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border/40 pt-8 text-center text-muted-foreground text-sm font-medium">
            <p>© 2026 Smart Center. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
