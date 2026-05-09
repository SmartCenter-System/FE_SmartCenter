import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { authService } from "@/features/services";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success("Yêu cầu đã được gửi! Vui lòng kiểm tra email của bạn.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.");
    }
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    mutation.mutate(data.email);
  };

  if (mutation.isSuccess) {
    return (
      <Card className="w-full max-w-md border-none shadow-none bg-transparent animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Kiểm tra Email</CardTitle>
          <CardDescription className="text-muted-foreground">
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4">
          <Link to="/login" className="w-full">
            <Button variant="outline" className="w-full h-12 rounded-full font-bold">
              Quay lại Đăng nhập
            </Button>
          </Link>
          <button 
            onClick={() => mutation.reset()}
            className="text-sm text-primary hover:underline"
          >
            Gửi lại email yêu cầu
          </button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold tracking-tight">Quên mật khẩu?</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="h-12 w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02] active:scale-95" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Gửi yêu cầu"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link to="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Quay lại Đăng nhập
        </Link>
      </CardFooter>
    </Card>
  );
}
