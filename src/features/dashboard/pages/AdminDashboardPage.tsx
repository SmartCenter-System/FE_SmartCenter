import {
  Users,
  BookOpen,
  DollarSign,
  ArrowUpRight,
  UserCheck,
  Clock,
  ChevronRight,
  RotateCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useAdminDashboardData } from "../hooks/useRoleDashboardData";

export default function AdminDashboardPage() {
  const { data: apiData, isLoading, refetch, isRefetching } = useAdminDashboardData();

  const stats = [
    {
      label: "Tổng học viên",
      value: apiData ? (apiData.totalStudents || 0).toLocaleString() : "0",
      icon: Users,
      change: "Học viên",
      color: "text-blue-600 bg-blue-100",
      trend: "up",
    },
    {
      label: "Doanh thu tháng",
      value: apiData ? (apiData.monthlyRevenue || 0).toLocaleString("vi-VN") + "đ" : "0đ",
      icon: DollarSign,
      change: "Doanh thu",
      color: "text-green-600 bg-green-100",
      trend: "up",
    },
    {
      label: "Khóa học đang mở",
      value: apiData ? (apiData.activeCourses || 0).toString() : "0",
      icon: BookOpen,
      change: "Khóa học",
      color: "text-purple-600 bg-purple-100",
      trend: "up",
    },
    {
      label: "Yêu cầu tư vấn",
      value: apiData ? (apiData.pendingConsultations || 0).toString() : "0",
      icon: Clock,
      change: "Đang chờ",
      color: "text-orange-600 bg-orange-100",
      trend: "down",
    },
  ];

  const recentOrders = apiData?.recentOrders?.map((order) => ({
    id: order.id,
    student: order.studentName,
    course: order.courseName,
    amount: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.amount),
    status: order.status,
    createdAt: order.createdAt,
  })) || [];

  const chartData = apiData?.revenueChartData || [];
  const maxChartVal = chartData.reduce((max, item) => Math.max(max, item.value), 0) || 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-muted-foreground mt-1">
            Chào mừng bạn trở lại, Admin. Đây là tình hình hoạt động hôm nay.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="gap-2 rounded-xl"
        >
          <RotateCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="border-none shadow-sm rounded-[32px]">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))
          : stats.map((stat, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group rounded-[32px] bg-background border border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-black uppercase tracking-wider border-none ${stat.trend === "up" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
                      >
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {stat.change}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-black tracking-tight whitespace-nowrap overflow-visible">
                        {stat.value}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Revenue Chart Section */}
      <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-gradient-to-b from-background to-muted/20 border border-border/50">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xl font-bold">Biểu đồ tăng trưởng doanh thu</CardTitle>
              <CardDescription>Phân bổ dòng tiền theo thời gian thực (Dynamic 6-Month Adapter)</CardDescription>
            </div>
            <Badge variant="secondary" className="w-fit text-xs font-bold px-3 py-1 bg-primary/10 text-primary border-none">
              Dữ liệu chuẩn hóa 100%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Skeleton className="w-full h-full rounded-2xl" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="h-64 flex items-end justify-between gap-2 pt-8 px-2 sm:px-6 border-b border-border/50 pb-2 relative">
                {/* Horizontal reference grid lines */}
                <div className="absolute left-0 right-0 top-0 border-b border-dashed border-border/40 text-[10px] text-muted-foreground pb-1">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(maxChartVal)}
                </div>
                <div className="absolute left-0 right-0 top-1/2 border-b border-dashed border-border/40 text-[10px] text-muted-foreground pb-1">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Math.floor(maxChartVal / 2))}
                </div>

                {chartData.map((item, index) => {
                  const heightPercent = Math.max(8, Math.round((item.value / maxChartVal) * 100));
                  const formattedVal = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.value);

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative z-10">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-foreground text-background text-xs font-bold py-1 px-2.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20">
                        {formattedVal}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                      </div>

                      {/* Animated Gradient Bar */}
                      <div className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-primary/40 via-primary/80 to-primary transition-all duration-500 group-hover:brightness-110 group-hover:scale-y-[1.02] origin-bottom shadow-sm relative overflow-hidden"
                           style={{ height: `${heightPercent}%` }}>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between px-2 sm:px-6 pt-2">
                {chartData.map((item, index) => (
                  <div key={index} className="flex-1 text-center">
                    <span className="text-xs font-bold text-muted-foreground whitespace-nowrap block truncate">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[32px] border border-border/50">
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
            <CardDescription>Danh sách các đơn hàng mới nhất đã đi qua bộ lọc Adapter.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-12 ml-auto" />
                        </div>
                      </div>
                    ))
                : recentOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground italic text-sm">
                       Chưa có giao dịch nào được ghi nhận.
                    </div>
                  ) : recentOrders.map((order, i) => (
                    <div
                      key={order.id || i}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {order.student.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{order.student}</p>
                          <p className="text-xs text-muted-foreground">{order.course} • <span className="font-mono">{order.createdAt}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-primary">{order.amount}</p>
                        <Badge
                          variant={order.status === "PAID" ? "default" : "secondary"}
                          className={`text-[10px] h-5 border-none font-bold ${order.status === "PAID" ? "bg-green-500 text-white" : order.status === "CANCELLED" ? "bg-red-500 text-white" : ""}`}
                        >
                          {order.status === "PAID" ? "THÀNH CÔNG" : order.status === "CANCELLED" ? "ĐÃ HỦY" : order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              <Button variant="ghost" className="w-full text-primary hover:text-primary/80 group rounded-xl">
                Xem tất cả giao dịch{" "}
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Health / Quick Actions */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground rounded-[32px]">
            <CardHeader>
              <CardTitle className="text-lg">Trạng thái hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>API Server</span>
                <Badge
                  className={`border-none font-bold ${apiData?.systemHealth?.api === "stable" ? "bg-green-400 text-green-950" : "bg-red-400 text-red-950"}`}
                >
                  {apiData?.systemHealth?.api === "stable" ? "Ổn định" : "Gặp sự cố"}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Database</span>
                <Badge
                  className={`border-none font-bold ${apiData?.systemHealth?.database === "stable" ? "bg-green-400 text-green-950" : "bg-red-400 text-red-950"}`}
                >
                  {apiData?.systemHealth?.database === "stable" ? "Ổn định" : "Gặp sự cố"}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Dung lượng lưu trữ</span>
                <span className="font-bold">{apiData?.systemHealth?.storageUsage || 0}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-1000"
                  style={{ width: `${apiData?.systemHealth?.storageUsage || 0}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[32px] border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start gap-2 h-11 mb-2 rounded-xl">
                  <UserCheck className="h-4 w-4 text-blue-600" /> Quản lý người dùng
                </Button>
              </Link>
              <Link to="/admin/courses">
                <Button variant="outline" className="w-full justify-start gap-2 h-11 rounded-xl">
                  <BookOpen className="h-4 w-4 text-purple-600" /> Quản lý khóa học
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
