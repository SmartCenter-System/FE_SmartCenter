interface FullscreenHeroProps {
    className?: string;
}

import { useNavigate } from "react-router-dom";

export default function FullscreenHero({ className }: FullscreenHeroProps) {
    const navigate = useNavigate();
    return (
        <section className={className ?? "relative isolate min-h-screen w-full overflow-hidden bg-[#0E3BAF] pt-[72px]"}>
            <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/video/SmartCenter.mp4"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/auth_hero_bg.png"
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_35%),linear-gradient(180deg,rgba(6,21,72,0.04)_0%,rgba(6,21,72,0.12)_55%,rgba(6,21,72,0.22)_100%)]" />

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => navigate('/courses')} className="h-11 rounded-md bg-yellow-400 px-5 text-sm font-semibold text-blue-950 shadow-sm transition-colors hover:bg-yellow-300">
                    Khám phá khóa học
                </button>
                <button onClick={() => navigate('/consultation')} className="h-11 rounded-md bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-100">
                    Tư vấn
                </button>
            </div>

            <div className="absolute bottom-4 right-4 rounded-full bg-cyan-400 p-2 text-blue-950 shadow-lg shadow-black/25">
                <span className="text-lg">🤖</span>
            </div>
        </section>

  );
}
