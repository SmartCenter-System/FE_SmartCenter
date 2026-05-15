import { useState } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  Users,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { StatCard } from "../components/index";
import { ConsultationTable, type ConsultationRequest } from "../components/index";
import { useDashboardStaff } from "../hooks/useDashboardStaff";
import { useConsultationRequests } from "../hooks/useConsultationRequests";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

export default function StaffConsultationManagementPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch stats từ API
  const { data: statsData } = useDashboardStaff();

  // Fetch consultation requests từ API (paged)
  const { data: consultationData, isLoading } = useConsultationRequests(page, pageSize, search);

  // Map API data to ConsultationRequest format
  const items = consultationData?.items || [];
  const totalCount = consultationData?.totalCount ?? 0;

  function mapStatus(s?: string): "Chờ xử lý" | "Chấp nhận" | "Từ chối" {
    if (!s) return "Chờ xử lý";
    const us = String(s).toUpperCase();
    if (us === "PENDING") return "Chờ xử lý";
    if (us === "PROCESSED" || us === "ACCEPTED") return "Chấp nhận";
    if (us === "CANCELLED" || us === "REJECTED") return "Từ chối";
    return "Chờ xử lý";
  }

  const consultations: ConsultationRequest[] = items.map((item) => ({
    id: item.id,
    studentName: item.fullName,
    studentEmail: item.email,
    courseInterest: item.courseName || "Không xác định",
    courseTier: undefined,
    requestDate: new Date(item.createdAt).toLocaleDateString("vi-VN"),
    requestTime: new Date(item.createdAt).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: mapStatus(item.status) as "Chờ xử lý" | "Chấp nhận" | "Từ chối",
  }));


  const filteredData = consultations.filter(
    (item) =>
      item.studentName.toLowerCase().includes(search.toLowerCase()) ||
      item.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
      item.courseInterest.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  function getPaginationItems(total: number, current: number): (number | "ellipsis")[] {
    const delta = 1; // show current +/- delta
    const range: (number | "ellipsis")[] = [];
    const left = Math.max(1, current - delta);
    const right = Math.min(total, current + delta);

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= left && i <= right)) {
        range.push(i);
      } else if (i === left - 1 || i === right + 1) {
        range.push("ellipsis");
      }
    }

    // Remove consecutive duplicates
    return range.filter((v, idx, arr) => idx === 0 || v !== arr[idx - 1]);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Academic Support
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý yêu cầu tư vấn, sinh viên mới và đơn hàng
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<MessageSquare className="h-8 w-8 text-amber-500" />}
          count={statsData?.pendingConsultations ?? 0}
          label="Yêu cầu tư vấn"
          description="Cần phản hồi hôm nay"
        />
        <StatCard
          icon={<Users className="h-8 w-8 text-blue-500" />}
          count={statsData?.newStudentsToday ?? 0}
          label="Học viên mới"
          description="Đã tham gia đến 08:00 AM"
        />
        <StatCard
          icon={<ShoppingCart className="h-8 w-8 text-green-500" />}
          count={statsData?.pendingOrders ?? 0}
          label="Đơn hàng"
          description="Chờ xử lý"
        />
      </div>

      {/* Consultation Requests Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold">Yêu cầu tư vấn </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" /> Bộ lọc
              </Button>
            </div>
          </div>

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm học viên..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p>Đang tải yêu cầu tư vấn...</p>
            </div>
          ) : (
            <>
              <ConsultationTable
                data={filteredData}
              />

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Hiển thị {items.length} / {totalCount} yêu cầu</p>
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent className="flex-wrap gap-2">
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage((cur) => Math.max(1, cur - 1));
                          }}
                          aria-disabled={page === 1}
                          text="Trước"
                          className={`h-10 w-auto min-w-0 shrink-0 rounded-xl border border-border bg-card px-4 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
                        />
                      </PaginationItem>

                      {getPaginationItems(totalPages, page).map((item, idx) =>
                        item === "ellipsis" ? (
                          <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis className="text-slate-400" />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={item}>
                            <PaginationLink
                              href={`#page-${item}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(item as number);
                              }}
                              isActive={item === page}
                              className="h-10 w-10 rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm"
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage((cur) => Math.min(totalPages, cur + 1));
                          }}
                          aria-disabled={page === totalPages}
                          text="Sau"
                          className={`h-10 w-auto min-w-0 shrink-0 rounded-xl border border-border bg-card px-4 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary ${page === totalPages ? "pointer-events-none opacity-50" : ""}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
