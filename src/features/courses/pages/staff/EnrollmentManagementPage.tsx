import { useState } from "react";

import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store";
import {
  consultationService,
  type ConsultationStatus,
} from "@/features/consultation/service";

export default function EnrollmentManagementPage() {
  const queryClient = useQueryClient();
  const staffId = useAuthStore((state) => state.userId);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: consultations, isLoading: isLoadingConsultations } = useQuery({
    queryKey: ["consultations", "list"],
    queryFn: () => consultationService.getConsultations(),
  });

  const acceptMutation = useMutation({
    mutationFn: async (consultationId: string) => {
      if (!staffId) {
        throw new Error("Staff ID không tìm thấy");
      }

      setProcessingId(consultationId);
      return consultationService.accept(staffId, consultationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      toast.success("Đã chấp nhận yêu cầu tư vấn");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể chấp nhận yêu cầu tư vấn");
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (consultationId: string) => {
      if (!staffId) {
        throw new Error("Staff ID không tìm thấy");
      }

      setProcessingId(consultationId);
      return consultationService.reject(staffId, consultationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      toast.success("Đã từ chối yêu cầu tư vấn");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể từ chối yêu cầu tư vấn");
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  const getStatusIcon = (status: ConsultationStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "CONSULTING":
      case "ACCEPTED":
      case "PROCESSED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "REJECTED":
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: ConsultationStatus) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "CONSULTING":
      case "ACCEPTED":
        return "Đang tư vấn";
      case "PROCESSED":
        return "Đã tư vấn";
      case "REJECTED":
      case "CANCELLED":
        return "Từ chối tư vấn";
      default:
        return "Chờ xử lý";
    }
  };

  const isPendingStatus = (status: ConsultationStatus) =>
    String(status).trim().toUpperCase() === "PENDING";

  const leads = consultations?.items || [];
  const filteredConsultations = leads.filter((lead: any) => {
    const text = `${lead.fullName ?? ""} ${lead.phone ?? ""}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const handleStatusChange = (leadId: string, value: ConsultationStatus) => {
    if (value === "PENDING") {
      return;
    }

    if (value === "REJECTED" || value === "CANCELLED") {
      rejectMutation.mutate(leadId);
      return;
    }

    acceptMutation.mutate(leadId);
  };

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Tuyển sinh & Ghi danh
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Yêu cầu tư vấn</CardTitle>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm theo tên hoặc SĐT..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                        <TableCell
                          colSpan={3}
                          className="text-center h-32 text-muted-foreground"
                        >
                          Không tìm thấy khách hàng nào.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredConsultations.map((lead: any) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div className="font-medium text-sm">{lead.fullName}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {lead.phone}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <Badge variant="outline" className="font-normal">
                              {lead.courseName}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {isPendingStatus(lead.status) ? (
                              <Select
                                value={lead.status}
                                onValueChange={(value: ConsultationStatus) =>
                                  handleStatusChange(lead.id, value)
                                }
                                disabled={processingId === lead.id}
                              >
                                <SelectTrigger className="w-[180px] h-9 text-xs border-dashed focus:ring-0 focus:ring-offset-0 bg-background">
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(lead.status)}
                                    <SelectValue>{getStatusLabel(lead.status)}</SelectValue>
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PENDING" className="text-xs text-amber-600 font-medium">
                                    Chờ xử lý
                                  </SelectItem>
                                  <SelectItem value="CONSULTING" className="text-xs text-blue-600 font-medium">
                                    Đang tư vấn
                                  </SelectItem>
                                  <SelectItem value="PROCESSED" className="text-xs text-green-600 font-medium">
                                    Đã tư vấn
                                  </SelectItem>
                                  <SelectItem value="REJECTED" className="text-xs text-red-600 font-medium">
                                    Từ chối tư vấn
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="flex items-center gap-2 text-sm">
                                {getStatusIcon(lead.status)}
                                <Badge variant="outline" className="font-normal">
                                  {getStatusLabel(lead.status)}
                                </Badge>
                              </div>
                            )}
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
   
 