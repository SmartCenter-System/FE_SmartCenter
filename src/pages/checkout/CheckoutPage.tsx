import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/courses/services";
import { 
  ChevronLeft, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Tag, 
  Loader2 
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch course info
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => courseService.getCourseById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="bg-muted/30 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

  const handleApplyVoucher = () => {
    if (voucher.toUpperCase() === "SMARTCENTER") {
      setDiscount(500000);
      toast.success("Áp dụng mã giảm giá thành công! (-500.000đ)");
    } else {
      setDiscount(0);
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
    }
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    // TODO: Connect to backend to create order and get SePay payment URL
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Chuyển hướng đến cổng thanh toán SePay...");
      // navigate(`/payment-processing/${orderId}`)
    }, 1500);
  };

  const finalPrice = Math.max(0, course.price - discount);

  return (
    <div className="bg-muted/30 min-h-screen pb-20 pt-8">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Thanh toán an toàn</h1>
          <p className="text-muted-foreground mt-2">
            Vui lòng kiểm tra lại thông tin và chọn phương thức thanh toán.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          
          {/* Left Column: User Info & Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Thông tin cá nhân */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Thông tin học viên</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" placeholder="VD: Nguyễn Văn A" defaultValue="Người Dùng Mẫu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" placeholder="VD: 0987654321" defaultValue="0912345678" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email nhận tài khoản học</Label>
                  <Input id="email" type="email" placeholder="VD: email@example.com" defaultValue="student@gmail.com" />
                </div>
                <p className="text-sm text-muted-foreground pt-2">
                  <ShieldCheck className="inline h-4 w-4 mr-1 text-green-500" />
                  Thông tin của bạn được bảo mật tuyệt đối theo chuẩn PCI-DSS.
                </p>
              </CardContent>
            </Card>

            {/* Phương thức thanh toán */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border/50">
                <CardTitle className="text-xl">Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6">
                  {/* SePay Option (Selected by default) */}
                  <label className="flex items-start gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer transition-all">
                    <div className="mt-1">
                      <div className="h-5 w-5 rounded-full border-4 border-primary flex items-center justify-center" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-base">Chuyển khoản QR tự động (SePay)</span>
                        <Badge className="bg-green-500 hover:bg-green-600 text-[10px] uppercase tracking-wider py-0">Khuyên dùng</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        Hệ thống tự động kích hoạt khóa học trong vòng 3-5 giây sau khi thanh toán thành công qua mã VietQR. Hỗ trợ tất cả ngân hàng tại Việt Nam.
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="h-10 px-3 bg-white border rounded-md flex items-center justify-center">
                          <QrCode className="h-6 w-6 text-slate-800" />
                          <span className="ml-2 font-bold text-slate-800 text-sm">VietQR</span>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Future Option */}
                  <label className="flex items-start gap-4 p-4 rounded-xl border border-border mt-4 opacity-50 cursor-not-allowed grayscale">
                    <div className="mt-1">
                      <div className="h-5 w-5 rounded-full border border-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-base block mb-1">Thẻ Quốc Tế (Visa/Mastercard)</span>
                      <p className="text-sm text-muted-foreground">Đang bảo trì cổng thanh toán quốc tế.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <CreditCard className="h-8 w-8 text-slate-400" />
                      </div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Course Item */}
                  <div className="flex gap-4">
                    <img 
                      src={course.thumbnail || undefined} 
                      alt={course.title} 
                      className="w-20 h-16 object-cover rounded-md border"
                    />
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-2 leading-tight">{course.title}</h4>
                      <p className="text-muted-foreground text-xs mt-1">{course.level}</p>
                    </div>
                  </div>

                  <div className="h-px bg-border w-full my-4" />

                  {/* Voucher Input */}
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
                    <Button variant="secondary" onClick={handleApplyVoucher}>Áp dụng</Button>
                  </div>

                  <div className="h-px bg-border w-full my-4" />

                  {/* Pricing Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giá gốc:</span>
                      <span className="font-medium">{formatPrice(course.price)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Giảm giá (Voucher):</span>
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
                  <Button 
                    className="w-full h-12 text-lg shadow-md hover:shadow-lg transition-all" 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Đang tạo mã QR...
                      </>
                    ) : (
                      "Tiến hành thanh toán"
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center text-xs text-muted-foreground gap-1">
                    <ShieldCheck className="h-4 w-4" /> 
                    Bảo mật thanh toán 256-bit SSL
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// Temporary Badge component to use if badge variants aren't exported properly or simple enough
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  )
}
