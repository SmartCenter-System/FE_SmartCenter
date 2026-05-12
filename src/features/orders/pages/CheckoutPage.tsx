import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { courseService } from "@/features/courses/services";
import { userService } from "@/features/users/services";
import { paymentService } from "@/features/orders/paymentService";
import { orderService } from "@/features/orders/service";
import { ChevronLeft, QrCode, Tag, Loader2, X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/shared/components/ui/card";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store";
import { useCart } from "@/features/cart/hooks/useCart";
import InfoStudentForm from "@/features/orders/component/infoStudentForm";
import { enrollmentService } from "@/features/enrollment";

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isValidCourseId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(id ?? ""),
  );
  const accessToken = useAuthStore((state) => state.accessToken);
  const userId = useAuthStore((state) => state.userId);

  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [fullNameInput, setFullNameInput] = useState<string | undefined>(undefined);
  const [emailInput, setEmailInput] = useState<string | undefined>(undefined);
  const [phoneInput, setPhoneInput] = useState<string | undefined>(undefined);
  const [paymentLink, setPaymentLink] = useState<any>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const resolveUserIdFromToken = (token?: string | null) => {
    if (!token) return null;
    try {
      const decoded = jwtDecode<Record<string, unknown>>(token);
      return (
        (decoded.sub as string | undefined) ??
        (decoded.userId as string | undefined) ??
        (decoded.nameid as string | undefined) ??
        (decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] as string | undefined) ??
        null
      );
    } catch {
      return null;
    }
  };

  const effectiveUserId = useMemo(() => {
    let resolvedId = userId;
    if (!resolvedId) {
      try {
        const stored = localStorage.getItem("auth-storage");
        if (stored) {
          const { state } = JSON.parse(stored);
          resolvedId = state?.userId || resolveUserIdFromToken(state?.accessToken);
        }
      } catch {
        // ignore malformed storage
      }
    }
    if (!resolvedId) {
      resolvedId = resolveUserIdFromToken(accessToken);
    }
    return resolvedId;
  }, [userId, accessToken]);

  const { data: userProfile } = useQuery({
    queryKey: ["checkout-user-profile", accessToken],
    enabled: !!accessToken,
    queryFn: async () => {
      try {
        const profile = (await userService.getProfile()) as any;
        
        // Check if response is HTML (proxy not working)
        if (typeof profile === 'string' && profile.includes('<!doctype')) {
          throw new Error("Got HTML response - proxy not configured correctly");
        }
        
        const fullName = [profile?.lastName, profile?.firstName]
          .filter(Boolean)
          .join(" ")
          .trim();

        const result = {
          firstName: profile?.firstName ?? "",
          lastName: profile?.lastName ?? "",
          fullName: fullName,
          email: profile?.email ?? "",
          phone: profile?.phone ?? "",
        };
        return result;
      } catch (error) {
        return {
          firstName: "",
          lastName: "",
          fullName: "",
          email: "",
          phone: "",
        };
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  // Auto-fill form inputs when profile is loaded (only once on mount)
  useEffect(() => {
    if (userProfile && userProfile.fullName) {
      setFullNameInput(userProfile.fullName);
      setEmailInput(userProfile.email);
      setPhoneInput(userProfile.phone);
    }
  }, [userProfile?.fullName, userProfile?.email, userProfile?.phone]);

  // Countdown timer for payment link expiration
  useEffect(() => {
    if (!paymentLink?.expireAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expireTime = new Date(paymentLink.expireAt).getTime();
      const remaining = Math.max(0, expireTime - now);

      setTimeRemaining(remaining);

      // Auto-refresh QR code when expired
      if (remaining === 0) {
        clearInterval(interval);
        toast.info("Link thanh toán đã hết hạn. Tạo link mới để tiếp tục.");
        setPaymentLink(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [paymentLink?.expireAt]);

  // Poll backend every 5s to check if order is paid
  useEffect(() => {
    if (!paymentLink) return;

    let cancelled = false;
    const checkInterval = 5000;
    const intervalId = setInterval(async () => {
      try {
        const resp = (await orderService.getMe()) as any;
        const orders = resp?.data ?? resp;
        if (!orders || !Array.isArray(orders)) {
          return;
        }

        const match = orders.find(
          (o: any) => o.orderId === paymentLink.orderId || o.orderCode === paymentLink.orderCode,
        );

        if (!match) {
          return;
        }

        const paid = Boolean(match?.paidAt) || (typeof match?.status === "string" && match.status.toLowerCase() === "paid");
        if (paid && !cancelled) {
          clearInterval(intervalId);
          toast.success("Thanh toán thành công. Đang chuyển tới khóa học...");
          setPaymentLink(null);

          // Try to derive the actual purchased course id from the order payload.
          // Fallback to the `id` route param if we can't find it.
          const purchasedCourseId =
            match?.courseId ||
            (match?.items && match.items.length > 0 && (match.items[0].courseId || match.items[0].productId)) ||
            id;
          navigate(`/courses/${purchasedCourseId}`);
        }
      } catch (error) {
        // [Order Poll] error checking order
      }
    }, checkInterval);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [paymentLink, id, navigate]);

  // ─── Queries & Mutations ───────────────────────────────────────
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["course", id],
    queryFn: () => courseService.getById(id as string),
    enabled: !!id && isValidCourseId,
  });

  const { data: enrollmentData } = useQuery({
    queryKey: ["myEnrollments"],
    queryFn: () => enrollmentService.getMyEnrollments(),
    enabled: !!accessToken,
  });

  const isAlreadyOwned = useMemo(() => {
    if (!enrollmentData?.items || !id) return false;
    return enrollmentData.items.some((item) => item.courseId === id);
  }, [enrollmentData, id]);

  const { isLoading: isLoadingCart } = useCart();

  // ─── Handlers ──────────────────────────────────────────────────
  if (isLoadingCourse || isLoadingCart) {
    return (
      <div className="bg-muted/30 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isValidCourseId) {
    return (
      <div className="bg-muted/30 min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Liên kết khóa học không hợp lệ.</p>
        <Button onClick={() => navigate("/courses")}>Quay lại danh sách</Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-muted/30 min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Không tìm thấy thông tin khóa học.</p>
        <Button onClick={() => navigate("/courses")}>Quay lại danh sách</Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleApplyVoucher = () => {
    if (voucher.toUpperCase() === "SMARTCENTER") {
      setDiscount(500000);
      toast.success("Áp dụng mã giảm giá thành công! (-500.000đ)");
    } else {
      setDiscount(0);
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
    }
  };

  const handleCheckout = async () => {
    if (!accessToken && !effectiveUserId) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      navigate("/login", { state: { from: { pathname: location.pathname } } });
      return;
    }

    if (!id) {
      toast.error("Không tìm thấy thông tin khóa học");
      return;
    }

    setIsLoadingPayment(true);
    try {
      const response = await paymentService.createLink({ courseId: id });
      setPaymentLink(response);
      toast.success("Đã tạo link thanh toán");
    } catch (error) {
      // Failed to create payment link
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const finalPrice = Math.max(0, course.basePrice - discount);

  return (
    <div className="bg-muted/30 min-h-screen pb-20 pt-8">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 -ml-4 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Thanh toán an toàn</h1>
          <p className="text-muted-foreground mt-2">Vui lòng kiểm tra lại thông tin trước khi thanh toán.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          <div className="lg:col-span-2 space-y-6">
            <InfoStudentForm
              fullName={fullNameInput ?? userProfile?.fullName ?? ""}
              phone={phoneInput ?? userProfile?.phone ?? ""}
              email={emailInput ?? userProfile?.email ?? ""}
              onFullNameChange={setFullNameInput}
              onPhoneChange={setPhoneInput}
              onEmailChange={setEmailInput}
            />

            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border/50">
                <CardTitle className="text-xl">Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6">
                  <label className="flex items-start gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer transition-all">
                    <div className="mt-1">
                      <div className="h-5 w-5 rounded-full border-4 border-primary flex items-center justify-center" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-base">Chuyển khoản QR tự động (SePay)</span>
                        <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Khuyên dùng</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        Hệ thống tự động kích hoạt khóa học trong vòng 3-5 giây sau khi thanh toán thành công.
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="h-10 px-3 bg-muted border border-border rounded-md flex items-center justify-center">
                          <QrCode className="h-6 w-6 text-foreground" />
                          <span className="ml-2 font-bold text-foreground text-sm">VietQR</span>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <img
                      src={course.imgUrl || ""}
                      alt={course.courseName}
                      className="w-20 h-16 object-cover rounded-md border"
                    />
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-2 leading-tight">{course.courseName}</h4>
                      <p className="text-muted-foreground text-xs mt-1">
                        {course.courseType === 1 ? "Học Online" : "Học Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-border w-full my-4" />

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Nhập mã giảm giá..."
                        className="pl-9"
                        value={voucher}
                        onChange={(e) => setVoucher(e.target.value)}
                      />
                    </div>
                    <Button variant="secondary" onClick={handleApplyVoucher}>
                      Áp dụng
                    </Button>
                  </div>

                  <div className="h-px bg-border w-full my-4" />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giá gốc:</span>
                      <span className="font-medium">{formatPrice(course.basePrice)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Giảm giá:</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-dashed border-border flex items-end justify-between">
                    <span className="font-semibold">Tổng thanh toán:</span>
                    <span className="text-3xl font-extrabold text-primary">{formatPrice(finalPrice)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4 bg-muted/20 pb-6 rounded-b-xl">
                  {!paymentLink ? (
                    <>
                      <Button
                        className="w-full h-12 text-lg shadow-md hover:shadow-lg transition-all"
                        onClick={() => handleCheckout()}
                        disabled={isLoadingPayment || isAlreadyOwned}
                      >
                        {isLoadingPayment ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Đang tạo link thanh toán...
                          </>
                        ) : isAlreadyOwned ? (
                          "Bạn đã sở hữu khóa học này"
                        ) : (
                          "Tiến hành thanh toán"
                        )}
                      </Button>
                      
                    </>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Quét mã QR để thanh toán</h3>
                        <button
                          onClick={() => setPaymentLink(null)}
                          className="p-1 hover:bg-muted rounded-md transition-colors"
                        >
                          <X className="h-5 w-5 text-muted-foreground" />
                        </button>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                        <img
                          src={paymentLink.qrCode}
                          alt="QR Code thanh toán"
                          className="h-64 w-64 object-contain"
                        />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mã đơn hàng:</span>
                          <span className="font-mono font-semibold">{paymentLink.orderCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Số tiền:</span>
                          <span className="font-semibold text-primary">
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                              paymentLink.totalAmount
                            )}
                          </span>
                        </div>
                        <div className={`flex justify-between p-2 rounded-md ${timeRemaining < 300000 ? "bg-red-50" : "bg-muted/50"}`}>
                          <span className={timeRemaining < 300000 ? "text-red-600 font-medium" : "text-muted-foreground"}>
                            Hết hạn trong:
                          </span>
                          <span className={`font-mono font-bold ${timeRemaining < 300000 ? "text-red-600" : "text-primary"}`}>
                            {formatTimeRemaining(timeRemaining)}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => setPaymentLink(null)}
                      >
                        Tạo mã QR mới
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
