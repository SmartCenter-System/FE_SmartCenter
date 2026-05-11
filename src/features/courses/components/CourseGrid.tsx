import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, ListVideo, BookOpen, Trash2, Globe, Building2, AlertTriangle, Loader2 } from "lucide-react";
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

interface CourseGridProps {
  courses: Course[];
  isLoading: boolean;
  onDeleteSuccess?: () => void;
}

export function CourseGrid({ courses, isLoading, onDeleteSuccess }: CourseGridProps) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden border-none shadow-sm animate-pulse">
            <div className="h-40 bg-muted" />
            <CardContent className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 w-16 bg-muted rounded-full" />
                <div className="h-4 w-20 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="p-20 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Chưa có khóa học nào</h3>
        <p className="text-muted-foreground max-w-xs mx-auto mt-2">
          Hệ thống hiện chưa có dữ liệu khóa học.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 bg-muted/10">
        {courses.map((course) => (
          <Card key={course.courseId} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card rounded-2xl relative">
            {/* Image/Gradient Placeholder */}
            <div className="relative h-40 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
              {course.imgUrl ? (
                <img 
                  src={course.imgUrl} 
                  alt={course.courseName} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary/20" />
                </div>
              )}
              
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <Badge className={`${course.courseType === 1 ? "bg-green-500" : "bg-purple-500"} text-white border-none shadow-sm`}>
                  {course.courseType === 1 ? (
                    <div className="flex items-center gap-1"><Globe className="h-3 w-3" /> Online</div>
                  ) : (
                    <div className="flex items-center gap-1"><Building2 className="h-3 w-3" /> Offline</div>
                  )}
                </Badge>
                <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-primary border-none shadow-sm font-bold">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(course.basePrice)}
                </Badge>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                  Mở bán
                </Badge>
              </div>
            </div>

            <CardContent className="p-5">
              <h3 className="font-bold text-lg leading-tight line-clamp-3 min-h-[4.5rem] group-hover:text-primary transition-colors">
                {course.courseName}
              </h3>
              
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-muted">
                <div className="flex gap-1">
                  <Link to={`/admin/courses/${course.courseId}/content`}>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600" title="Quản lý bài học">
                      <ListVideo className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/admin/courses/${course.courseId}/edit`}>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-amber-50 hover:text-amber-600" title="Chỉnh sửa">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600"
                  onClick={() => setDeleteId(course.courseId)}
                  title="Xóa khóa học"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[32px] border-none shadow-2xl p-6">
          <DialogHeader className="flex flex-col items-center text-center pt-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-bold">Xác nhận xóa?</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Bạn có chắc muốn xóa khóa học này? Hành động này không thể hoàn tác và dữ liệu liên quan sẽ bị mất.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 pb-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteId(null)}
              className="flex-1 rounded-2xl h-12 font-semibold"
            >
              Hủy bỏ
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
              className="flex-1 rounded-2xl h-12 font-semibold shadow-lg shadow-red-200"
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xác nhận xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
