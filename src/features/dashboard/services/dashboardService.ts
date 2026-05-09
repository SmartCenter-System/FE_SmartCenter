import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

// Định nghĩa interface cho DashboardData (Student)
export interface DashboardData {
  totalWatchTimeMinutes: number;
  completedLessons: number;
  inProgressLessons: number;
}

// Định nghĩa interface cho AdminDashboardData
export interface AdminDashboardData {
  totalStudents: number;
  monthlyRevenue: number;
  activeCourses: number;
  pendingConsultations: number;
  recentOrders: Array<{
    id: string;
    studentName: string;
    courseName: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  systemHealth: {
    api: "stable" | "unstable" | "down";
    database: "stable" | "unstable" | "down";
    storageUsage: number;
  };
}

// Tạo service cho dashboard
export const dashboardService = {
  // Stats cho Student
  getStats: async (): Promise<DashboardData> => {
    const res = await apiClient.get<DashboardData>(API_ENDPOINTS.COURSES.DASHBOARD);
    return res.data;
  },

  // Stats cho Admin - Aggregated from multiple services for real-time accuracy
  getAdminStats: async (): Promise<AdminDashboardData> => {
    try {
      // 1. Try dedicated endpoint first
      const directStats = await apiClient.get<AdminDashboardData>("/api/admin/dashboard/stats");
      if (directStats?.data) return directStats.data;
    } catch (e) {
      // Fallback: Aggregate from services
    }

    // 2. Fallback: Aggregate from services
    const [usersRes, coursesRes, consultationsRes, ordersRes] = await Promise.all([
      apiClient.get("/api/admin/users", { params: { Role: 2, PageSize: 1 } }).catch(() => ({ data: { totalCount: 0 } })),
      apiClient.get("/api/Courses", { params: { PageSize: 1 } }).catch(() => ({ data: { totalCount: 0 } })),
      apiClient.get("/api/ConsultationRequest").catch(() => ({ data: [] })),
      apiClient.get("/api/Order", { params: { PageSize: 50 } }).catch(() => ({ data: { items: [] } }))
    ]) as any[];

    const orders = ordersRes?.data?.items || ordersRes?.data?.data || (Array.isArray(ordersRes?.data) ? ordersRes.data : []);
    
    // Tính doanh thu THÁNG HIỆN TẠI
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyRevenue = orders
      .filter((o: any) => {
        const orderDate = new Date(o.createdAt || o.orderDate);
        const isSuccess = o.status?.toUpperCase() === "SUCCESS" || o.status === 1 || o.status === "PAID";
        const isCurrentMonth = orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        return isSuccess && isCurrentMonth;
      })
      .reduce((sum: number, o: any) => sum + (o.totalAmount || o.amount || 0), 0);

    return {
      totalStudents: usersRes?.totalCount || usersRes?.total || 0,
      activeCourses: coursesRes?.totalCount || coursesRes?.total || 0,
      pendingConsultations: Array.isArray(consultationsRes) ? consultationsRes.filter((c: any) => c.status === "PENDING").length : 0,
      monthlyRevenue,
      recentOrders: orders.slice(0, 5).map((o: any) => ({
        id: o.id || o.orderId,
        studentName: o.studentName || o.customerName || "Khách hàng",
        courseName: o.courseName || (o.items?.[0]?.courseName) || "Khóa học",
        amount: o.totalAmount || o.amount || 0,
        status: o.status?.toString() || "PENDING",
        createdAt: o.createdAt
      })),
      systemHealth: {
        api: "stable",
        database: "stable",
        storageUsage: 42 // Mock value for now
      }
    };
  }
};