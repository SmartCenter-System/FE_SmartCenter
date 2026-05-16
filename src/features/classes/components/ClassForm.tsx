import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClassSchema, type CreateClassInput } from "../schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/features/users/services";
import { Loader2 } from "lucide-react";

interface ClassFormProps {
  onSubmit: (data: CreateClassInput) => Promise<void>;
  initialData?: Partial<CreateClassInput>;
  isLoading?: boolean;
}

export function ClassForm({ onSubmit, initialData, isLoading }: ClassFormProps) {
  const form = useForm<CreateClassInput>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      className: initialData?.className || "",
      lecturerId: initialData?.lecturerId || "",
      maxStudents: initialData?.maxStudents || 30,
      status: initialData?.status || "OPEN",
      startDate: initialData?.startDate || new Date().toISOString().split("T")[0],
      enrollmentDeadline: initialData?.enrollmentDeadline || new Date().toISOString().split("T")[0],
    },
  });

  const { data: lecturersRes, isLoading: isLoadingLecturers } = useQuery({
    queryKey: ["lecturers"],
    queryFn: () => userService.getUsers({ role: "LECTURER", limit: 100 }),
  });
  const lecturers = lecturersRes?.data || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="className"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên lớp học</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Lớp K1 - Tối 2-4-6" {...field} />
              </FormControl>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingLecturers ? "Đang tải..." : "Chọn giảng viên"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lecturers.map((lec) => (
                    <SelectItem key={lec.id} value={lec.id}>
                      {lec.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxStudents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sĩ số tối đa</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="OPEN">Mở đăng ký</SelectItem>
                    <SelectItem value="CLOSED">Đóng đăng ký</SelectItem>
                    <SelectItem value="IN_PROGRESS">Đang học</SelectItem>
                    <SelectItem value="COMPLETED">Đã kết thúc</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày khai giảng</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enrollmentDeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hạn chót đăng ký</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Cập nhật lớp học" : "Tạo lớp học mới"}
        </Button>
      </form>
    </Form>
  );
}
