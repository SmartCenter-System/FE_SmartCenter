import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "../hooks/useRegister";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";

import { Loader2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Họ không được để trống"),
    lastName: z.string().min(1, "Tên không được để trống"),
    email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
    phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số").regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: registerUser, isPending } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerUser(data, {
      onError: (error: any) => {
        const serverErrors = error.response?.data?.errors;
        if (serverErrors && typeof serverErrors === "object") {
          Object.keys(serverErrors).forEach((key) => {
            const field = key.toLowerCase() as keyof RegisterFormValues;
            const message = Array.isArray(serverErrors[key]) 
              ? serverErrors[key][0] 
              : serverErrors[key];
            
            if (field in data) {
              form.setError(field as any, { type: "server", message });
            }
          });
        }
      }
    });
  };

  const inputClasses = "h-12 rounded-lg border-input bg-muted/30 px-4 text-sm shadow-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20";

  return (
    <Card className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      <CardHeader className="space-y-5 px-6 pb-6 pt-8 text-center sm:px-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3039A9] shadow-[0_8px_20px_rgba(48,57,169,0.24)]">
          <img src="/images/Logo.png" alt="Smart Center" className="h-7 w-7 object-contain" />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">Tạo tài khoản</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 sm:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-800">Họ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn" className={inputClasses} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-800">Tên</FormLabel>
                      <FormControl>
                        <Input placeholder="A" className={inputClasses} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-800">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-800">Số điện thoại</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="0123456789" className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-800">Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`${inputClasses} pr-11`}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 transition-colors hover:text-slate-900"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-800">Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className={inputClasses}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="h-12 w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02] active:scale-95" 
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng ký ngay"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center px-6 pb-8 sm:px-8">
        <p className="text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link to="/login" className="font-medium text-foreground underline-offset-3 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
