import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { consultationSchema } from "../schema";
import type { CreateConsultationPayload } from "../type";
import { useCreateConsultation } from "../hooks/useConsultation";
import { courseService } from "@/features/courses/services";

export default function ConsultationForm() {
  const form = useForm<CreateConsultationPayload>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      courseId: "",
      description: "",
    },
  });

  const { mutate: createConsultation, isPending } = useCreateConsultation();

  // Lấy danh sách khoá học cho dropdown
  const { data: courses } = useQuery({
    queryKey: ["courses-for-consultation"],
    queryFn: () => courseService.getPublicCourses({ PageSize: 100 }),
  });

  const onSubmit = (data: CreateConsultationPayload) => {
    // Nếu courseId rỗng thì bỏ ra khỏi payload
    const payload = { ...data };
    if (!payload.courseId) {
      delete (payload as Partial<CreateConsultationPayload>).courseId;
    }
    if (!payload.description) {
      delete (payload as Partial<CreateConsultationPayload>).description;
    }

    createConsultation(payload, {
      onSuccess: () => {
        toast.success("Gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.");
        form.reset();
      },
      onError: () => {
        toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại sau.");
      },
    });
  };

  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
          {/* ─── Hình minh hoạ ─── */}
          <div className="flex w-full justify-center lg:w-5/12">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-blue-100/60 blur-2xl" />
              <img
                src="/images/man-customer-service.png"
                alt="Tư vấn khoá học"
                className="relative z-10 w-64 max-w-full drop-shadow-lg sm:w-80 md:w-96"
              />
            </div>
          </div>

          {/* ─── Form tư vấn ─── */}
          <div className="w-full lg:w-7/12">
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 sm:p-8">
              {/* Header */}
              <div className="mb-6 text-center">
                <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-[#0E3BAF]/10 p-2.5">
                  <svg
                    className="h-6 w-6 text-[#0E3BAF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Tư vấn khoá học
                </h2>
              </div>

              {/* Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Họ và tên */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập họ và tên"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Nhập email"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Số điện thoại */}
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Nhập số điện thoại"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Khoá học */}
                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Khoá học</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 w-full">
                              <SelectValue placeholder="Chọn khoá học" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courses?.items?.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mô tả */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập nội dung cần tư vấn..."
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 w-full bg-[#0E3BAF] text-base font-semibold text-white hover:bg-[#0E3BAF]/90"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Đang gửi...
                      </span>
                    ) : (
                      "Gửi tư vấn"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}