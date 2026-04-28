import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight, CheckCircle2, Sparkles, LayoutDashboard, Users, BookOpen } from "lucide-react";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";

const consultationSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ tên của bạn"),
  email: z.string().email("Email không hợp lệ"),
  topic: z.string().min(1, "Vui lòng nhập chủ đề bạn quan tâm"),
});

type ConsultationValues = z.infer<typeof consultationSchema>;

export default function HomePage() {
  const form = useForm<ConsultationValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: "",
      email: "",
      topic: "",
    },
  });

  const onSubmit = (data: ConsultationValues) => {
    // TODO: Integrate API call
    console.log(data);
    toast.success("Đăng ký tư vấn thành công!", {
      description: "Đội ngũ Smart Center sẽ liên hệ với bạn trong vòng 24h tới."
    });
    form.reset();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <GraduationCap className="h-6 w-6" />
            <span>Smart Center</span>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex font-medium">Đăng nhập</Button>
            </Link>
            <Link to="/register">
              <Button className="font-medium rounded-full px-4 sm:px-6">Dùng thử miễn phí</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-24 md:py-32 text-center">
          {/* Abstract Background Effects */}
          <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-primary/10 blur-[120px]"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full max-w-4xl space-y-8 flex flex-col items-center">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-sm">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Nền tảng Khóa học dành cho Học sinh Cấp 3
            </Badge>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Học tập bứt phá <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Chinh phục Đại học
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl font-light">
              Hệ thống học trực tuyến thông minh cung cấp các lộ trình luyện thi và khóa học chất lượng cao, giúp học sinh THPT nắm chắc kiến thức và tự tin đạt điểm cao.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full rounded-full px-8 h-14 text-base font-medium shadow-[0_0_40px_-10px_var(--primary)] transition-all hover:scale-105">
                  Bắt đầu ngay <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-base font-medium transition-all hover:bg-secondary">
                Xem bảng giá
              </Button>
            </div>
          </div>

          {/* Dashboard Mockup Image */}
          <div className="mt-16 w-full max-w-5xl relative mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 bottom-0 h-1/3 mt-auto" />
            <div className="rounded-xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/20 bg-background">
              <img 
                src="/images/dashboard_mockup.png" 
                alt="Giao diện nền tảng khóa học THPT" 
                className="w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Hệ sinh thái tính năng</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Mọi công cụ bạn cần để điều hành một trung tâm giáo dục hàng đầu đều có sẵn tại đây.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Bài giảng sinh động", desc: "Kho video bài giảng chất lượng cao, hình ảnh minh họa thực quan giúp tiếp thu nhanh.", icon: BookOpen },
                { title: "Lộ trình cá nhân hóa", desc: "Theo sát tiến độ từng học sinh, đề xuất bài tập và bài kiểm tra phù hợp với năng lực.", icon: Users },
                { title: "Phân tích điểm số", desc: "Hệ thống tự động chấm điểm và đánh giá ưu/nhược điểm từng môn học để học sinh dễ dàng theo dõi.", icon: LayoutDashboard }
              ].map((feature, i) => (
                <Card key={i} className="border-border/50 bg-card hover:border-primary/50 transition-colors shadow-sm">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Consultation Registration Section */}
        <section className="relative z-10 py-24 px-6 border-t border-border/50 bg-background overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-blue-500/10 blur-[100px]"></div>

          <div className="mx-auto w-full max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    Sẵn sàng bứt phá <span className="text-primary">điểm số?</span>
                  </h2>
                  <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                    Đăng ký nhận tư vấn lộ trình học tập miễn phí. Đội ngũ học thuật của chúng tôi sẽ liên hệ để giúp bạn xây dựng kế hoạch ôn thi hiệu quả nhất.
                  </p>
                </div>
                
                <ul className="space-y-5">
                  {["Tư vấn 1-1 định hướng khối thi", "Kiểm tra năng lực đầu vào miễn phí", "Học thử trải nghiệm nền tảng 7 ngày"].map((feature, idx) => (
                    <li key={idx} className="flex items-center text-foreground font-medium text-lg">
                      <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Card className="shadow-2xl border-border/60 bg-card/50 backdrop-blur-sm lg:ml-auto w-full max-w-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Đăng ký tư vấn ngay</CardTitle>
                  <CardDescription className="text-base">
                    Vui lòng để lại thông tin, chúng tôi sẽ gọi lại cho bạn.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và Tên</FormLabel>
                            <FormControl>
                              <Input placeholder="Nguyễn Văn A" className="h-11 bg-background" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Địa chỉ Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="example@gmail.com" className="h-11 bg-background" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bạn đang quan tâm môn học nào?</FormLabel>
                            <FormControl>
                              <Input placeholder="Toán, Lý, Luyện thi THPTQG, v.v." className="h-11 bg-background" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full h-11 text-base font-medium mt-2">
                        Gửi yêu cầu tư vấn
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border/40 py-8 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5" />
            <span className="font-bold text-foreground">Smart Center</span>
          </div>
          <p>© 2026 Nền tảng Smart Center. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </div>
  );
}
