import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { toast } from "sonner";

export default function HomePage() {
  const [formData, setFormData] = useState({ name: "", email: "", topic: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Vui lòng điền đầy đủ họ tên và email.");
      return;
    }
    // TODO: Week 2 Integrate API call
    toast.success("Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.");
    setFormData({ name: "", email: "", topic: "" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-24 text-center">
        {/* Abstract Background Effects */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute right-0 top-0 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/20 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-cyan-700/20 blur-[100px]"></div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full max-w-4xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-200">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            SmartCenter Platform 2026
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Empowering the <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Community Rescue
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-slate-300 sm:text-xl md:text-2xl font-light">
            Building a resilient and connected network for fast, reliable emergency assistance and coordination.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="rounded-full px-8 h-12 text-base font-medium shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] bg-blue-600 hover:bg-blue-500 text-white transition-all hover:scale-105">
              Explore Network
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-medium border-slate-700 text-slate-300 hover:bg-slate-800 transition-all hover:text-white">
              View Analytics
            </Button>
          </div>
        </div>
      </section>

      {/* Consultation Registration Section */}
      <section className="relative z-10 -mt-20 px-6 pb-24">
        <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl md:p-12">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
                Ready to Join the <br /> <span className="text-blue-400">Force?</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Register for a free consultation. Our team will guide you on how to integrate and manage your operations smoothly on the platform.
              </p>
              
              <ul className="space-y-4 pt-4">
                {["24/7 dedicated support", "Comprehensive onboarding", "Customized workflow setups"].map((feature, idx) => (
                  <li key={idx} className="flex items-center text-slate-300">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-300 text-left block">
                    Full Name
                  </label>
                  <Input 
                    id="name" 
                    placeholder="Nguyễn Văn A" 
                    className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 h-11"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300 text-left block">
                    Email Address
                  </label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="example@gmail.com" 
                    className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 h-11"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="topic" className="text-sm font-medium text-slate-300 text-left block">
                    Area of Interest
                  </label>
                  <Input 
                    id="topic" 
                    placeholder="Organization Setup, Staffing, etc." 
                    className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 h-11"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md transition-colors mt-2">
                  Request Consultation
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
