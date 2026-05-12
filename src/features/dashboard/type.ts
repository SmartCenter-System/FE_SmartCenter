export interface ChartDataItem {
  name: string;
  value: number;
}

export interface AdminDashboardRaw {
  totalStudents?: number | string;
  monthlyRevenue?: number | string;
  activeCourses?: number | string;
  pendingConsultations?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentOrders?: any[];
  systemHealth?: {
    api?: "stable" | "unstable" | "down";
    database?: "stable" | "unstable" | "down";
    storageUsage?: number | string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenueByMonth?: any[];
}

export interface CleanRecentOrder {
  id: string;
  studentName: string;
  courseName: string;
  amount: number;
  status: "PAID" | "PENDING" | "CANCELLED";
  createdAt: string;
}

export interface CleanAdminDashboard {
  totalStudents: number;
  monthlyRevenue: number;
  activeCourses: number;
  pendingConsultations: number;
  recentOrders: CleanRecentOrder[];
  revenueChartData: ChartDataItem[];
  systemHealth: {
    api: "stable" | "unstable" | "down";
    database: "stable" | "unstable" | "down";
    storageUsage: number;
  };
}

export interface LecturerDashboardRaw {
  totalStudents?: number | string;
  activeCourses?: number | string;
  averageRating?: number | string;
  newMessages?: number | string;
}

export interface CleanLecturerDashboard {
  totalStudents: number;
  activeCourses: number;
  averageRating: number;
  newMessages: number;
}

export interface StaffDashboardRaw {
  totalLeads?: number | string;
  pendingLeads?: number | string;
  totalOrders?: number | string;
  totalRevenue?: number | string;
}

export interface CleanStaffDashboard {
  totalLeads: number;
  pendingLeads: number;
  totalOrders: number;
  totalRevenue: number;
}
