import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, UploadCloud, Image as ImageIcon } from "lucide-react";

import { createCourseSchema } from "../schema";
import type { CreateCoursePayload } from "../type";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Card, CardContent } from "@/shared/components/ui/card";

interface CourseFormProps {
  initialData?: CreateCoursePayload;
}

export function CourseForm({ initialData }: CourseFormProps) {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateCoursePayload>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: initialData ?? {
      courseName: "",
      description: "",
      imgUrl: "",
      basePrice: 0,
      courseType: 1,
      startAt: "",
      endAt: "",
      maxStudents: 30,
      academicYear: new Date().getFullYear(),
    },
  });

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "smart_center");

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "demo";
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await res.json();
      form.setValue("imgUrl", data.secure_url);
      toast.success("Tải ảnh lên thành công!");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CreateCoursePayload) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Submitting:", data);

      toast.success(initialData ? "Cập nhật khóa học thành công!" : "Tạo khóa học thành công!");
      navigate("/admin/courses");
    } catch {
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            <img src={field.value} alt="Thumbnail" className="w-full h-32 object-cover rounded-md" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                              <label className="cursor-pointer text-white flex items-center gap-2 text-sm font-medium">
                                <UploadCloud className="h-4 w-4" />
                                Thay đổi
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      void uploadToCloudinary(e.target.files[0]);
                                    }
                                  }}
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
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  void uploadToCloudinary(e.target.files[0]);
                                }
                              }}
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
                        defaultValue={String(field.value ?? 1)}
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

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/courses")}>
            Hủy bỏ
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Lưu thay đổi" : "Tạo khóa học"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
