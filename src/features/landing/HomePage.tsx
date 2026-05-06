import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { CoreValuesSection } from "./components/CoreValuesSection";
import { HeroSection } from "./components/HeroSection";
import { FeaturedCoursesSection } from "./components/FeaturedCoursesSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { FAQSection } from "./components/FAQSection";

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
    // TODO: Tích hợp việc gọi API để gửi dữ liệu về Backend
    console.log(data);
    toast.success("Đăng ký tư vấn thành công!", {
      description: "Đội ngũ Smart Center sẽ liên hệ với bạn trong vòng 24h tới.",
    });
    form.reset();
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Core Values Section from Figma */}
      <CoreValuesSection />

      {/* Featured Courses Section */}
      <FeaturedCoursesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

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
                  Đăng ký nhận tư vấn lộ trình học tập miễn phí. Đội ngũ học thuật của chúng tôi sẽ liên hệ để giúp bạn
                  xây dựng kế hoạch ôn thi hiệu quả nhất.
                </p>
              </div>

              <ul className="space-y-5">
                {[
                  "Tư vấn 1-1 định hướng khối thi",
                  "Kiểm tra năng lực đầu vào miễn phí",
                  "Học thử trải nghiệm nền tảng 7 ngày",
                ].map((feature, idx) => (
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
                            <Input
                              type="email"
                              placeholder="example@gmail.com"
                              className="h-11 bg-background"
                              {...field}
                            />
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
                            <Input
                              placeholder="Toán, Lý, Luyện thi THPTQG, v.v."
                              className="h-11 bg-background"
                              {...field}
                            />
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
    </>
  );
}
