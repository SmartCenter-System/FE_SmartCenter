import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-foreground">
      {}
      <div className="grid min-h-screen w-full items-center lg:grid-cols-[3fr_2fr]">
        
      
        <div
          className="
            flex
            min-h-screen
            flex-col
            items-end
            justify-center
            bg-white
            px-4
            py-8
            sm:px-6
            lg:px-24
          "
        >
          {/* 
            max-w-[500px]
            => làm form rộng hơn
          */}
          <div className="w-full max-w-[500px]">
            {children}
          </div>
        </div>

        {/* ================= IMAGE SECTION ================= */}
        <div
          className="
            relative
            hidden
            min-h-screen
            items-center
            justify-center
            bg-[#F7F8FC]
            lg:flex
          "
        >
          {/* Background blur effect */}
          <div className="absolute inset-12 rounded-full bg-white/40 blur-2xl" />

          {/* 
          
          */}
          <img
            src="/images/img-login.png"
            alt="Học sinh với sách vở"
            className="
              relative
              z-10
              h-auto
              w-full
              max-w-[520px]
              object-contain
              drop-shadow-[0_20px_40px_rgba(15,23,42,0.08)]
            "
          />
        </div>
      </div>
    </div>
  );
}