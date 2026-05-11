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
import { Link } from "react-router-dom";
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
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lecturer-courses"] });
      toast.success("Đã xóa khóa học");
    }
  });

  const { data, isLoading } = useQuery({
    queryKey: ["lecturer-courses", userId, search, status],
    queryFn: () => courseService.getCourses({ 
      LecturerId: userId || undefined,
      Keyword: search || undefined,
      // Note: If API supports isActive filter, we can add it here
    }),
    enabled: !!userId,
  });

  // Local filtering if API doesn't support status filter yet
  const rawCourses = data?.data || [];
  const courses = rawCourses.filter(c => {
    if (status === "ACTIVE") return c.isActive;
    if (status === "INACTIVE") return !c.isActive;
    return true;
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
          <Badge 
            variant={status === "ALL" ? "secondary" : "outline"} 
            className="cursor-pointer"
            onClick={() => setStatus("ALL")}
          >
            Tất cả ({rawCourses.length})
          </Badge>
          <Badge 
            variant={status === "ACTIVE" ? "secondary" : "outline"} 
            className="cursor-pointer hover:bg-primary/10 transition-colors"
            onClick={() => setStatus("ACTIVE")}
          >
            Đang hoạt động ({rawCourses.filter(c => c.isActive).length})
          </Badge>
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
                  <Link to={`/lecturer/courses/${course.courseId}/content`}>
                    <Button size="sm" variant="secondary" className="gap-2">
                      <PlayCircle className="h-4 w-4" /> Nội dung
                    </Button>
                  </Link>
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
                    <span>{(course as any).enrolledCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span>{(course as any).averageRating || "N/A"}</span>
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
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem 
                          className="gap-2 font-semibold"
                          onClick={() => {
                            const newStatus = !course.isActive;
                            courseService.update(course.courseId, { ...course, isActive: newStatus })
                              .then(() => {
                                queryClient.invalidateQueries({ queryKey: ["lecturer-courses"] });
                                toast.success(newStatus ? "Đã xuất bản" : "Đã tạm ẩn");
                              });
                          }}
                        >
                          {course.isActive ? (
                            <><Eye className="h-4 w-4 text-slate-500" /> Tạm ẩn khóa học</>
                          ) : (
                            <><Eye className="h-4 w-4 text-green-600" /> Xuất bản khóa học</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2" onClick={() => handleEdit(course)}>
                          <Edit className="h-4 w-4" /> Chỉnh sửa thông tin
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" asChild>
                          <Link to={`/lecturer/courses/${course.courseId}/content`}>
                            <PlayCircle className="h-4 w-4" /> Quản lý nội dung
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" asChild>
                          <Link to={`/lecturer/courses/${course.courseId}/students`}>
                            <Users className="h-4 w-4" /> Tiến độ học viên
                          </Link>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
          <div className="p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-3xl font-black tracking-tight">{editingCourse ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}</DialogTitle>
            </DialogHeader>
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
