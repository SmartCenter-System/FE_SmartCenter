import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, UploadCloud, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";

import { createCourseSchema } from "../schema";
import type { CreateCoursePayload } from "../type";
import { courseService } from "../services";
import { userService } from "@/features/users/services";
import { useAuthStore } from "@/features/auth/store";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Card, CardContent } from "@/shared/components/ui/card";

interface CourseFormProps {
  initialData?: any;
  courseId?: string;
  onSuccess?: () => void;
  redirectPath?: string;
}

export function CourseForm({ initialData, courseId, onSuccess, redirectPath }: CourseFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { userId, role } = useAuthStore();
  const isLecturer = role === "LECTURER";

  const form = useForm<CreateCoursePayload>({
    resolver: zodResolver(createCourseSchema) as any,
    mode: "onChange",
    defaultValues: {
      courseName: "",
      description: "",
      imgUrl: "",
      basePrice: 0,
      courseType: 1,
      startAt: "",
      endAt: "",
      maxStudents: 30,
      academicYear: new Date().getFullYear(),
      lecturerId: isLecturer ? userId || "" : "",
    },
  });

  // Update form when initialData changes (for Edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({
        courseName: initialData.courseName || "",
        description: initialData.description || "",
        imgUrl: initialData.imgUrl || "",
        basePrice: initialData.basePrice || 0,
        courseType: initialData.courseType || 1,
        startAt: initialData.startAt ? new Date(initialData.startAt).toISOString().split("T")[0] : "",
        endAt: initialData.endAt ? new Date(initialData.endAt).toISOString().split("T")[0] : "",
        maxStudents: initialData.maxStudents || 30,
        academicYear: initialData.academicYear || new Date().getFullYear(),
        lecturerId: initialData.lecturerId || "",
      });
      if (initialData.imgUrl) {
        setPreviewUrl(initialData.imgUrl);
      }
    }
  }, [initialData, form]);

  const mutation = useMutation({
    mutationFn: (data: CreateCoursePayload) => {
      if (courseId) {
        return courseService.update(courseId, data);
      }
      return courseService.create(data);
    },
    onSuccess: async (res: any) => {
      const finalCourseId = courseId || res.courseId || res.id;

      // If there's a new file, upload it AFTER the DB has recorded the course
      if (selectedFile && finalCourseId) {
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "smart_center");

          const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
          const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            // Update the course with the new image URL
            await courseService.update(finalCourseId, {
              ...form.getValues(),
              imgUrl: uploadData.secure_url,
            });
          }
        } catch (error) {
          // Delayed upload failed
          toast.error("Khóa học đã lưu nhưng không thể tải ảnh lên.");
        } finally {
          setIsUploading(false);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-course", finalCourseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["lecturer-courses"] });

      toast.success(courseId ? "Đã cập nhật" : "Đã tạo khóa học");
      if (onSuccess) onSuccess();
      if (redirectPath) navigate(redirectPath);
      else if (!onSuccess) {
        if (isLecturer) navigate("/lecturer/courses");
        else navigate("/admin/courses");
      }
    }
  });

  const { data: lecturerData, isLoading: isLoadingLecturers } = useQuery({
    queryKey: ["lecturers"],
    queryFn: () => userService.getUsers({ role: "LECTURER", limit: 100 }),
    enabled: !isLecturer,
  });
  const lecturers = lecturerData?.data || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Set a temporary valid URL to pass Zod validation
      form.setValue("imgUrl", "https://temp-image-placeholder.com", { shouldValidate: true });
    }
  };

  const onSubmit = (data: CreateCoursePayload) => {
    try {
      const payload: any = {
        ...data,
        maxStudents: data.maxStudents || 0,
        academicYear: data.academicYear || new Date().getFullYear(),
        isActive: true,
      };

      if (data.startAt && data.startAt.trim() !== "") {
        payload.startAt = new Date(data.startAt).toISOString();
      } else {
        delete payload.startAt;
      }

      if (data.endAt && data.endAt.trim() !== "") {
        payload.endAt = new Date(data.endAt).toISOString();
      } else {
        delete payload.endAt;
      }

      mutation.mutate(payload);
    } catch (error) {
      // Form submission error
      toast.error("Đã có lỗi xảy ra khi chuẩn bị dữ liệu. Vui lòng kiểm tra lại ngày tháng.");
    }
  };

  const onInvalid = () => {
    toast.error("Thông tin chưa hợp lệ. Vui lòng kiểm tra các ô báo đỏ!");
  };

  const { errors } = form.formState;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        {hasErrors && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi nhập liệu</AlertTitle>
            <AlertDescription>
              Vui lòng kiểm tra lại các thông tin được báo đỏ phía dưới trước khi tiếp tục.
            </AlertDescription>
          </Alert>
        )}
        <div className="max-w-[800px] mx-auto">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0 space-y-8">
              {/* Media Section */}
              <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-foreground/80">Ảnh bìa khóa học</FormLabel>
                    <div className="border-2 border-dashed border-border rounded-3xl p-2 text-center hover:bg-muted/50 transition-all group overflow-hidden bg-muted/10">
                      {field.value ? (
                        <div className="relative aspect-[21/9] w-full">
                          <img src={previewUrl || field.value} alt="Thumbnail" className="w-full h-full object-cover rounded-2xl" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-2xl backdrop-blur-[2px]">
                            <label className="cursor-pointer text-white flex flex-col items-center gap-2 text-sm font-bold">
                              <UploadCloud className="h-8 w-8 animate-bounce" />
                              Thay đổi ảnh bìa
                              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center aspect-[21/9] w-full gap-3 text-muted-foreground">
                          {isUploading ? (
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                          ) : (
                            <>
                              <div className="p-4 rounded-full bg-primary/10 text-primary">
                                <ImageIcon className="h-10 w-10" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-bold text-foreground">Click để tải ảnh lên</p>
                                <p className="text-xs italic">Kích thước gợi ý: 1200x500px</p>
                              </div>
                            </>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Information Section */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="courseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-foreground/80">Tên khóa học</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: Lập trình ReactJS từ cơ bản đến nâng cao" className="h-12 text-lg font-medium rounded-xl border-muted-foreground/20 focus:border-primary transition-all" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-foreground/80">Mô tả chi tiết</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả tóm tắt về mục tiêu và nội dung chính của khóa học..."
                          className="min-h-[120px] resize-none rounded-xl border-muted-foreground/20 focus:border-primary transition-all text-base leading-relaxed"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-foreground/80">Giá bán (VNĐ)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-12 font-black text-xl text-primary rounded-xl border-muted-foreground/20 focus:border-primary"
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxStudents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-foreground/80">Số học viên tối đa</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-12 font-bold text-lg rounded-xl border-muted-foreground/20 focus:border-primary"
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="courseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-foreground/80">Hình thức đào tạo</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value) as 1 | 2)}
                          value={String(field.value ?? 1)}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary">
                              <SelectValue placeholder="Chọn hình thức" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Học Online</SelectItem>
                            <SelectItem value="2">Học Offline</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-foreground/80">Năm học</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-12 font-medium rounded-xl border-muted-foreground/20 focus:border-primary"
                            value={field.value ?? new Date().getFullYear()}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-foreground/80">Ngày bắt đầu</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="h-12 font-medium rounded-xl border-muted-foreground/20 focus:border-primary"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-foreground/80">Ngày kết thúc</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="h-12 font-medium rounded-xl border-muted-foreground/20 focus:border-primary"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!isLecturer && (
                  <FormField
                    control={form.control}
                    name="lecturerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-foreground/80">Giảng viên hướng dẫn</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""} disabled={isLoadingLecturers}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary">
                              <SelectValue placeholder={isLoadingLecturers ? "Đang tải danh sách..." : "Chọn giảng viên"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {lecturers.map((lecturer) => (
                              <SelectItem key={lecturer.id} value={lecturer.id}>
                                {lecturer.fullName} ({lecturer.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center gap-4 pt-8 mt-8 border-t border-border/50">
          <Button 
            type="submit" 
            disabled={mutation.isPending || isUploading}
            className="w-full h-14 rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-[1.02] active:scale-95 font-black text-xl bg-gradient-to-r from-primary to-primary/80"
          >
            {mutation.isPending && <Loader2 className="mr-3 h-6 w-6 animate-spin" />}
            {courseId ? "CẬP NHẬT THÔNG TIN" : "XÁC NHẬN TẠO KHÓA HỌC"}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground font-bold"
            onClick={() => {
              if (redirectPath) navigate(redirectPath);
              else if (onSuccess) onSuccess();
              else {
                if (isLecturer) navigate("/lecturer/courses");
                else navigate("/admin/courses");
              }
            }}
          >
            Hủy và quay lại
          </Button>
        </div>
      </form>
    </Form>
  );
}
