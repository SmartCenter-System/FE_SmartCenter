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
      value: apiData ? (apiData.totalStudents || 0).toLocaleString() : "2,543",
      icon: Users,
      change: "+12.5%",
      color: "text-blue-600 bg-blue-100",
      trend: "up",
    },
    {
      label: "Doanh thu tháng",
      value: apiData ? `${((apiData.monthlyRevenue || 0) / 1000000).toFixed(1)}M` : "450.2M",
      icon: DollarSign,
      change: "+8.2%",
      color: "text-green-600 bg-green-100",
      trend: "up",
    },
    {
      label: "Khóa học đang mở",
      value: apiData ? (apiData.activeCourses || 0).toString() : "48",
      icon: BookOpen,
      change: "+2",
      color: "text-purple-600 bg-purple-100",
      trend: "up",
    },
    {
      label: "Yêu cầu tư vấn",
      value: apiData ? (apiData.pendingConsultations || 0).toString() : "14",
      icon: Clock,
      change: "-3",
      color: "text-orange-600 bg-orange-100",
      trend: "down",
    },
  ];

  const recentOrders = apiData?.recentOrders?.map((order: any) => ({
    id: order.id,
    student: order.studentName,
    course: order.courseName,
    amount: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.amount),
    status: order.status.toUpperCase(),
  })) || [
    { id: "ORD-001", student: "Nguyễn Văn A", course: "Toán 12 - Ôn thi", amount: "1.200.000đ", status: "SUCCESS" },
    { id: "ORD-002", student: "Trần Thị B", course: "IELTS 6.5+", amount: "4.500.000đ", status: "PENDING" },
    { id: "ORD-003", student: "Lê Văn C", course: "Vật lý 12", amount: "1.100.000đ", status: "SUCCESS" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
          className="gap-2"
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
          : stats.map((stat, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs font-bold border-none ${stat.trend === "up" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="mt-5">
                    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <h3 className="text-3xl font-black">{stat.value}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
            <CardDescription>Danh sách các đơn hàng mới nhất trong hệ thống.</CardDescription>
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
                : recentOrders.map((order, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary">
                          {order.student.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{order.student}</p>
                          <p className="text-xs text-muted-foreground">{order.course}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{order.amount}</p>
                        <Badge
                          variant={order.status === "SUCCESS" ? "default" : "secondary"}
                          className="text-[10px] h-5"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              <Button variant="ghost" className="w-full text-primary hover:text-primary/80 group">
                Xem tất cả giao dịch{" "}
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Health / Quick Actions */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Trạng thái hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>API Server</span>
                <Badge
                  className={`border-none ${apiData?.systemHealth?.api === "stable" ? "bg-green-400 text-green-900" : "bg-red-400 text-red-900"}`}
                >
                  {apiData?.systemHealth?.api === "stable" ? "Ổn định" : "Gặp sự cố"}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Database</span>
                <Badge
                  className={`border-none ${apiData?.systemHealth?.database === "stable" ? "bg-green-400 text-green-900" : "bg-red-400 text-red-900"}`}
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

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start gap-2 h-11 mb-2">
                  <UserCheck className="h-4 w-4 text-blue-600" /> Quản lý người dùng
                </Button>
              </Link>
              <Link to="/admin/courses">
                <Button variant="outline" className="w-full justify-start gap-2 h-11">
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
