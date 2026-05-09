import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { KeyRound, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function SecuritySettings() {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Vui lòng nhập đầy đủ thông tin mật khẩu.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("Mật khẩu mới không khớp.");
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    toast.success("Đổi mật khẩu thành công!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Change Password Card */}
          <Card className="border-none shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-background">
            <CardHeader className="px-8 pt-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <KeyRound className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Đổi mật khẩu</CardTitle>
                  <CardDescription>Cập nhật mật khẩu định kỳ để tăng cường bảo mật.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" title="Mật khẩu hiện tại" className="text-sm font-semibold ml-1">Mật khẩu hiện tại</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="rounded-2xl border-none bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 h-12 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" title="Mật khẩu mới" className="text-sm font-semibold ml-1">Mật khẩu mới</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="rounded-2xl border-none bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 h-12 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" title="Xác nhận mật khẩu mới" className="text-sm font-semibold ml-1">Xác nhận mật khẩu</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="rounded-2xl border-none bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 h-12 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex justify-center pt-4 border-t border-border/50">
                <Button 
                  onClick={handleUpdatePassword} 
                  disabled={loading}
                  className="w-full rounded-full h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95 font-bold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : "Cập nhật mật khẩu"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl shadow-primary/5 rounded-[32px] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold">Mẹo bảo mật</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-4 text-primary-foreground/90 leading-relaxed">
              <p className="flex gap-2"><span>•</span> Mật khẩu nên có ít nhất 8 ký tự.</p>
              <p className="flex gap-2"><span>•</span> Bao gồm chữ hoa, chữ thường, số và ký hiệu đặc biệt.</p>
              <p className="flex gap-2"><span>•</span> Tránh sử dụng thông tin dễ đoán như ngày sinh.</p>
              <p className="flex gap-2 font-semibold bg-white/10 p-3 rounded-xl italic">
                "Bảo vệ tài khoản là bảo vệ thành quả học tập của bạn."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
