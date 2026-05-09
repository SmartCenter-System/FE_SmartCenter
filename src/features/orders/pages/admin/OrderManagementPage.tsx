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
  Filter
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/shared/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { orderService } from "../../service";

export default function OrderManagementPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Use useQuery with dynamic keys for server-side filtering (preferred)
  // If backend doesn't support Search/Status yet, we still handle local fallback
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["adminOrders", search, statusFilter],
    queryFn: () => orderService.getAll({
      Search: search || undefined,
      Status: statusFilter === "ALL" ? undefined : statusFilter,
    }),
  });

  // Safe data extraction
  const orders = Array.isArray(ordersData) 
    ? ordersData 
    : (ordersData?.items || ordersData?.data || []);

  // Local filtering fallback for extra safety or client-side polish
  const filteredOrders = orders.filter((o: any) => {
    // If server already filtered, this will still work fine
    const matchesSearch = !search || 
      o.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      o.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toString().includes(search);
    
    const matchesStatus = statusFilter === "ALL" || 
      o.status?.toString() === statusFilter ||
      (statusFilter === "1" && (o.status === "SUCCESS" || o.status === "PAID")) ||
      (statusFilter === "0" && o.status === "PENDING") ||
      (statusFilter === "2" && (o.status === "CANCELLED" || o.status === "FAILED"));

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: any) => {
    const s = status?.toString()?.toUpperCase();
    switch (s) {
      case "SUCCESS":
      case "PAID":
      case "1":
        return <Badge className="bg-green-100 text-green-700 border-none"><CheckCircle2 className="h-3 w-3 mr-1" /> Thành công</Badge>;
      case "PENDING":
      case "0":
        return <Badge className="bg-amber-100 text-amber-700 border-none"><Clock className="h-3 w-3 mr-1" /> Chờ xử lý</Badge>;
      case "CANCELLED":
      case "FAILED":
      case "2":
        return <Badge className="bg-red-100 text-red-700 border-none"><XCircle className="h-3 w-3 mr-1" /> Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status || "Không xác định"}</Badge>;
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

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-background p-4 rounded-2xl border-2 border-muted/50 shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm theo mã đơn, tên học viên hoặc khóa học..." 
            className="pl-10 h-11 rounded-xl border-none bg-muted/30 focus-visible:ring-primary transition-all" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 rounded-xl border-none bg-muted/30">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="1">Thành công</SelectItem>
            <SelectItem value="0">Chờ xử lý</SelectItem>
            <SelectItem value="2">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" className="h-11 rounded-xl gap-2 hover:bg-muted">
          <Filter className="h-4 w-4" /> Bộ lọc nâng cao
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
                  <TableCell><div className="h-4 w-20 bg-muted rounded" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-muted rounded" /></TableCell>
                  <TableCell><div className="h-4 w-40 bg-muted rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted rounded" /></TableCell>
                  <TableCell><div className="h-6 w-24 bg-muted rounded-full" /></TableCell>
                  <TableCell><div className="h-8 w-8 bg-muted rounded-full ml-auto" /></TableCell>
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
              filteredOrders.map((order: any) => (
                <TableRow key={order.id} className="group hover:bg-muted/30 transition-all border-muted/30">
                  <TableCell className="font-mono text-xs text-primary font-medium">
                    #{order.id?.toString().slice(-8).toUpperCase() || "N/A"}
                  </TableCell>
                  <TableCell className="font-medium">{order.studentName || "N/A"}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{order.courseName || "N/A"}</TableCell>
                  <TableCell className="font-bold text-primary">
                    {formatPrice(order.totalAmount || order.amount || 0)}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
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

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary/10 px-8 py-8">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-primary">Chi tiết đơn hàng</DialogTitle>
              {selectedOrder && getStatusBadge(selectedOrder.status)}
            </div>
            <p className="text-primary/70 mt-1">Mã đơn: #{selectedOrder?.id}</p>
          </DialogHeader>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider font-bold">
                  <User className="h-4 w-4" /> Thông tin học viên
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-lg">{selectedOrder?.studentName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder?.studentEmail || "N/A"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider font-bold">
                  <Calendar className="h-4 w-4" /> Thời gian
                </div>
                <div className="space-y-1">
                  <p className="font-bold">{selectedOrder?.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('vi-VN') : "N/A"}</p>
                  <p className="text-sm text-muted-foreground">Ngày đặt hàng</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-muted/30 p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider font-bold">
                <Book className="h-4 w-4" /> Sản phẩm
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold">{selectedOrder?.courseName}</p>
                <p className="font-bold text-primary">{formatPrice(selectedOrder?.totalAmount || selectedOrder?.amount || 0)}</p>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-muted">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Phương thức thanh toán: <span className="font-bold">Chuyển khoản / VNPay</span></span>
              </div>
              <Button onClick={() => setIsDetailOpen(false)} className="rounded-xl px-8">Đóng</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
