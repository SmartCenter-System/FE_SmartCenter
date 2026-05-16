import { useMemo, useState } from "react";

import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/shared/components/ui/input";
import PaginationBar from "@/shared/components/common/PaginationBar";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";
import {
  consultationService,
  type ConsultationRequest,
  type ConsultationStatus,
} from "@/features/consultation/service";

const PAGE_SIZE = 10;

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }

  return fallback;
}

export default function EnrollmentManagementPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);

  const { data: consultations, isLoading: isLoadingConsultations } = useQuery({
    queryKey: ["consultations", "list", pageIndex, PAGE_SIZE],
    queryFn: () =>
      consultationService.getConsultations({
        PageIndex: pageIndex,
        PageSize: PAGE_SIZE,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      consultationId,
      status,
    }: {
      consultationId: string;
      status: ConsultationStatus;
    }) => {
      setProcessingId(consultationId);
      return consultationService.updateStatus(consultationId, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      toast.success(
        variables.status === "PROCESSING"
          ? "Đã chuyển sang trạng thái đang tư vấn"
          : "Đã cập nhật trạng thái tư vấn",
      );
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Không thể cập nhật trạng thái tư vấn"));
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  const getStatusIcon = (status: ConsultationStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "PROCESSING":
      case "CONSULTING":
      case "ACCEPTED":
        return <Clock className="h-4 w-4 text-blue-500" />;
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
      case "PROCESSING":
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

  const canChangeStatus = (status: ConsultationStatus) =>
    ["PENDING", "PROCESSING", "CONSULTING", "ACCEPTED"].includes(String(status).trim().toUpperCase());

  const getEditableStatusValue = (status: ConsultationStatus) =>
    status === "ACCEPTED" || status === "CONSULTING" ? "PROCESSING" : status;

  const leads = consultations?.items || [];
  const filteredConsultations = leads.filter((lead: ConsultationRequest) => {
    const text = `${lead.fullName ?? ""} ${lead.phone ?? ""}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const totalCount = consultations?.totalCount ?? filteredConsultations.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(pageIndex, totalPages);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const paginationItems = useMemo(() => {
      const items: (number | "ellipsis")[] = [];

    for (let page = 1; page <= totalPages; page += 1) {
      const isEdge = page === 1 || page === totalPages;
      const isNearActive = Math.abs(page - currentPage) <= 1;

      if (isEdge || isNearActive) {
        items.push(page);
        continue;
      }

      if (items[items.length - 1] !== "ellipsis") {
        items.push("ellipsis");
      }
    }

    return items;
  }, [currentPage, totalPages]);

  const paginatedConsultations = filteredConsultations;

  const handlePageChange = (nextPage: number) => {
    setPageIndex(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const handleStatusChange = (lead: ConsultationRequest, value: ConsultationStatus) => {
    if (value === "PENDING") {
      return;
    }

    if (value === getEditableStatusValue(lead.status)) {
      return;
    }

    updateStatusMutation.mutate({
      consultationId: lead.id,
      status: value,
    });
  };

  const formatDateTime = (value?: string) => {
    if (!value) return "Không có thông tin";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Không có thông tin";

    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPageIndex(1);
                    }}
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
                      paginatedConsultations.map((lead: ConsultationRequest) => (
                        <TableRow
                          key={lead.id}
                          tabIndex={0}
                          role="button"
                          className="cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
                          onClick={() => setSelectedConsultation(lead)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedConsultation(lead);
                            }
                          }}
                        >
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
                          <TableCell onClick={(event) => event.stopPropagation()}>
                            {canChangeStatus(lead.status) ? (
                              <Select
                                value={getEditableStatusValue(lead.status)}
                                onValueChange={(value: ConsultationStatus) =>
                                  handleStatusChange(lead, value)
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
                                  <SelectItem value="PROCESSING" className="text-xs text-blue-600 font-medium">
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
              {totalCount > PAGE_SIZE ? (
                <PaginationBar
                  className="mt-5 justify-center"
                  items={paginationItems}
                  activePage={currentPage}
                  previousDisabled={!canGoPrevious}
                  nextDisabled={!canGoNext}
                  onPageChange={handlePageChange}
                  onPrevious={() => handlePageChange(currentPage - 1)}
                  onNext={() => handlePageChange(currentPage + 1)}
                />
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={!!selectedConsultation}
        onOpenChange={(open) => {
          if (!open) setSelectedConsultation(null);
        }}
      >
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Thông tin tư vấn</DialogTitle>
            <DialogDescription>
              Chi tiết yêu cầu tư vấn của học viên.
            </DialogDescription>
          </DialogHeader>

          {selectedConsultation ? (
            <div className="space-y-5">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {selectedConsultation.fullName}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedConsultation.email}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 font-normal">
                    {getStatusLabel(selectedConsultation.status)}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Số điện thoại</p>
                  <p className="mt-1 text-sm font-medium">{selectedConsultation.phone || "Không có thông tin"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Ngày gửi</p>
                  <p className="mt-1 text-sm font-medium">{formatDateTime(selectedConsultation.createdAt)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Khóa học quan tâm</p>
                  <p className="mt-1 text-sm font-medium">{selectedConsultation.courseName || "Không có thông tin"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Ghi chú</p>
                  <p className="mt-1 whitespace-pre-line text-sm">
                    {selectedConsultation.note || "Không có ghi chú"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
   
 
