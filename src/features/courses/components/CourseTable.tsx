import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, ListVideo, BookOpen, Trash2, Loader2, AlertTriangle } from "lucide-react";
import type { Course } from "../type";
import { useMutation } from "@tanstack/react-query";
import { courseService } from "../services";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface CourseTableProps {
  courses: Course[];
  isLoading: boolean;
  onDeleteSuccess?: () => void;
}

export function CourseTable({ courses, isLoading, onDeleteSuccess }: CourseTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.remove(id),
    onSuccess: () => {
      toast.success("Đã xóa khóa học");
      setDeleteId(null);
      onDeleteSuccess?.();
    }
  });

  if (isLoading) {
    return (
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Khóa học</TableHead>
              <TableHead>Hình thức</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Giá bán</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-20 rounded bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                      <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                    </div>
                  </div>
                </TableCell>
                <TableCell><div className="h-6 w-16 rounded bg-muted animate-pulse" /></TableCell>
                <TableCell><div className="h-6 w-20 rounded bg-muted animate-pulse" /></TableCell>
                <TableCell className="text-right"><div className="h-4 w-20 rounded bg-muted animate-pulse ml-auto" /></TableCell>
                <TableCell className="text-right"><div className="h-8 w-16 rounded bg-muted animate-pulse ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed p-20 text-center bg-card/50">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Chưa có khóa học nào</h3>
        <p className="text-muted-foreground max-w-xs mx-auto mt-2">
          Hệ thống hiện chưa có dữ liệu khóa học. Hãy bắt đầu bằng việc tạo một khóa học mới.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border bg-card shadow-md overflow-hidden border-border/50">
        <Table>
          <TableHeader className="bg-muted/40 border-b">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs uppercase font-bold tracking-wider text-muted-foreground">Khóa học</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Hình thức</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Trạng thái</TableHead>
              <TableHead className="text-right text-xs uppercase font-bold tracking-wider text-muted-foreground">Giá niêm yết</TableHead>
              <TableHead className="text-right px-6 text-xs uppercase font-bold tracking-wider text-muted-foreground">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.courseId} className="group transition-all hover:bg-muted/20 border-b last:border-0">
                <TableCell className="py-3 px-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-20 rounded-md overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex-shrink-0 border border-border shadow-sm group-hover:shadow-md transition-shadow">
                      {course.imgUrl ? (
                        <img src={course.imgUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 max-w-[400px] lg:max-w-[550px]">
                      <h3 className="font-bold text-sm leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors pt-1">
                        {course.courseName}
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded w-fit mt-1">
                        ID: {course.courseId.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={course.courseType === 1 
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20 px-2 py-0.5 shadow-none" 
                      : "bg-purple-500/10 text-purple-600 border-purple-500/20 px-2 py-0.5 shadow-none"
                    }
                  >
                    {course.courseType === 1 ? "Online" : "Trung tâm"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${course.isActive ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
                    <span className={`text-xs font-medium ${course.isActive ? "text-green-600" : "text-slate-500"}`}>
                      {course.isActive ? "Mở bán" : "Lưu trữ"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-black text-sm">
                  <span className="text-primary">{new Intl.NumberFormat("vi-VN").format(course.basePrice)}</span>
                  <span className="text-[10px] ml-0.5 font-normal text-muted-foreground">đ</span>
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex items-center justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Link to={`/admin/courses/${course.courseId}/edit`}>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white border-orange-200 transition-all shadow-sm"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/admin/courses/${course.courseId}/content`}>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-200 transition-all shadow-sm"
                        title="Nội dung bài học"
                      >
                        <ListVideo className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      onClick={() => setDeleteId(course.courseId)}
                      className="h-8 w-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white border-red-200 transition-all shadow-sm"
                      title="Xóa khóa học"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> 
              Xác nhận xóa khóa học
            </DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Khóa học sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              Bạn có chắc chắn muốn xóa khóa học này? Mọi dữ liệu liên quan đến học viên và bài học cũng có thể bị ảnh hưởng.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Hủy bỏ</Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
              className="gap-2"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
