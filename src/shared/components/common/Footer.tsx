import { Mail, MapPin, Phone } from "lucide-react";

const quickLinks = ["Lợi ích", "Khóa học", "Cảm nhận", "Câu hỏi thường gặp"];
const aboutLinks = ["Công ty", "Thành tựu", "Mục tiêu"];

const socialLinks = [
  { label: "Facebook", href: "#", text: "Fb" },
  { label: "Twitter", href: "#", text: "Tw" },
  { label: "LinkedIn", href: "#", text: "In" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-[#f4f4f5] text-[#2f2f35]">
      <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-12 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-800">
              <img src="/images/Logo.png" alt="SmartCenter" className="h-7 w-7 object-contain" />
            </div>

            <ul className="space-y-4 text-base text-[#2f2f35]">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4" />
                <span>smartcenter.admin@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4" />
                <span>+91 91813 23 2309</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4" />
                <span>Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#1f1f24]">Trang chủ</h3>
            <ul className="space-y-2 text-base text-[#4c4c53]">
              {quickLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-blue-700">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#1f1f24]">Về chúng tôi</h3>
            <ul className="space-y-2 text-base text-[#4c4c53]">
              {aboutLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-blue-700">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#1f1f24]">Mạng xã hội</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, text }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent bg-[#ececee] text-xs font-semibold text-[#34343a] transition-colors hover:border-border hover:bg-white"
                >
                  {text}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/70 pt-6 text-center text-sm text-[#6d6d75]">
          <p>© 2023 SmartCenter. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </footer>
  );
}
