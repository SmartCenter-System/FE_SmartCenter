import { useState } from "react";
import {
  Search,
  Download,
  CreditCard,
  User,
  Book,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal,
  Loader2,
  DollarSign,
  RotateCw,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { orderService } from "../../service";
import type { CleanOrder } from "../../type";
import { useAuthStore } from "@/features/auth/store";

export default function OrderManagementPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);

  // Use useQuery with dynamic keys for server-side filtering (preferred)
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", "admin-list", search, statusFilter, pageIndex, pageSize],
    queryFn: () =>
      orderService.getAll({
        Search: search || undefined,
        Status: statusFilter === "ALL" ? undefined : statusFilter,
        PageIndex: pageIndex,
        PageSize: pageSize,
      }),
    enabled: !!accessToken,
  });

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["orders", "admin-stats"],
    queryFn: () => orderService.getStats(),
    staleTime: 10 * 60 * 1000, // Thống kê có thể giữ lâu hơn một chút
    enabled: !!accessToken,
  });

  // We use the selected order data directly because the admin list API provides all necessary details.
  // /api/Order/{id} is restricted to the order owner, so we shouldn't call it here.
  const isLoadingDetail = false;
  const detailData = selectedOrder;

  // Safe data extraction
  const orders = Array.isArray(ordersData) ? ordersData : ordersData?.items || ordersData?.data || [];

  // Local filtering fallback using normalized CleanOrder properties
  const filteredOrders = orders.filter((o: CleanOrder) => {
    const courseNameStr = o.courseNames?.join(", ") || o.courseName || "";
    const statusStr = o.status;

    const matchesSearch =
      !search ||
      o.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      courseNameStr.toLowerCase().includes(search.toLowerCase()) ||
      o.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search);

    const matchesStatus = statusFilter === "ALL" || statusStr === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CleanOrder["status"] | string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-green-100 text-green-700 border-none font-bold">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Thành công
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-none font-bold">
            <Clock className="h-3 w-3 mr-1" /> Chờ xử lý
          </Badge>
        );
      case "CANCELLED":
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-700 border-none font-bold">
            <XCircle className="h-3 w-3 mr-1" /> Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">{status || "N/A"}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Đơn hàng</h1>
          <p className="text-muted-foreground mt-1">Theo dõi doanh thu và trạng thái thanh toán từ học viên.</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl border-2">
          <Download className="h-4 w-4" /> Xuất báo cáo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoadingStats ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="border-none shadow-sm p-6 space-y-3 rounded-3xl bg-background/50">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-24" />
                </div>
              </Card>
            ))
        ) : (
          <>
            <Card className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 group rounded-3xl bg-background border border-border/50">
              <div className="flex flex-col gap-4">
                <div className="p-3 w-fit rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">
                    Tổng đơn hàng
                  </p>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">{statsData?.total || 0}</h3>
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 group rounded-3xl bg-background border border-border/50">
              <div className="flex flex-col gap-4">
                <div className="p-3 w-fit rounded-2xl bg-green-50 text-green-600 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">
                    Tổng doanh thu
                  </p>
                  <h3 className="text-2xl font-black text-foreground tracking-tight whitespace-nowrap overflow-visible">
                    {(statsData?.revenue || 0).toLocaleString("vi-VN")}đ
                  </h3>
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 group rounded-3xl bg-background border border-border/50">
              <div className="flex flex-col gap-4">
                <div className="p-3 w-fit rounded-2xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">
                    Chờ xử lý
                  </p>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">{statsData?.pending || 0}</h3>
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 group rounded-3xl bg-background border border-border/50">
              <div className="flex flex-col gap-4">
                <div className="p-3 w-fit rounded-2xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Đã hủy</p>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">{statsData?.cancelled || 0}</h3>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã đơn, tên học viên hoặc khóa học..."
            className="pl-10 h-11 rounded-xl border-none bg-muted/30 focus-visible:ring-primary transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageIndex(1);
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPageIndex(1);
          }}
        >
          <SelectTrigger className="h-11 rounded-xl border-none bg-muted/30 w-full md:w-[200px]">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="PAID">Thành công</SelectItem>
            <SelectItem value="PENDING">Chờ xử lý</SelectItem>
            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="h-11 rounded-xl gap-2 border-none bg-muted/30 hover:bg-muted"
          onClick={() => {
            queryClient?.invalidateQueries({ queryKey: ["orders"] });
            queryClient?.invalidateQueries({ queryKey: ["dashboard"] });
          }}
        >
          <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Làm mới
        </Button>
      </div>

      {/* Orders Table */}
      <Card className="border-none shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-background">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-bold">Mã đơn hàng</TableHead>
              <TableHead className="font-bold">Học viên</TableHead>
              <TableHead className="font-bold">Khóa học</TableHead>
              <TableHead className="font-bold">Tổng tiền</TableHead>
              <TableHead className="font-bold">Trạng thái</TableHead>
              <TableHead className="text-right font-bold pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="animate-pulse border-muted/30">
                  <TableCell>
                    <div className="h-4 w-20 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-40 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-24 bg-muted rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-8 bg-muted rounded-full ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Book className="h-12 w-12 opacity-20" />
                    <p className="text-lg font-medium">Không tìm thấy đơn hàng nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order: CleanOrder) => (
                <TableRow
                  key={order.id}
                  className="group hover:bg-muted/30 transition-all border-muted/30"
                >
                  <TableCell className="font-mono text-xs text-primary font-medium">
                    #{order.orderCode || order.id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell className="font-medium">{order.studentName || "N/A"}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {order.courseNames?.join(", ") || order.courseName || "N/A"}
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Search className="h-4 w-4" /> Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <Download className="h-4 w-4" /> Tải hóa đơn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination UI */}
      {!isLoading && ordersData && (ordersData.totalCount || ordersData.total) > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-2">
          <p className="text-sm text-muted-foreground">
            Hiển thị <b>{Math.min(pageSize, orders.length)}</b> trong tổng số{" "}
            <b>{ordersData.totalCount || ordersData.total || orders.length}</b> đơn hàng
          </p>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                  className={pageIndex === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  text="Trước"
                />
              </PaginationItem>

              {/* Basic page numbers - Simplified for now */}
              {[...Array(Math.ceil((ordersData.totalCount || ordersData.total || 1) / pageSize))].map((_, i) => {
                const p = i + 1;
                const totalPages = Math.ceil((ordersData.totalCount || ordersData.total || 1) / pageSize);
                if (p === 1 || p === totalPages || (p >= pageIndex - 1 && p <= pageIndex + 1)) {
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink
                        onClick={() => setPageIndex(p)}
                        isActive={pageIndex === p}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (p === pageIndex - 2 || p === pageIndex + 2) {
                  return <PaginationEllipsis key={p} />;
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPageIndex((p) =>
                      Math.min(Math.ceil((ordersData.totalCount || ordersData.total || 1) / pageSize), p + 1),
                    )
                  }
                  className={
                    pageIndex >= Math.ceil((ordersData.totalCount || ordersData.total || 1) / pageSize)
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  text="Sau"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-primary/20 to-primary/5 px-8 py-8 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-3xl font-black text-primary tracking-tight">Chi tiết đơn hàng</DialogTitle>
                <p className="text-muted-foreground mt-1 font-mono text-sm">
                  #{detailData?.orderCode || detailData?.id?.toString().toUpperCase()}
                </p>
              </div>
              {detailData && getStatusBadge(detailData.paymentStatus || detailData.status)}
            </div>
          </DialogHeader>

          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
            {isLoadingDetail ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Đang tải chi tiết đơn hàng...</p>
              </div>
            ) : (
              <>
                {/* 2-Column Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-[0.2em] font-black">
                      <User className="h-4 w-4" /> Thông tin học viên
                    </div>
                    <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border/50">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Họ và tên</p>
                        <p className="font-bold text-lg">{detailData?.studentName || detailData?.fullName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Email</p>
                        <p className="text-sm">{detailData?.studentEmail || detailData?.email || "N/A"}</p>
                      </div>
                      {detailData?.phone && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Số điện thoại</p>
                          <p className="text-sm">{detailData.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-[0.2em] font-black">
                      <Calendar className="h-4 w-4" /> Thời gian & Thanh toán
                    </div>
                    <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border/50">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Ngày đặt hàng</p>
                        <p className="font-bold">
                          {detailData?.createdAt || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Phương thức</p>
                        <p className="text-sm flex items-center gap-2">
                          <CreditCard className="h-3 w-3" />
                          {detailData?.paymentMethod || "Chuyển khoản"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Mã giao dịch</p>
                        <p className="text-sm font-mono">{detailData?.paymentId || "Chưa có"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Table */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-[0.2em] font-black">
                    <Book className="h-4 w-4" /> Danh sách khóa học
                  </div>
                  <div className="border border-border/50 rounded-2xl overflow-hidden shadow-inner bg-muted/10">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="font-bold">Tên khóa học</TableHead>
                          <TableHead className="text-right font-bold pr-6">Giá tiền</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detailData?.courseNames && Array.isArray(detailData.courseNames) ? (
                          detailData.courseNames.map((name: string, i: number) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">{name}</TableCell>
                              <TableCell className="text-right pr-6 font-bold text-primary">-</TableCell>
                            </TableRow>
                          ))
                        ) : detailData?.items && Array.isArray(detailData.items) ? (
                          detailData.items.map((item: any, i: number) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">{item.courseName}</TableCell>
                              <TableCell className="text-right pr-6 font-bold text-primary">
                                {formatPrice(item.price)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell className="font-medium">{detailData?.courseName || "Khóa học lẻ"}</TableCell>
                            <TableCell className="text-right pr-6 font-bold text-primary">
                              {formatPrice(detailData?.totalAmount || detailData?.amount || 0)}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <div className="p-4 bg-primary/5 flex justify-between items-center border-t border-primary/10">
                      <span className="font-black text-sm uppercase tracking-wider text-primary">Tổng cộng</span>
                      <span className="text-2xl font-black text-primary">
                        {formatPrice(detailData?.totalAmount || detailData?.amount || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* History Timeline */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-[0.2em] font-black">
                    <Clock className="h-4 w-4" /> Lịch sử đơn hàng
                  </div>
                  <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted before:content-['']">
                    {/* Item 1: Created */}
                    <div className="relative">
                      <div className="absolute -left-[27px] top-1 h-5 w-5 rounded-full bg-blue-100 border-4 border-background z-10 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                        <p className="font-bold text-sm">Đã tạo đơn hàng</p>
                        <p className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {detailData?.createdAt || "N/A"}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Đơn hàng được khởi tạo bởi học viên.</p>
                    </div>

                    {/* Item 2: Status History */}
                    {detailData?.status === "PAID" ? (
                      <div className="relative">
                        <div className="absolute -left-[27px] top-1 h-5 w-5 rounded-full bg-green-100 border-4 border-background z-10 flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                          <p className="font-bold text-sm">Thanh toán thành công</p>
                          <p className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {detailData?.createdAt || "N/A"}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Giao dịch đã được xác nhận qua cổng thanh toán.
                        </p>
                      </div>
                    ) : detailData?.status === "CANCELLED" || detailData?.status === "FAILED" ? (
                      <div className="relative">
                        <div className="absolute -left-[27px] top-1 h-5 w-5 rounded-full bg-red-100 border-4 border-background z-10 flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                          <p className="font-bold text-sm">Đơn hàng đã bị hủy</p>
                          <p className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {detailData?.createdAt || "N/A"}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Đơn hàng đã bị hủy bởi hệ thống hoặc người dùng.
                        </p>
                      </div>
                    ) : (
                      <div className="relative opacity-60">
                        <div className="absolute -left-[27px] top-1 h-5 w-5 rounded-full bg-amber-100 border-4 border-background z-10 flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                          <p className="font-bold text-sm italic text-amber-700">Đang chờ xử lý...</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Đang đợi xác nhận thanh toán từ ngân hàng.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="p-8 bg-muted/20 border-t border-border/50 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="rounded-xl px-8 h-12 border-2">
              Đóng
            </Button>
            {detailData?.status === "PENDING" && (
              <Button className="rounded-xl px-8 h-12 shadow-lg shadow-primary/20">Xác nhận thanh toán thủ công</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
