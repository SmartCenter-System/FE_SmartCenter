import { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Users, 
  Star, 
  PlayCircle,
  Edit,
  Eye,
  Trash2,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { courseService } from "@/features/courses/services";
import { useAuthStore } from "@/features/auth/store";
import { CourseForm } from "@/features/courses/components/CourseForm";
import { toast } from "sonner";

export default function LecturerCourseManagementPage() {
  const { userId } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["lecturer-courses", userId, search],
    queryFn: () => courseService.getCourses({ 
      LecturerId: userId || undefined,
      Keyword: search || undefined
    }),
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lecturer-courses"] });
      toast.success("Đã xóa khóa học thành công!");
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi xóa: ${error.message}`);
    }
  });

  const handleCreate = () => {
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      deleteMutation.mutate(id);
    }
  };

  const courses = data?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Khóa học của tôi</h1>
          <p className="text-muted-foreground mt-1">Quản lý nội dung bài giảng và theo dõi tiến độ học tập của học viên.</p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-lg bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Tạo khóa học mới
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm khóa học..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="cursor-pointer">Tất cả ({courses.length})</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 transition-colors">Đang hoạt động</Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p>Đang tải danh sách khóa học...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed">
          <p className="text-muted-foreground">Bạn chưa có khóa học nào hoặc không tìm thấy kết quả.</p>
          <Button variant="link" onClick={handleCreate} className="mt-2">Bắt đầu tạo khóa học đầu tiên</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.courseId} className="border-none shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden bg-card">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img 
                  src={course.imgUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"} 
                  alt={course.courseName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" className="gap-2">
                    <PlayCircle className="h-4 w-4" /> Nội dung
                  </Button>
                </div>
                <Badge 
                  className={`absolute top-3 left-3 border-none ${course.isActive ? 'bg-green-500' : 'bg-slate-500'}`}
                >
                  {course.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                  {course.courseName}
                </h3>
                
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>{course.maxStudents || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span>4.8</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="font-bold text-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.basePrice)}
                  </span>
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="gap-2" onClick={() => handleEdit(course)}>
                          <Edit className="h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" /> Xem trang học
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2 text-red-600"
                          onClick={() => handleDelete(course.courseId)}
                        >
                          <Trash2 className="h-4 w-4" /> Xóa khóa học
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Card */}
          <button 
            onClick={handleCreate}
            className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-primary/5 hover:border-primary/50 transition-all group min-h-[350px]"
          >
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <Plus className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-lg">Tạo khóa học mới</h4>
              <p className="text-sm text-muted-foreground mt-1 px-4">Bắt đầu chia sẻ kiến thức của bạn ngay hôm nay.</p>
            </div>
          </button>
        </div>
      )}

      {/* Course Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CourseForm 
              courseId={editingCourse?.courseId} 
              initialData={editingCourse} 
              onSuccess={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
