import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "../hooks/useLogin";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";

const loginSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onError: (error: any) => {
        const serverErrors = error.response?.data?.errors;
        if (serverErrors && typeof serverErrors === "object") {
          Object.keys(serverErrors).forEach((key) => {
            const field = key.toLowerCase() as keyof LoginFormValues;
            if (field in data) {
              const message = Array.isArray(serverErrors[key]) ? serverErrors[key][0] : serverErrors[key];
              form.setError(field as any, { type: "server", message });
            }
          });
        }
      }
    });
  };

  return (
    <Card className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      <CardHeader className="space-y-5 px-6 pb-6 pt-8 text-center sm:px-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3039A9] shadow-[0_8px_20px_rgba(48,57,169,0.24)]">
          <img src="/images/Logo.png" alt="Smart Center" className="h-7 w-7 object-contain" />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 sm:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-800">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Nhập email của bạn"
                        className="h-12 rounded-lg border-input bg-muted/30 px-4 text-sm shadow-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20"
                        {...field}
                      />
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
                    <div className="flex items-center justify-between gap-3">
                      <FormLabel className="text-sm font-medium text-slate-800">Password</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu của bạn"
                          className="h-12 rounded-lg border-input bg-muted/30 px-4 pr-11 text-sm shadow-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20"
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
                "Đăng nhập"
              )}
            </Button>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium text-slate-400">HOẶC</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-full border-input bg-background text-sm font-bold text-foreground shadow-none hover:bg-muted transition-all hover:scale-[1.02] active:scale-95"
            >
              <svg viewBox="0 0 48 48" aria-hidden="true" className="mr-3 h-5 w-5">
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.339 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.967 3.036l5.657-5.657C34.1 6.053 29.3 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.648-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.153 7.967 3.036l5.657-5.657C34.1 6.053 29.3 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.207 0 9.91-1.993 13.445-5.243l-6.224-5.243C29.189 35.091 26.749 36 24 36c-5.318 0-9.623-3.322-11.288-7.988l-6.522 5.025C9.494 39.556 16.026 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.255 3.657-4.245 6.597-8.082 7.514l.002-.001 6.224 5.243C33.026 41.292 44 33.333 44 24c0-1.341-.138-2.648-.389-3.917z"
                />
              </svg>
              Đăng nhập bằng Google
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center px-6 pb-8 sm:px-8">
        <p className="text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="font-medium text-foreground underline-offset-3 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
