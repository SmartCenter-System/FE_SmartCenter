import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const quickLinks = ["Lợi ích", "Khóa học", "Cảm nhận", "Câu hỏi thường gặp"];
const aboutLinks = ["Công ty", "Thành tựu", "Mục tiêu"];

const socialLinks = [
  { label: "Facebook", href: "#", icon: FaFacebook },
  { label: "Twitter", href: "#", icon: FaTwitter },
  { label: "LinkedIn", href: "#", icon: FaLinkedin },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Logo and Contact */}
            <div className="space-y-6">
              <RouterLink to="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span>Smart Center</span>
              </RouterLink>
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
                {quickLinks.map((item) => (
                  <li key={item}>
                    <RouterLink to="#" className="hover:text-primary transition-colors">
                      {item}
                    </RouterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Us Links */}
            <div className="space-y-6">
              <h3 className="font-bold text-foreground text-lg">Về chúng tôi</h3>
              <ul className="space-y-4 text-muted-foreground text-sm">
                {aboutLinks.map((item) => (
                  <li key={item}>
                    <RouterLink to="#" className="hover:text-primary transition-colors">
                      {item}
                    </RouterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Profiles */}
            <div className="space-y-6">
              <h3 className="font-bold text-foreground text-lg">Mạng xã hội</h3>
              <div className="flex gap-4">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      aria-label={item.label}
                      className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border/40 pt-8 text-center text-muted-foreground text-sm font-medium">
            <p>© 2026 Smart Center. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>
  );
}
