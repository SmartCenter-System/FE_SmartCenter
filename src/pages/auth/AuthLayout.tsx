import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      {/* Left panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900">
        <div className="absolute inset-0 bg-indigo-600/20 mix-blend-multiply z-10" />
        <img
          src="/images/auth_hero_bg.png"
          alt="Modern educational center"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2 font-bold text-2xl drop-shadow-md">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
              <GraduationCap className="h-8 w-8" />
            </div>
            <span>Smart Center</span>
          </div>
          <div className="max-w-md backdrop-blur-md bg-black/20 p-8 rounded-2xl border border-white/10 shadow-2xl">
            <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight">
              Nền tảng quản lý giáo dục toàn diện
            </h1>
            <p className="text-lg text-indigo-100">
              Giải pháp tối ưu hóa vận hành, quản lý học viên và nâng cao chất lượng giảng dạy.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-12">
        {/* Mobile Header */}
        <div className="flex lg:hidden items-center gap-2 font-bold text-2xl text-indigo-600 mb-8">
          <GraduationCap className="h-8 w-8" />
          <span>Smart Center</span>
        </div>
        {children}
      </div>
    </div>
  );
}
