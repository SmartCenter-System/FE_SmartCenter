import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Camera, Save, Loader2 } from "lucide-react";
import { userService } from "@/features/users/services";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";

interface ProfileFormValues {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  expertise: string;
}

import { useAuthStore } from "@/features/auth/store";

export default function ProfileSettings() {
  const { userId } = useParams();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { userId: authUserId } = useAuthStore();
  
  // 1. Fetch Profile using useQuery
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["users", "profile", userId || authUserId],
    queryFn: () => userId ? userService.getById(userId) : userService.getProfile(),
    enabled: !!userId || !!authUserId,
  });

  // 2. Setup Form with react-hook-form
  const form = useForm<ProfileFormValues>({
    values: profile ? {
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone || "",
      bio: profile.bio || "",
      avatar: profile.avatar || "",
      expertise: profile.expertise || "",
    } : undefined
  });

  // 3. Update Profile using useMutation
  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormValues) => {
      const nameParts = data.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      return userService.updateProfile({
        firstName,
        lastName,
        phone: data.phone,
        bio: data.bio,
        expertise: data.expertise,
        imgUrl: data.avatar,
      });
    },
    onSuccess: () => {
      toast.success("Đã lưu thay đổi");
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate(data);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("avatar", reader.result as string);
        toast.success("Đã chọn ảnh đại diện mới!");
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Đang tải thông tin hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header Card */}
      <Card className="border-none shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-background">
        <div className="h-40 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="absolute -bottom-16 left-0 right-0 flex justify-center">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <Avatar className="h-32 w-32 border-8 border-background shadow-2xl relative z-10 hover:scale-105 transition-transform duration-300">
                <AvatarImage src={form.watch("avatar")} />
                <AvatarFallback className="text-2xl bg-muted">
                  {form.watch("fullName")?.substring(0, 2).toUpperCase() || "USER"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-1 right-1 z-20 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all">
                <Camera className="h-4 w-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <CardHeader className="pt-20 pb-6 text-center">
          <div className="flex flex-col items-center">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {form.watch("fullName") || "Hồ sơ cá nhân"}
            </CardTitle>
            <CardDescription className="text-lg mt-1">{form.watch("email")}</CardDescription>
            <div className="mt-4 flex gap-2">
              <Badge variant="secondary" className="px-4 py-1 rounded-full bg-primary/10 text-primary border-none">
                Người dùng
              </Badge>
              <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/20 text-muted-foreground">
                ID: {userId || "Cá nhân"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <Card className="border-none shadow-lg rounded-[24px] bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Hoàn thành hồ sơ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[85%] rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Hồ sơ của bạn đã hoàn thành 85%. Thêm số điện thoại để bảo mật tốt hơn.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-none shadow-xl shadow-primary/5 rounded-[32px] bg-background">
            <CardHeader className="border-b border-border/50 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
                  <CardDescription>Cập nhật thông tin cơ bản của bạn để mọi người biết về bạn.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold ml-1">Họ và tên</Label>
                    <Input 
                      id="fullName" 
                      {...form.register("fullName")}
                      className="rounded-xl h-12 bg-muted/30 focus:bg-background transition-all" 
                      placeholder="Nguyễn Văn A" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold ml-1">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...form.register("email")}
                      disabled
                      className="rounded-xl h-12 bg-muted/10 cursor-not-allowed border-dashed" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold ml-1">Số điện thoại</Label>
                    <Input 
                      id="phone" 
                      {...form.register("phone")}
                      className="rounded-xl h-12 bg-muted/30 focus:bg-background transition-all" 
                      placeholder="0123 456 789" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expertise" className="text-sm font-semibold ml-1">Chuyên môn (nếu có)</Label>
                    <Input 
                      id="expertise" 
                      {...form.register("expertise")}
                      className="rounded-xl h-12 bg-muted/30 focus:bg-background transition-all" 
                      placeholder="Web Design, Marketing..." 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-semibold ml-1">Giới thiệu ngắn</Label>
                  <Textarea 
                    id="bio" 
                    rows={4}
                    {...form.register("bio")}
                    className="rounded-2xl bg-muted/30 focus:bg-background transition-all resize-none" 
                    placeholder="Hãy viết gì đó về bản thân bạn..." 
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                    className="w-full h-12 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    Lưu thay đổi
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
