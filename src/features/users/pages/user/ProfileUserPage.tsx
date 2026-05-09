import { useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { Card, CardContent } from "@/shared/components/ui/card";
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
  FileText as FileIcon,
  Text as TextAreaIcon
} from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useProfile, useUpdateProfile } from "../../hooks/useProfile";
import type { UpdateProfileRequest } from "../../services";

// ─── Role mapping ─────────────────────────────────────────────────────────────
const ROLE_MAP: Record<number, { label: string; color: string }> = {
  1: { label: "Admin", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  2: { label: "Học viên", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  3: { label: "Giảng viên", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  4: { label: "Nhân viên", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
};

// ─── Info Row Component ───────────────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-start gap-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 dark:bg-primary/15">
        <Icon className="h-4.5 w-4.5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-foreground">
          {value || <span className="italic text-muted-foreground/60">Chưa cập nhật</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 pb-12 pt-28 sm:px-6">
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20" />
        <CardContent className="relative px-6 pb-8 pt-0">
          <div className="-mt-14 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <Skeleton className="h-28 w-28 rounded-2xl" />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <Skeleton className="mx-auto h-6 w-48 sm:mx-0" />
              <Skeleton className="mx-auto h-4 w-32 sm:mx-0" />
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
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
        <h2 className="text-lg font-semibold text-foreground">Không thể tải thông tin</h2>
        <p className="text-sm text-muted-foreground">Vui lòng thử lại sau hoặc đăng nhập lại.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </div>
    );
  }

  const fullName = `${profile.lastName} ${profile.firstName}`.trim();
  const roleInfo = ROLE_MAP[profile.role] ?? { label: "Không rõ", color: "bg-gray-100 text-gray-600" };
  const avatarUrl = profile.imgUrl;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 pb-12 pt-28 sm:px-6">
      {/* ─── Profile Card ─────────────────────────────────────────── */}
      <Card className="overflow-hidden border-none shadow-lg">
        {/* Banner */}
        <div className="relative h-32 bg-gradient-to-br from-[#17218F] via-[#3039A9] to-[#5C6BC0] sm:h-36">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(233,199,4,0.15),transparent_60%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card/40 to-transparent" />
        </div>

        <CardContent className="relative px-6 pb-8 pt-0">
          {/* Avatar + Name + Actions */}
          <div className="-mt-14 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="h-28 w-28 rounded-2xl border-4 border-card object-cover shadow-md"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-card bg-gradient-to-br from-primary/20 to-secondary/30 shadow-md">
                  <span className="text-3xl font-bold text-primary">
                    {profile.lastName?.charAt(0)}
                    {profile.firstName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Name + Role */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{fullName}</h1>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
                {authRole && (
                  <span className="text-xs text-muted-foreground">
                    • Đăng nhập với vai trò {authRole}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex shrink-0 gap-2">
              {!isEditing ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 rounded-xl"
                    onClick={startEditing}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Chỉnh sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                    className="gap-1.5 rounded-xl"
                    onClick={cancelEditing}
                    disabled={isUpdating}
                  >
                    <X className="h-3.5 w-3.5" />
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 rounded-xl bg-primary"
                    onClick={handleSave}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Lưu
                  </Button>
                </>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* ─── Profile Info ──────────────────────────────────────── */}
          {!isEditing ? (
            <div className="grid gap-1 sm:grid-cols-2">
              <InfoRow icon={User} label="Họ" value={profile.lastName} />
              <InfoRow icon={User} label="Tên" value={profile.firstName} />
              <InfoRow icon={Mail} label="Email" value={profile.email} />
              <InfoRow icon={Phone} label="Số điện thoại" value={profile.phone} />
              <InfoRow icon={MapPin} label="Địa chỉ" value={profile.address} />
              <InfoRow icon={Building2} label="Thành phố" value={profile.city} />
              <InfoRow icon={MessageCircle} label="Zalo" value={profile.zaloLink} />
              {(authRole === "LECTURER" || profile.role === 3) && (
                <>
                  <div className="sm:col-span-2">
                    <InfoRow icon={FileIcon} label="Chuyên môn" value={profile.expertise} />
                  </div>
                  <div className="sm:col-span-2">
                    <InfoRow icon={CheckCircle2} label="Tiểu sử" value={profile.bio} />
                  </div>
                </>
              )}
            </div>
          ) : (
            /* ─── Edit Form ──────────────────────────────────────── */
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Họ
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName ?? ""}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="rounded-xl"
                  placeholder="Nhập họ"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tên
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName ?? ""}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="rounded-xl"
                  placeholder="Nhập tên"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <Input
                  value={profile.email}
                  disabled
                  className="rounded-xl bg-muted/50 cursor-not-allowed"
                />
                <p className="text-[11px] text-muted-foreground">Email không thể thay đổi</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  value={formData.phone ?? ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="rounded-xl"
                  placeholder="VD: 0901234567"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={formData.address ?? ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="rounded-xl"
                  placeholder="VD: Số 10 Đường Lê Lợi, Quận 1"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Thành phố
                </Label>
                <Input
                  id="city"
                  value={formData.city ?? ""}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="rounded-xl"
                  placeholder="VD: TP. Hồ Chí Minh"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="zaloLink" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Link Zalo
                </Label>
                <Input
                  id="zaloLink"
                  value={formData.zaloLink ?? ""}
                  onChange={(e) => handleChange("zaloLink", e.target.value)}
                  className="rounded-xl"
                  placeholder="VD: https://zalo.me/0901234567"
                />
              </div>

              {(authRole === "LECTURER" || profile.role === 3) && (
                <>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="expertise" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Chuyên môn
                    </Label>
                    <Input
                      id="expertise"
                      value={formData.expertise ?? ""}
                      onChange={(e) => handleChange("expertise", e.target.value)}
                      className="rounded-xl"
                      placeholder="VD: Fullstack Developer, UI/UX Designer..."
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="bio" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Tiểu sử / Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio ?? ""}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      className="rounded-xl min-h-[100px]"
                      placeholder="Chia sẻ một chút về kinh nghiệm và bản thân bạn..."
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}