import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2, ShieldCheck, Mail, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";

const verifySchema = z.object({
  code: z.string().min(1, "Mã xác thực không được để trống").regex(/^\d+$/, "Mã xác thực phải là số"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export function VerifyEmailForm() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const { mutate: verify, isPending } = useVerifyEmail();

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (data: VerifyFormValues) => {
    verify(Number(data.code));
  };

  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight">Xác thực Email</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Chúng tôi đã gửi mã xác thực đến <span className="font-medium text-foreground">{email || "email của bạn"}</span>. 
          Vui lòng nhập mã để hoàn tất đăng ký.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã xác thực (OTP)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Nhập 6 chữ số" 
                        className="text-center text-2xl tracking-[0.5em] h-14 font-bold"
                        maxLength={6}
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="h-12 w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02] active:scale-95" 
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                "Xác nhận mã"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-sm text-center text-muted-foreground">
          Không nhận được mã?{" "}
          <button className="font-medium text-primary hover:underline" onClick={() => window.location.reload()}>
            Gửi lại mã
          </button>
        </p>
        <Link to="/register" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Quay lại đăng ký
        </Link>
      </CardFooter>
    </Card>
  );
}
