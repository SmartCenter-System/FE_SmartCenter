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
      lecturerId: "",
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
              imgUrl: uploadData.secure_url 
            });
          }
        } catch (error) {
          console.error("Delayed upload failed:", error);
          toast.error("Khóa học đã lưu nhưng không thể tải ảnh lên.");
        } finally {
          setIsUploading(false);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-course", finalCourseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["lecturer-courses"] });
      
      toast.success(courseId ? "Cập nhật khóa học thành công!" : "Tạo khóa học thành công!");
      if (onSuccess) onSuccess();
      if (redirectPath) navigate(redirectPath);
      else if (!onSuccess) navigate("/admin/courses");
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message || "Không thể lưu khóa học"}`);
    },
  });
  
  const { data: lecturerData, isLoading: isLoadingLecturers } = useQuery({
    queryKey: ["lecturers"],
    queryFn: () => userService.getUsers({ role: "LECTURER", limit: 100 }),
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
    const payload: any = {
      ...data,
      maxStudents: data.maxStudents || 0,
      academicYear: data.academicYear || new Date().getFullYear(),
      isActive: true,
    };

    if (data.startAt) payload.startAt = new Date(data.startAt).toISOString();
    else delete payload.startAt;

    if (data.endAt) payload.endAt = new Date(data.endAt).toISOString();
    else delete payload.endAt;

    mutation.mutate(payload);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="courseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên khóa học</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên khóa học..." {...field} />
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
                      <FormLabel>Mô tả chi tiết</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả nội dung khóa học..."
                          className="min-h-[120px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá bán (VNĐ)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
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
                        <FormLabel>Số học viên tối đa</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="imgUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ảnh bìa khóa học</FormLabel>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                        {field.value ? (
                          <div className="relative group">
                            <img src={previewUrl || field.value} alt="Thumbnail" className="w-full h-32 object-cover rounded-md" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                              <label className="cursor-pointer text-white flex items-center gap-2 text-sm font-medium">
                                <UploadCloud className="h-4 w-4" />
                                Thay đổi
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
                            {isUploading ? (
                              <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                              <>
                                <ImageIcon className="h-8 w-8" />
                                <span className="text-sm">Click để tải ảnh lên</span>
                              </>
                            )}
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hình thức</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value) as 1 | 2)}
                        value={String(field.value ?? 1)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn hình thức" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Học Online</SelectItem>
                          <SelectItem value="2">Học Offline tại trung tâm</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lecturerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giảng viên phụ trách</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={isLoadingLecturers}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingLecturers ? "Đang tải..." : "Chọn giảng viên"} />
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

                <FormField
                  control={form.control}
                  name="academicYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Năm học</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? new Date().getFullYear()}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 pt-8 border-t border-border/50">
          <Button 
            type="submit" 
            disabled={mutation.isPending || isUploading}
            className="w-full h-12 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.01] active:scale-95 font-bold text-base"
          >
            {mutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {courseId ? "Lưu thay đổi" : "Tạo khóa học mới"}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => (redirectPath ? navigate(redirectPath) : navigate("/admin/courses"))}
          >
            Hủy bỏ và quay lại
          </Button>
        </div>
      </form>
    </Form>
  );
}
