import { useState } from "react";
import { 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CreditCard,
  UserPlus
} from "lucide-react";

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

// Mock Types
type LeadStatus = "PENDING" | "IN_PROGRESS" | "CONVERTED" | "CANCELLED";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  courseInterested: string;
  source: "ZALO" | "MESSENGER" | "WEBSITE";
  status: LeadStatus;
  createdAt: string;
}

// Mock Data
const MOCK_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Phụ huynh bé Linh",
    phone: "0901234567",
    courseInterested: "Toán 12 - Luyện thi Đại học",
    source: "ZALO",
    status: "PENDING",
    createdAt: "2024-05-05T08:30:00Z"
  },
  {
    id: "lead-2",
    name: "Nguyễn Văn Hùng",
    phone: "0987654321",
    email: "hung.nguyen@gmail.com",
    courseInterested: "IELTS 6.5+ (Lớp Tối)",
    source: "WEBSITE",
    status: "IN_PROGRESS",
    createdAt: "2024-05-04T14:15:00Z"
  },
  {
    id: "lead-3",
    name: "Học sinh Minh Trí",
    phone: "0911223344",
    courseInterested: "Vật Lý 12 - Ôn thi THPT",
    source: "MESSENGER",
    status: "CONVERTED",
    createdAt: "2024-05-02T10:00:00Z"
  }
];

export default function EnrollmentManagementPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Enrollment Form State
  const [enrollEmail, setEnrollEmail] = useState("");
  const [enrollCourse, setEnrollCourse] = useState("");
  const [enrollAmount, setEnrollAmount] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Filter leads
  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.phone.includes(searchTerm)
  );

  const getStatusIcon = (status: LeadStatus) => {
    switch (status) {
      case "PENDING": return <Clock className="h-4 w-4 text-red-500" />;
      case "IN_PROGRESS": return <MessageSquare className="h-4 w-4 text-yellow-500" />;
      case "CONVERTED": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "CANCELLED": return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleUpdateStatus = (id: string, newStatus: LeadStatus) => {
    // TODO: Gọi API update lead status (useMutation -> patch /leads/:id/status)
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    toast.success(`Đã cập nhật trạng thái thành công!`);
  };

  const handleEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollEmail || !enrollCourse || !enrollAmount) {
      toast.error("Vui lòng điền đầy đủ thông tin ghi danh!");
      return;
    }

    setIsEnrolling(true);
    // TODO: Gọi API tạo đơn hàng & xác nhận thanh toán (useMutation -> post /enrollments)
    setTimeout(() => {
      setIsEnrolling(false);
      toast.success("Ghi danh thành công! Đã thêm học viên vào lớp học.");
      // Reset form
      setEnrollEmail("");
      setEnrollCourse("");
      setEnrollAmount("");
    }, 1500);
  };

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tuyển sinh & Ghi danh</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý yêu cầu tư vấn và Ghi nhận học phí tiền mặt trực tiếp.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Manual Enrollment Form (Thêm học sinh Offline) */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="border-primary/20 shadow-md dark:border-primary/30">
            <CardHeader className="bg-primary/5 pb-4 dark:bg-primary/10">
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
                    <Button type="button" variant="outline" size="icon" title="Tìm học viên">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Khóa học / Niên khóa</Label>
                  <Select value={enrollCourse} onValueChange={setEnrollCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp học..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="c1">Toán 12 - Lứa 2k8 (Offline)</SelectItem>
                      <SelectItem value="c2">Vật Lý 12 - Lứa 2k8 (Offline)</SelectItem>
                      <SelectItem value="c3">IELTS 6.5+ (Lớp Tối 2-4-6)</SelectItem>
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
                  <Button type="submit" className="w-full" disabled={isEnrolling}>
                    {isEnrolling ? "Đang xử lý..." : (
                      <><UserPlus className="h-4 w-4 mr-2" /> Xác nhận ghi danh</>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick Stats or Tips for Staff */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Kịch bản tư vấn nhanh
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Nguồn</TableHead>
                      <TableHead>Khóa học quan tâm</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                          Không tìm thấy khách hàng nào.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div className="font-medium text-sm">{lead.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{lead.phone}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs font-normal">
                              {lead.source}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {lead.courseInterested}
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={lead.status} 
                              onValueChange={(val: LeadStatus) => handleUpdateStatus(lead.id, val)}
                            >
                              <SelectTrigger className="w-[140px] h-8 text-xs border-dashed focus:ring-0 focus:ring-offset-0 bg-input/10 text-foreground dark:bg-input/30">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(lead.status)}
                                  <SelectValue />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING" className="text-xs text-red-600 font-medium">Chờ xử lý</SelectItem>
                                <SelectItem value="IN_PROGRESS" className="text-xs text-yellow-600 font-medium">Đang chăm sóc</SelectItem>
                                <SelectItem value="CONVERTED" className="text-xs text-green-600 font-medium">Đã chốt</SelectItem>
                                <SelectItem value="CANCELLED" className="text-xs text-muted-foreground font-medium">Hủy bỏ</SelectItem>
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
