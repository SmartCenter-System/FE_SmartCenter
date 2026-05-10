import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Search, 
  Users, 
  GraduationCap, 
  Clock, 
  CheckCircle2,
  MoreVertical,
  Mail,
  Loader2
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/shared/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import { apiClient } from "@/lib/axios";
import { courseService } from "@/features/courses/services";
import { API_ENDPOINTS } from "@/shared/constants";
import { useState } from "react";

export default function LecturerStudentProgressPage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getById(courseId!),
    enabled: !!courseId,
  });

  const { data: progressData, isLoading: isProgressLoading } = useQuery({
    queryKey: ["course-progress", courseId],
    queryFn: async () => {
      const res = await apiClient.get<any>(API_ENDPOINTS.PROGRESS.BY_COURSE(courseId!));
      return Array.isArray(res) ? res : res?.items || [];
    },
    enabled: !!courseId,
  });

  const filteredStudents = (progressData || []).filter((s: any) => 
    s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    s.studentEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalStudents: progressData?.length || 0,
    avgProgress: progressData?.length 
      ? Math.round(progressData.reduce((acc: number, curr: any) => acc + (curr.progressPercentage || 0), 0) / progressData.length) 
      : 0,
    completedStudents: progressData?.filter((s: any) => s.progressPercentage === 100).length || 0
  };

  if (isCourseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight">{course?.courseName}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Users className="h-4 w-4" /> Quản lý tiến độ của {stats.totalStudents} học viên
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-xl">
            <Mail className="h-4 w-4" /> Gửi thông báo lớp
          </Button>
          <Button className="gap-2 rounded-xl shadow-lg">
            Xuất báo cáo (CSV)
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-blue-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600/80 uppercase tracking-wider">Tổng học viên</p>
              <h3 className="text-3xl font-black text-blue-700">{stats.totalStudents}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-amber-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-600/80 uppercase tracking-wider">Tiến độ trung bình</p>
              <h3 className="text-3xl font-black text-amber-700">{stats.avgProgress}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-emerald-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-600/80 uppercase tracking-wider">Đã hoàn thành</p>
              <h3 className="text-3xl font-black text-emerald-700">{stats.completedStudents}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-muted/30 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Danh sách học viên
            </CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm tên hoặc email..." 
                className="pl-10 rounded-xl" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isProgressLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p>Đang tải dữ liệu học viên...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              {search ? "Không tìm thấy học viên nào phù hợp." : "Chưa có học viên nào tham gia khóa học này."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-muted/10">
                    <th className="px-6 py-4 font-bold text-sm">Học viên</th>
                    <th className="px-6 py-4 font-bold text-sm">Tiến độ</th>
                    <th className="px-6 py-4 font-bold text-sm">Hoàn thành</th>
                    <th className="px-6 py-4 font-bold text-sm">Cập nhật cuối</th>
                    <th className="px-6 py-4 font-bold text-sm text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredStudents.map((student: any) => (
                    <tr key={student.studentId} className="hover:bg-muted/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {student.studentName?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{student.studentName}</p>
                            <p className="text-xs text-muted-foreground">{student.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 w-64">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span>{student.progressPercentage}%</span>
                            <span className="text-muted-foreground">{student.completedLessons}/{student.totalLessons} bài</span>
                          </div>
                          <Progress value={student.progressPercentage} className="h-1.5" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {student.progressPercentage === 100 ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none">Hoàn thành</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Đang học</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {student.lastAccessDate ? new Date(student.lastAccessDate).toLocaleDateString("vi-VN") : "Chưa học"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="gap-2">
                              <Mail className="h-4 w-4" /> Gửi tin nhắn riêng
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={() => navigate(`/lecturer/exams/placeholder-exam/grade/${student.studentId}`)}
                            >
                              <GraduationCap className="h-4 w-4" /> Chấm điểm bài tập
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Users className="h-4 w-4" /> Xem hồ sơ học tập
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
