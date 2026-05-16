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
import PaginationBar from "@/shared/components/common/PaginationBar";

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

  function mapStatus(s?: string): ConsultationRequest["status"] {
    if (!s) return "Chờ xử lý";
    const us = String(s).toUpperCase();
    if (us === "PENDING") return "Chờ xử lý";
    if (us === "PROCESSING" || us === "CONSULTING" || us === "ACCEPTED") return "Đang tư vấn";
    if (us === "PROCESSED") return "Đã tư vấn";
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
    status: mapStatus(item.status),
  }));


  const filteredData = consultations.filter(
    (item) =>
      item.studentName.toLowerCase().includes(search.toLowerCase()) ||
      item.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
      item.courseInterest.toLowerCase().includes(search.toLowerCase())
  );

  const displayTotal = totalCount || items.length;
  const totalPages = Math.max(1, Math.ceil(displayTotal / pageSize));
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

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
            YÊU CẦU TƯ VẤN
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
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

              <div className="mt-4 flex justify-center">
                <PaginationBar
                  className="justify-center"
                  items={getPaginationItems(totalPages, page)}
                  activePage={page}
                  previousDisabled={!canGoPrevious}
                  nextDisabled={!canGoNext}
                  onPageChange={setPage}
                  onPrevious={() => setPage((cur) => Math.max(1, cur - 1))}
                  onNext={() => setPage((cur) => Math.min(totalPages, cur + 1))}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
