import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full bg-[#11186b] dark:bg-background overflow-hidden border-b border-border/10">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent opacity-50 blur-2xl"></div>

      <div className="relative container mx-auto px-4 md:px-8 pt-12 pb-20 md:pt-16 md:pb-24 flex flex-col items-center z-10">
        {/* Banner Image */}
        <div className="w-full max-w-6xl mx-auto animate-in fade-in zoom-in duration-1000">
          {/* We use aspect ratio to ensure it reserves space even before loading */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-[32px] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 group">
            <div className="absolute inset-0 bg-primary/20 animate-pulse -z-10"></div>
            <img
              src="/images/hero-image.png"
              alt="Smart Center Hero Banner"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/1920x800/17218F/FFFFFF?text=Please+upload+hero-image.png";
              }}
            />
          </div>
        </div>

        {/* Call to Action below the banner */}
        <div className="mt-12 md:mt-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both space-y-6 w-full max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Nền tảng Khóa học dành cho <br className="hidden sm:block" />
            <span className="text-secondary">Học sinh Cấp 3</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-light">
            Khám phá lộ trình học tập cá nhân hóa, giúp bạn chinh phục mọi kỳ thi và vững bước vào cánh cửa Đại học mơ
            ước.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full rounded-full px-8 h-14 text-base font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-secondary/25 transition-all hover:-translate-y-1"
              >
                Bắt đầu học ngay
              </Button>
            </Link>
            <Link to="/courses" className="w-full sm:w-auto">
              <Button size="lg" className="w-full rounded-full px-8 h-14 text-base font-bold bg-white text-primary hover:bg-white/90 shadow-lg transition-all hover:-translate-y-1">
                Khám phá khóa học
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
