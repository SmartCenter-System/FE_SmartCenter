import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { User, Shield, Bell, CreditCard, Settings } from "lucide-react";
import ProfileSettings from "../components/ProfileSettings";
import SecuritySettings from "../components/SecuritySettings";

export default function SettingsPage() {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-muted/30 py-12 px-4 md:px-8">
      <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Centered Header */}
        <div className="flex flex-col items-center text-center gap-4 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase">
            <Settings className="h-3 w-3" />
            Hệ thống
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Cài đặt tài khoản
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Tùy chỉnh trải nghiệm của bạn, quản lý bảo mật và cập nhật thông tin cá nhân tại đây.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          {/* Centered Glassmorphism Tabs */}
          <div className="flex justify-center mb-10 w-full">
            <div className="p-1.5 rounded-[24px] bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/5">
              <TabsList className="bg-transparent h-auto p-0 flex gap-1">
                <TabsTrigger 
                  value="profile" 
                  className="rounded-2xl px-8 py-3.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 flex items-center gap-2.5 font-bold text-sm"
                >
                  <User className="h-4 w-4" />
                  <span>Hồ sơ</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="rounded-2xl px-8 py-3.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 flex items-center gap-2.5 font-bold text-sm"
                >
                  <Shield className="h-4 w-4" />
                  <span>Bảo mật</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="rounded-2xl px-8 py-3.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 flex items-center gap-2.5 font-bold text-sm"
                >
                  <Bell className="h-4 w-4" />
                  <span className="hidden md:inline">Thông báo</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className="rounded-2xl px-8 py-3.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all duration-300 flex items-center gap-2.5 font-bold text-sm"
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden md:inline">Thanh toán</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="profile" className="focus-visible:outline-none focus-visible:ring-0">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="security" className="focus-visible:outline-none focus-visible:ring-0">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="notifications" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-24 bg-background/50 backdrop-blur-sm rounded-[32px] border border-dashed border-border shadow-xl shadow-primary/5">
              <div className="p-6 bg-muted rounded-full mb-6">
                <Bell className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold mb-2">Đang phát triển</h3>
              <p className="text-muted-foreground text-center max-w-xs">Chúng tôi đang hoàn thiện hệ thống thông báo thời gian thực.</p>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-24 bg-background/50 backdrop-blur-sm rounded-[32px] border border-dashed border-border shadow-xl shadow-primary/5">
              <div className="p-6 bg-muted rounded-full mb-6">
                <CreditCard className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold mb-2">Đang phát triển</h3>
              <p className="text-muted-foreground text-center max-w-xs">Tính năng quản lý hóa đơn và thanh toán sẽ sớm ra mắt.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
