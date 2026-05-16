import { useState } from "react";
import { Plus, Users, Calendar, UserCheck, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { ClassForm } from "./ClassForm";
import { useClasses } from "../hooks/useClasses";
import type { CreateClassInput } from "../schema";

interface ClassManagementProps {
  courseId: string;
}

export function ClassManagement({ courseId }: ClassManagementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { classes, isLoading, createClass, isCreating } = useClasses(courseId);

  const handleCreateClass = async (data: CreateClassInput) => {
    try {
      // Ensure dates are in ISO format for the API
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        enrollmentDeadline: new Date(data.enrollmentDeadline).toISOString(),
      };
      await createClass(payload);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create class:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="mt-8 border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Danh sách Lớp học (Niên khóa)</CardTitle>
          <CardDescription>Quản lý các lớp học, phân công giảng viên và hạn đăng ký.</CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Thêm Lớp Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm Lớp Học Mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết để tạo một lớp học mới cho khóa học này.
              </DialogDescription>
            </DialogHeader>
            <ClassForm onSubmit={handleCreateClass} isLoading={isCreating} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {classes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl bg-muted/20">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">Chưa có lớp học nào cho khóa này.</p>
            <p className="text-sm">Hãy nhấn nút "Thêm Lớp Mới" để bắt đầu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => {
              return (
                <Card key={cls.id} className="bg-muted/30 border-none shadow-sm hover:ring-1 hover:ring-primary/20 transition-all">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">{cls.className}</h3>
                      <Badge variant={cls.status === "OPEN" ? "default" : "secondary"} className="rounded-full">
                        {cls.status === "OPEN" ? "Đang mở" : cls.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span>Giảng viên: {cls.lecturerId ? "Đã phân công" : "Chưa có"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>Sĩ số: {cls.maxStudents} học viên</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Khai giảng: {new Date(cls.startDate).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Button variant="outline" size="sm" className="w-full rounded-xl">Chi tiết</Button>
                      <Button variant="ghost" size="sm" className="w-full rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10">Xóa</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
