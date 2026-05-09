import { 
  MessageSquare, 
  UserPlus, 
  CheckCircle2, 
  Clock,
  Search,
  PhoneCall,
  Calendar,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { consultationService } from "../services/consultationService";

export default function StaffDashboardPage() {
  const { data: consultations, isLoading } = useQuery({
    queryKey: ["consultations"],
    queryFn: () => consultationService.getConsultations(),
  });
  
  const stats = [
    { 
      label: "Leads mới", 
      value: consultations?.filter(c => c.status === "PENDING").length.toString() || "0", 
      icon: MessageSquare, 
      color: "text-blue-600 bg-blue-50 border-blue-100" 
    },
    { 
      label: "Đã liên hệ", 
      value: consultations?.filter(c => c.status === "CONTACTED").length.toString() || "0", 
      icon: PhoneCall, 
      color: "text-orange-600 bg-orange-50 border-orange-100" 
    },
    { 
      label: "Thành công", 
      value: consultations?.filter(c => c.status === "COMPLETED").length.toString() || "0", 
      icon: UserPlus, 
      color: "text-green-600 bg-green-50 border-green-100" 
    },
    { 
      label: "Tổng yêu cầu", 
      value: consultations?.length.toString() || "0", 
      icon: Calendar, 
      color: "text-purple-600 bg-purple-50 border-purple-100" 
    },
  ];

  const pendingLeads = (consultations || [])
    .filter(c => c.status === "PENDING")
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trung tâm Tuyển sinh</h1>
          <p className="text-muted-foreground mt-1">Quản lý khách hàng tiềm năng và hỗ trợ ghi danh học viên.</p>
        </div>
        <Link to="/staff/enrollments">
          <Button className="gap-2 shadow-lg">
            <UserPlus className="h-4 w-4" /> Ghi danh học viên mới
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat, i) => (
            <Card key={i} className={`border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-card border-l-4 ${(stat.color.split(' ').pop() || '').replace('bg-', 'border-')}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${stat.color.split(' ').slice(0, 2).join(' ')}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-tight">{stat.label}</p>
                    <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Management */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Yêu cầu tư vấn mới</CardTitle>
              <CardDescription>Khách hàng đang chờ phản hồi từ bạn.</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              {pendingLeads.length} Leads
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : pendingLeads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground italic text-sm">
                  Không có yêu cầu mới nào.
                </div>
              ) : (
                pendingLeads.map((lead, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center font-bold text-primary text-xs">
                        {lead.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{lead.customerName}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px] h-4 px-1">{lead.courseInterest}</Badge>
                          <span>{lead.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">{lead.createdAt}</p>
                      <Link to="/staff/consultations">
                        <Button size="sm" variant="ghost" className="h-8 text-primary p-0 hover:bg-transparent">
                          Xử lý ngay <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
              <Link to="/staff/consultations">
                <Button variant="outline" className="w-full mt-2">Xem tất cả Tư vấn</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Search & Tools */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-lg">Tra cứu nhanh</CardTitle>
              <CardDescription>Tìm kiếm học viên hoặc mã đơn hàng.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="SĐT, Email hoặc Tên..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link to="/staff/consultations">
                  <Button variant="secondary" size="sm" className="h-10 justify-start gap-2 w-full">
                    <Clock className="h-4 w-4" /> Đang theo dõi
                  </Button>
                </Link>
                <Link to="/staff/consultations">
                  <Button variant="secondary" size="sm" className="h-10 justify-start gap-2 w-full">
                    <CheckCircle2 className="h-4 w-4" /> Đã hoàn thành
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-blue-50">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-indigo-900">Mục tiêu hôm nay</h4>
                <p className="text-sm text-indigo-700 mt-1">Hỗ trợ ghi danh cho 5 học viên mới.</p>
                <div className="mt-4 h-2 w-32 bg-indigo-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-1/3" />
                </div>
              </div>
              <div className="text-3xl font-black text-indigo-200">33%</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
