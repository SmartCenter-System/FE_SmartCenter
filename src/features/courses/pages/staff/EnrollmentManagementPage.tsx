import { useState } from "react";
import { 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CreditCard,
  UserPlus,
  Loader2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { toast } from "sonner";

import { courseService } from "@/features/courses/services";
import { userService } from "@/features/users/services";
import { enrollmentService } from "@/features/courses/enrollmentService";
import { consultationService, type ConsultationStatus } from "@/features/consultation/service";

export default function EnrollmentManagementPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Enrollment Form State
  const [enrollEmail, setEnrollEmail] = useState("");
  const [enrollCourseId, setEnrollCourseId] = useState("");
  const [enrollAmount, setEnrollAmount] = useState("");
  const [foundStudent, setFoundStudent] = useState<any>(null);
  const [isSearchingStudent, setIsSearchingStudent] = useState(false);

  // Queries
  const { data: coursesData } = useQuery({
    queryKey: ["courses", "staff-list"],
    queryFn: () => courseService.getCourses({ limit: 100 }),
    staleTime: 30 * 60 * 1000, // Danh sách khóa học ít thay đổi, giữ cache lâu hơn
  });
  const courses = coursesData?.data || [];

  const { data: consultations, isLoading: isLoadingConsultations } = useQuery({
    queryKey: ["consultations", "list"],
    queryFn: () => consultationService.getConsultations(),
  });

  // Mutations
  const updateConsultationMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: ConsultationStatus }) => 
      consultationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      toast.success("Cập nhật trạng thái yêu cầu thành công!");
    }
  });

  const enrollMutation = useMutation({
    mutationFn: (data: { studentId: string, courseId: string, amount: number }) => 
      enrollmentService.enroll(data.courseId, `STAFF_MANUAL_${Date.now()}`, data.studentId),
    onSuccess: () => {
      toast.success("Ghi danh thành công");
      setEnrollEmail("");
      setEnrollCourseId("");
      setEnrollAmount("");
      setFoundStudent(null);
    }
  });

  const handleSearchStudent = async () => {
    if (!enrollEmail) return;
    setIsSearchingStudent(true);
    try {
      const res = await userService.getUsers({ search: enrollEmail, role: "STUDENT" });
      if (res.data.length > 0) {
        setFoundStudent(res.data[0]);
        toast.success(`Tìm thấy: ${res.data[0].fullName}`);
      } else {
        setFoundStudent(null);
        // This is a logic error (not found), not a server error, so keeping it might be okay, 
        // but let's see if interceptor handles 404. Usually getUsers returns empty array, not 404.
        toast.error("Không tìm thấy học viên");
      }
    } catch (error) {
      // Redundant as interceptor will show error
    } finally {
      setIsSearchingStudent(false);
    }
  };

  const handleEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundStudent || !enrollCourseId || !enrollAmount) {
      toast.error("Vui lòng điền đầy đủ thông tin và xác nhận học viên!");
      return;
    }

    enrollMutation.mutate({
      studentId: foundStudent.id,
      courseId: enrollCourseId,
      amount: Number(enrollAmount)
    });
  };

  const getStatusIcon = (status: ConsultationStatus) => {
    switch (status) {
      case "PENDING": return <Clock className="h-4 w-4 text-amber-500" />;
      case "PROCESSED": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "CANCELLED": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const leads = consultations?.items || [];
  const filteredConsultations = (leads || []).filter((l: any) => 
    l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tuyển sinh & Ghi danh</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý yêu cầu tư vấn và Ghi nhận học phí tiền mặt trực tiếp.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Manual Enrollment Form */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Ghi danh Offline</CardTitle>
              </div>
              <CardDescription>
                Xác nhận thu tiền mặt và thêm tài khoản học viên vào lớp.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleEnrollment} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Học viên</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="email" 
                      placeholder="VD: student@gmail.com" 
                      value={enrollEmail}
                      onChange={e => setEnrollEmail(e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={handleSearchStudent}
                      disabled={isSearchingStudent}
                    >
                      {isSearchingStudent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                  {foundStudent && (
                    <p className="text-xs text-green-600 font-medium">
                      Học viên: {foundStudent.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Khóa học / Niên khóa</Label>
                  <Select value={enrollCourseId} onValueChange={setEnrollCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp học..." />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.courseId} value={course.courseId}>
                          {course.courseName} ({course.courseType === 1 ? "Online" : "Offline"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Số tiền đã thu (Tiền mặt)</Label>
                  <div className="relative">
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="5.000.000" 
                      className="pr-12"
                      value={enrollAmount}
                      onChange={e => setEnrollAmount(e.target.value)}
                    />
                    <div className="absolute right-3 top-2.5 text-sm font-medium text-muted-foreground">
                      VNĐ
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={enrollMutation.isPending}>
                    {enrollMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                    Xác nhận ghi danh
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Kịch bản tư vấn nhanh
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                <li>Luôn xin số điện thoại phụ huynh để tiện báo cáo kết quả.</li>
                <li>Hỏi thăm mục tiêu điểm số đại học trước khi tư vấn.</li>
                <li>Ưu tiên hướng dẫn đăng ký Combo để có giá ưu đãi.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Leads Management */}
        <div className="xl:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Yêu cầu tư vấn (Leads)</CardTitle>
                  <CardDescription>
                    Khách hàng để lại thông tin từ Website, Zalo và Messenger.
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Tìm theo tên hoặc SĐT..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Khóa học quan tâm</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingConsultations ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center h-32">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : filteredConsultations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center h-32 text-muted-foreground">
                          Không tìm thấy khách hàng nào.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredConsultations.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div className="font-medium text-sm">{lead.fullName}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{lead.phone}</div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <Badge variant="outline" className="font-normal">{lead.courseName}</Badge>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={lead.status} 
                              onValueChange={(val: ConsultationStatus) => updateConsultationMutation.mutate({ id: lead.id, status: val })}
                            >
                              <SelectTrigger className="w-[140px] h-8 text-xs border-dashed focus:ring-0 focus:ring-offset-0 bg-background">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(lead.status)}
                                  <SelectValue />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING" className="text-xs text-amber-600 font-medium">Chờ xử lý</SelectItem>
                                <SelectItem value="PROCESSED" className="text-xs text-green-600 font-medium">Đã tư vấn</SelectItem>
                                <SelectItem value="CANCELLED" className="text-xs text-red-600 font-medium">Đã hủy</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
