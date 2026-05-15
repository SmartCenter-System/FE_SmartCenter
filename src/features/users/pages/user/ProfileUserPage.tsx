import { useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Separator } from "@/shared/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Pencil,
  X,
  Check,
  Loader2,
  LogOut,
  MessageCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Camera,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useProfile, useUpdateProfile } from "../../hooks/useProfile";
import type { UpdateProfileRequest } from "../../services";
import { toast } from "sonner";

// ─── Role mapping ─────────────────────────────────────────────────────────────
const ROLE_MAP: Record<number, { label: string; color: string }> = {
  1: { label: "Quản trị viên", color: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/20" },
  2: { label: "Học viên", color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20" },
  3: { label: "Giảng viên", color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20" },
  4: { label: "Nhân viên", color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20" },
};

// ─── Elegant Field Row Component ──────────────────────────────────────────────
function ProfileFieldRow({
  icon: Icon,
  label,
  value,
  copyable = false,
  isLink = false,
  linkUrl = "",
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
  copyable?: boolean;
  isLink?: boolean;
  linkUrl?: string;
}) {
  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success(`Đã sao chép ${label.toLowerCase()}!`);
  };

  const handleOpenLink = () => {
    const url = linkUrl || value;
    if (!url) return;
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(fullUrl, "_blank");
  };

  return (
    <div className="group flex items-start justify-between gap-4 rounded-xl p-3 transition-all duration-200 hover:bg-muted/50">
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary dark:bg-primary/15 transition-colors group-hover:bg-primary/12">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">{label}</p>
          <p className="mt-0.5 truncate text-sm font-medium text-foreground">
            {value ? (
              value
            ) : (
              <span className="italic text-muted-foreground/50">Chưa cập nhật</span>
            )}
          </p>
        </div>
      </div>

      {value && (
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
          {copyable && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg cursor-pointer hover:bg-background hover:text-primary shadow-2xs"
              onClick={handleCopy}
              title="Sao chép"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
          {isLink && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg cursor-pointer hover:bg-background hover:text-primary shadow-2xs"
              onClick={handleOpenLink}
              title="Mở liên kết"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Premium Loading Skeleton ─────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pb-16 pt-24 sm:px-6">
      {/* Banner Skeleton */}
      <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="-mt-16 relative z-10 space-y-6 px-2 sm:px-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <Skeleton className="h-28 w-28 sm:h-32 sm:w-32 rounded-full -mt-12 sm:-mt-16" />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <Skeleton className="h-7 w-48 mx-auto sm:mx-0" />
              <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Main Professional Page ───────────────────────────────────────────────────
export default function ProfileUserPage() {
  const { data: profile, isLoading, isError } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: logout } = useLogout();
  const { role: authRole } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({});

  // Bắt đầu chỉnh sửa — fill form với dữ liệu hiện tại
  const startEditing = () => {
    if (!profile) return;
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone ?? "",
      address: profile.address ?? "",
      city: profile.city ?? "",
      zaloLink: profile.zaloLink ?? "",
      imgUrl: profile.imgUrl ?? "",
      bio: profile.bio ?? "",
      expertise: profile.expertise ?? "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleSave = () => {
    updateProfile(formData, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ─── States ───────────────────────────────────────────────────────
  if (isLoading) return <ProfileSkeleton />;

  if (isError || !profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 pt-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
          <X className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Không thể tải thông tin hồ sơ</h2>
        <p className="text-sm text-muted-foreground">Vui lòng kiểm tra kết nối mạng hoặc đăng nhập lại.</p>
        <Button variant="outline" className="rounded-xl cursor-pointer" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </div>
    );
  }

  const fullName = `${profile.lastName} ${profile.firstName}`.trim();
  const roleInfo = ROLE_MAP[profile.role] ?? { label: "Thành viên", color: "bg-gray-500/10 text-gray-600 border border-gray-500/20" };
  const avatarUrl = profile.imgUrl;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pb-16 pt-24 sm:px-6 animate-fade-in">
      {/* ─── Premium Header Banner ─────────────────────────────────────────── */}
      <div className="relative h-40 sm:h-48 w-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Decorative overlay effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/80 via-background/20 to-transparent backdrop-blur-[2px]" />
        
        {/* Absolute floating subtle pill */}
        <div className="absolute top-4 right-4 hidden sm:flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-medium text-white/90 border border-white/10 shadow-inner">
          <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
          <span>Hồ sơ chuẩn chuyên nghiệp</span>
        </div>
      </div>

      {/* ─── User Profile Identity Header ──────────────────────────────────────── */}
      <div className="-mt-16 relative z-10 px-2 sm:px-4">
        <Card className="border-none shadow-xl bg-card/95 backdrop-blur-sm ring-1 ring-foreground/5">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:justify-between">
              {/* Avatar + Basic details */}
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6 w-full sm:w-auto">
                {/* Avatar Ring */}
                <div className="relative shrink-0 -mt-12 sm:-mt-16 group">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-card object-cover shadow-xl transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-primary via-primary/80 to-secondary shadow-xl transition-transform duration-300 group-hover:scale-105">
                      <span className="text-3xl sm:text-4xl font-bold tracking-wider text-primary-foreground">
                        {profile.lastName?.charAt(0)}
                        {profile.firstName?.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Overlay hint icon when editing */}
                  {isEditing && (
                    <div className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-1 opacity-90 transition-opacity">
                      <Camera className="h-6 w-6 text-white" />
                      <span className="text-[10px] font-medium text-center px-2">Đổi link ảnh bên dưới</span>
                    </div>
                  )}
                  
                  {/* Status indicator badge */}
                  <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 border-2 border-card text-white shadow-sm" title="Tài khoản đang hoạt động">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                </div>

                {/* Name & Roles */}
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{fullName}</h1>
                    <span title="Tài khoản xác thực" className="flex items-center">
                      <ShieldCheck className="h-5 w-5 text-cta shrink-0" />
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                    {authRole && (
                      <span className="text-xs text-muted-foreground/90 font-medium bg-muted/60 px-2 py-0.5 rounded-md">
                        Vai trò hệ thống: {authRole}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex shrink-0 items-center gap-2.5 w-full sm:w-auto justify-center pt-2 sm:pt-0">
                {!isEditing ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 rounded-xl font-semibold shadow-2xs border-foreground/10 hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-pointer"
                      onClick={startEditing}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Chỉnh sửa hồ sơ
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 rounded-xl font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 cursor-pointer"
                      onClick={() => logout()}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 rounded-xl font-semibold hover:bg-muted cursor-pointer"
                      onClick={cancelEditing}
                      disabled={isUpdating}
                    >
                      <X className="h-3.5 w-3.5" />
                      Hủy bỏ
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5 rounded-xl font-semibold bg-cta hover:bg-cta/90 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={handleSave}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      Lưu thay đổi
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Profile Details Grid / Edit Form ──────────────────────────────────── */}
      <div className="px-2 sm:px-4">
        {!isEditing ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card 1: Thông tin cá nhân */}
            <Card className="border-none shadow-sm ring-1 ring-foreground/5 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-cta" />
                  <CardTitle className="text-base font-bold">Thông tin cá nhân</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-1">
                <ProfileFieldRow icon={User} label="Họ đệm" value={profile.lastName} copyable />
                <ProfileFieldRow icon={User} label="Tên gọi" value={profile.firstName} copyable />
                <ProfileFieldRow icon={Mail} label="Địa chỉ Email" value={profile.email} copyable />
                <ProfileFieldRow icon={Phone} label="Số điện thoại" value={profile.phone} copyable />
              </CardContent>
            </Card>

            {/* Card 2: Vị trí & Kết nối */}
            <Card className="border-none shadow-sm ring-1 ring-foreground/5 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cta" />
                  <CardTitle className="text-base font-bold">Vị trí & Kết nối</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-1">
                <ProfileFieldRow icon={MapPin} label="Địa chỉ cư trú" value={profile.address} copyable />
                <ProfileFieldRow icon={Building2} label="Thành phố" value={profile.city} copyable />
                <ProfileFieldRow 
                  icon={MessageCircle} 
                  label="Tài khoản Zalo" 
                  value={profile.zaloLink} 
                  isLink={!!profile.zaloLink}
                  linkUrl={profile.zaloLink || ""}
                  copyable 
                />
              </CardContent>
            </Card>

            {/* Card 3: Hồ sơ chuyên môn (Dành cho Giảng viên/Vai trò 3) */}
            {(authRole === "LECTURER" || profile.role === 3) && (
              <Card className="md:col-span-2 border-none shadow-sm ring-1 ring-foreground/5 hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-cta" />
                    <CardTitle className="text-base font-bold">Hồ sơ chuyên môn giảng dạy</CardTitle>
                  </div>
                  <CardDescription>Thông tin hiển thị công khai trên các khóa học và hồ sơ giảng viên</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <ProfileFieldRow icon={GraduationCap} label="Lĩnh vực chuyên môn" value={profile.expertise} copyable />
                  </div>
                  <div className="md:col-span-2">
                    <div className="rounded-xl p-4 bg-muted/30 border border-border/40">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        Tiểu sử & Kinh nghiệm
                      </p>
                      <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                        {profile.bio ? profile.bio : <span className="italic text-muted-foreground/50">Chưa cập nhật tiểu sử giới thiệu.</span>}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* ─── Edit Form Layout ─────────────────────────────────────────────────── */
          <Card className="border-none shadow-md ring-1 ring-foreground/5">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Pencil className="h-4.5 w-4.5 text-cta" />
                Chỉnh sửa thông tin hồ sơ
              </CardTitle>
              <CardDescription>Cập nhật chính xác thông tin cá nhân để hệ thống hỗ trợ tốt nhất</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6">
              {/* Cụm thông tin định danh */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 border-l-2 border-primary pl-2">
                  Thông tin định danh
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs font-semibold text-muted-foreground">
                      Họ đệm <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName ?? ""}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className="rounded-xl bg-background border-border/80 focus:border-primary shadow-2xs transition-all duration-200"
                      placeholder="VD: Nguyễn Văn"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs font-semibold text-muted-foreground">
                      Tên gọi <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName ?? ""}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      className="rounded-xl bg-background border-border/80 focus:border-primary shadow-2xs transition-all duration-200"
                      placeholder="VD: An"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="imgUrl" className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                      <span>Đường dẫn ảnh đại diện (URL)</span>
                      {formData.imgUrl && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                          <Check className="h-3 w-3" /> URL hợp lệ
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                      <Input
                        id="imgUrl"
                        value={formData.imgUrl ?? ""}
                        onChange={(e) => handleChange("imgUrl", e.target.value)}
                        className="rounded-xl pl-9 bg-background border-border/80 focus:border-primary shadow-2xs transition-all duration-200"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Hỗ trợ các định dạng hình ảnh công khai (.jpg, .png, .webp)</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cụm thông tin liên hệ */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 border-l-2 border-primary pl-2">
                  Thông tin liên hệ & Vị trí
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Địa chỉ Email (Tài khoản)
                    </Label>
                    <Input
                      value={profile.email}
                      disabled
                      className="rounded-xl bg-muted/60 border-border/40 text-muted-foreground cursor-not-allowed"
                    />
                    <p className="text-[11px] text-muted-foreground/80">Email đăng nhập gắn liền với tài khoản, không thể thay đổi</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">
                      Số điện thoại liên lạc
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone ?? ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="rounded-xl bg-background border-border/80 focus:border-primary shadow-2xs transition-all duration-200"
                      placeholder="VD: 0901234567"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-semibold text-muted-foreground">
                      Địa chỉ chi tiết
                    </Label>
                    <Input
                      id="address"
                      value={formData.address ?? ""}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="rounded-xl bg-background border-border/80 focus:border-primary shadow-2xs transition-all duration-200"
                      placeholder="VD: Số 10 Đường Lê Lợi, Phường Bến Nghé"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-semibold text-muted-foreground">
                      Tỉnh / Thành phố
                    </Label>
                    <Input
                      id="city"
                      value={formData.city ?? ""}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="rounded-xl bg-background border-border/80 focus:border-primary shadow-2xs transition-all duration-200"
                      placeholder="VD: TP. Hồ Chí Minh"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="zaloLink" className="text-xs font-semibold text-muted-foreground">
                      Đường dẫn Zalo liên hệ (Tùy chọn)
                    </Label>
                    <Input
                      id="zaloLink"
                      value={formData.zaloLink ?? ""}
                      onChange={(e) => handleChange("zaloLink", e.target.value)}
                      className="rounded-xl bg-background border-border/80 focus:border-primary shadow-2xs transition-all duration-200"
                      placeholder="VD: https://zalo.me/0901234567"
                    />
                  </div>
                </div>
              </div>

              {/* Cụm thông tin chuyên môn (Giảng viên) */}
              {(authRole === "LECTURER" || profile.role === 3) && (
                <>
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 border-l-2 border-primary pl-2">
                      Hồ sơ chuyên môn giảng dạy
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="expertise" className="text-xs font-semibold text-muted-foreground">
                          Lĩnh vực & Chức danh chuyên môn
                        </Label>
                        <Input
                          id="expertise"
                          value={formData.expertise ?? ""}
                          onChange={(e) => handleChange("expertise", e.target.value)}
                          className="rounded-xl bg-background border-border/80 focus:border-primary shadow-2xs transition-all duration-200"
                          placeholder="VD: Tiến sĩ Khoa học Máy tính / Senior Fullstack Architect"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="bio" className="text-xs font-semibold text-muted-foreground">
                          Tiểu sử & Kinh nghiệm công tác
                        </Label>
                        <Textarea
                          id="bio"
                          value={formData.bio ?? ""}
                          onChange={(e) => handleChange("bio", e.target.value)}
                          className="rounded-xl min-h-[120px] bg-background border-border/80 focus:border-primary shadow-2xs transition-all duration-200 p-3.5 leading-relaxed"
                          placeholder="Giới thiệu tóm tắt về thâm niên, các chứng chỉ nổi bật và triết lý giảng dạy của bạn..."
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="justify-end gap-3 pt-4 border-t border-border/40 bg-muted/20">
              <Button
                variant="ghost"
                className="rounded-xl font-semibold cursor-pointer"
                onClick={cancelEditing}
                disabled={isUpdating}
              >
                Hủy bỏ
              </Button>
              <Button
                className="rounded-xl font-semibold bg-cta hover:bg-cta/90 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer gap-1.5"
                onClick={handleSave}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Lưu thay đổi
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}