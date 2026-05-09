import { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import { toast } from "sonner";
import { consultationService, type ConsultationStatus } from "../services/consultationService";

export default function StaffConsultationManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: consultations, isLoading } = useQuery({
    queryKey: ["consultations"],
    queryFn: () => consultationService.getConsultations(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: ConsultationStatus }) => 
      consultationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi cập nhật: ${error.message}`);
    }
  });

  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-none"><Clock className="h-3 w-3 mr-1" /> Chờ xử lý</Badge>;
      case "CONTACTED":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none"><Phone className="h-3 w-3 mr-1" /> Đã liên hệ</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-green-100 text-green-700 border-none"><CheckCircle2 className="h-3 w-3 mr-1" /> Thành công</Badge>;
      case "REJECTED":
        return <Badge variant="secondary" className="bg-red-100 text-red-700 border-none"><XCircle className="h-3 w-3 mr-1" /> Từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredData = (consultations || []).filter(item => 
    item.customerName.toLowerCase().includes(search.toLowerCase()) ||
    item.phone.includes(search) ||
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Tư vấn</h1>
          <p className="text-muted-foreground mt-1">Theo dõi và xử lý các yêu cầu tư vấn khóa học từ khách hàng.</p>
        </div>
        <Button className="gap-2">
          <Calendar className="h-4 w-4" /> Xuất báo cáo tuần
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm theo tên, SĐT hoặc Email..." 
                className="pl-10" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" /> Bộ lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p>Đang tải danh sách yêu cầu...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="text-left py-4 px-2">Khách hàng</th>
                    <th className="text-left py-4 px-2">Khóa học quan tâm</th>
                    <th className="text-left py-4 px-2">Trạng thái</th>
                    <th className="text-left py-4 px-2">Ngày gửi</th>
                    <th className="text-right py-4 px-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex flex-col">
                          <span className="font-bold">{item.customerName}</span>
                          <span className="text-xs text-muted-foreground">{item.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-normal text-[10px]">{item.courseInterest}</Badge>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="py-4 px-2 text-muted-foreground">
                        {item.createdAt}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Mail className="h-4 w-4" /> Gửi Email
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2"
                                onClick={() => updateStatusMutation.mutate({ id: item.id, status: "CONTACTED" })}
                              >
                                <Phone className="h-4 w-4" /> Đánh dấu đã liên hệ
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2"
                                onClick={() => updateStatusMutation.mutate({ id: item.id, status: "COMPLETED" })}
                              >
                                <CheckCircle2 className="h-4 w-4" /> Đánh dấu thành công
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2 text-red-600"
                                onClick={() => updateStatusMutation.mutate({ id: item.id, status: "REJECTED" })}
                              >
                                <XCircle className="h-4 w-4" /> Từ chối yêu cầu
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Hiển thị {filteredData.length} yêu cầu</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
