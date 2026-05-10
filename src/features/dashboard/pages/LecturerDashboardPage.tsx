import { 
  Users, 
  BookOpen, 
  Star, 
  MessageCircle,
  PlayCircle,
  FileText,
  TrendingUp,
  PlusCircle,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { courseService } from "@/features/courses/services";
import { dashboardService } from "@/features/dashboard/services/dashboardService";
import { useAuthStore } from "@/features/auth/store";

export default function LecturerDashboardPage() {
  const { userId } = useAuthStore();
  
  const { data: coursesData, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["lecturer-dashboard-courses", userId],
    queryFn: () => courseService.getCourses({ LecturerId: userId || undefined, limit: 10 }),
    enabled: !!userId,
  });

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["lecturer-dashboard-stats", userId],
    queryFn: () => dashboardService.getLecturerStats(userId || ""),
    enabled: !!userId,
  });

  const courses = coursesData?.data || [];
  const isLoading = isLoadingCourses || isLoadingStats;
  
  const stats = [
    { 
      label: "Tổng học viên", 
      value: statsData?.totalStudents.toString() || "0", 
      icon: Users, 
      color: "text-blue-600 bg-blue-50" 
    },
    { 
      label: "Khóa học của tôi", 
      value: statsData?.activeCourses.toString() || courses.length.toString(), 
      icon: BookOpen, 
      color: "text-purple-600 bg-purple-50" 
    },
    { 
      label: "Đánh giá TB", 
      value: statsData?.averageRating ? statsData.averageRating.toFixed(1) : "N/A", 
      icon: Star, 
      color: "text-amber-600 bg-amber-50" 
    },
    { 
      label: "Tin nhắn mới", 
      value: statsData?.newMessages.toString() || "0", 
      icon: MessageCircle, 
      color: "text-green-600 bg-green-50" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Khu vực Giảng viên</h1>
          <p className="text-muted-foreground mt-1">Quản lý nội dung khóa học và tương tác với học viên.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/lecturer/courses">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> Quản lý nội dung
            </Button>
          </Link>
          <Link to="/lecturer/courses">
            <Button className="gap-2 shadow-md">
              <PlusCircle className="h-4 w-4" /> Tạo khóa học mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-8 text-center space-y-4">
                <Skeleton className="h-16 w-16 rounded-3xl mx-auto" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 mx-auto" />
                  <Skeleton className="h-10 w-20 mx-auto" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-card group overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -mr-12 -mt-12 transition-all group-hover:mr-0 group-hover:mt-0 opacity-20" />
                <div className={`p-4 rounded-3xl ${stat.color} w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-inner transition-transform group-hover:scale-110`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-4xl font-black mt-2 tracking-tight">{stat.value}</h3>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Khóa học của tôi</CardTitle>
            <CardDescription>Danh sách các khóa học bạn đang phụ trách.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground italic text-sm">
                  Bạn chưa có khóa học nào. Hãy bắt đầu tạo ngay!
                </div>
              ) : (
                courses.map((course, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border/50 hover:border-primary/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                        <PlayCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-tight">{course.courseName}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {(course as any).enrolledCount || 0} học viên</span>
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {(course as any).averageRating || "N/A"}</span>
                          <Badge variant={course.isActive ? "default" : "secondary"} className="text-[9px] h-4">
                            {course.isActive ? "Đang mở" : "Đang đóng"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Link to={`/lecturer/courses`}>
                      <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
            <Link to="/lecturer/courses">
              <Button variant="ghost" className="w-full mt-4 text-primary">Xem tất cả khóa học</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Student Feedback / Messages */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Tương tác mới nhất</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8 text-muted-foreground italic text-xs">
                Chưa có tương tác mới từ học viên.
              </div>
              <Button size="sm" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" /> Mở trung tâm tin nhắn
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-amber-600" />
                <h4 className="font-bold text-amber-900">Phát triển chuyên môn</h4>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Hệ thống ghi nhận bạn đang làm việc hiệu quả. Hãy tiếp tục cập nhật nội dung mới để tăng tương tác nhé!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
