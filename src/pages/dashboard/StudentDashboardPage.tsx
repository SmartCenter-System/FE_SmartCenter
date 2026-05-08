import { Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/courses/services";
import type { Course } from "@/features/courses/type";
import {
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  PlayCircle,
  Search,
  Sparkles,
  LayoutDashboard,
  Star,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`rounded-xl p-3 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Course Card ──────────────────────────────────────────────────────────────
function EnrolledCourseCard({
  course,
  progress,
}: {
  course: { id: string; title: string; thumbnail?: string | null; level: string; format: string };
  progress: number;
}) {
  const levelLabel: Record<string, string> = {
    BEGINNER: "Cơ bản",
    INTERMEDIATE: "Trung cấp",
    ADVANCED: "Nâng cao",
    ALL_LEVELS: "Mọi trình độ",
  };

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group overflow-hidden">
      <div className="relative h-40 bg-muted overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <BookOpen className="h-10 w-10 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link to={`/courses/${course.id}`}>
            <Button size="sm" className="gap-1.5 shadow-lg">
              <PlayCircle className="h-4 w-4" />
              Tiếp tục học
            </Button>
          </Link>
        </div>
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 text-[10px] uppercase tracking-wide"
        >
          {course.format === "ONLINE" ? "Online" : "Offline"}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-muted-foreground">{levelLabel[course.level] ?? course.level}</p>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Tiến độ</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentDashboardPage() {
  // Lấy thông tin user từ Zustand store (role được lưu, nhưng chưa có user info đầy đủ)
  // TODO: Sau khi có API /me, replace bằng useCurrentUser hook
  const { role } = useAuthStore();

  // Fetch danh sách khóa học công khai để demo "đề xuất" (sẽ thay bằng API enrollments)
  const { data: suggestedCourses, isLoading } = useQuery({
    queryKey: ["courses", { limit: 4 }],
    queryFn: () => courseService.getAll({ limit: 4 }),
    staleTime: 0, // Ghi đè cấu hình global để Dashboard luôn lấy data mới nhất
  });

  // Mock data cho enrolled courses — sẽ replace bằng API /me/enrollments
  const mockEnrolled = [
    { id: "1", title: "Toán 12 — Chinh phục kỳ thi THPT Quốc Gia", progress: 65, level: "INTERMEDIATE", format: "ONLINE", thumbnail: null },
    { id: "2", title: "Vật Lý THPT: Từ cơ bản đến nâng cao", progress: 30, level: "BEGINNER", format: "ONLINE", thumbnail: null },
    { id: "3", title: "Ngữ Văn — Phân tích tác phẩm toàn diện", progress: 90, level: "ALL_LEVELS", format: "OFFLINE", thumbnail: null },
  ];

  // Thống kê (mock — sẽ đến từ API)
  const stats = [
    {
      icon: BookOpen,
      label: "Khóa học đang học",
      value: mockEnrolled.length,
      sub: "1 khóa gần hoàn thành",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Clock,
      label: "Thời gian học tuần này",
      value: "4h 20m",
      sub: "+30m so với tuần trước",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      icon: TrendingUp,
      label: "Streak học tập",
      value: "7 ngày",
      sub: "Kỷ lục của bạn: 14 ngày",
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      icon: Award,
      label: "Chứng chỉ đã nhận",
      value: 1,
      sub: "Hoàn thành thêm để nhận thêm",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Top Nav ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span className="font-semibold">Dashboard học sinh</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/courses">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Search className="h-4 w-4" />
                Khám phá khóa học
              </Button>
            </Link>
            <Badge variant="outline" className="capitalize">
              {role?.toLowerCase() ?? "student"}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-10 px-4 py-8 md:px-8 max-w-6xl">

        {/* ─── Welcome Banner ──────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-8 text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium text-white/80">Chào mừng trở lại!</span>
            </div>
            <h1 className="text-3xl font-bold mb-1">Tiếp tục hành trình học tập 🚀</h1>
            <p className="text-white/70 max-w-lg text-sm mt-2">
              Bạn đang học <strong className="text-white">{mockEnrolled.length} khóa học</strong>. Khóa học Ngữ Văn của bạn sắp hoàn thành — chỉ còn 10% nữa thôi!
            </p>
            <div className="mt-5 flex gap-3 flex-wrap">
              <Link to={`/courses/${mockEnrolled[2].id}`}>
                <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-semibold shadow">
                  <PlayCircle className="mr-1.5 h-4 w-4" />
                  Tiếp tục học Ngữ Văn
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="sm" variant="ghost" className="text-white border-white/30 border hover:bg-white/10">
                  Xem tất cả khóa học
                </Button>
              </Link>
            </div>
          </div>
          {/* Decorative background blob */}
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 right-24 h-48 w-48 rounded-full bg-white/5" />
        </section>

        {/* ─── Stats ───────────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </section>

        {/* ─── Enrolled Courses ─────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Khóa học đang học</h2>
            <Link to="/courses" className="text-sm text-primary hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mockEnrolled.map((c) => (
              <EnrolledCourseCard key={c.id} course={c} progress={c.progress} />
            ))}
          </div>
        </section>

        {/* ─── Suggested Courses ────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Gợi ý dành cho bạn
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Các khóa học phổ biến bạn chưa đăng ký
              </p>
            </div>
            <Link to="/courses" className="text-sm text-primary hover:underline flex items-center gap-1">
              Khám phá thêm <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="border-none shadow-sm overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-5 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {suggestedCourses?.data.map((course: Course) => (
                <Card
                  key={course.courseId}
                  className="border-none shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group overflow-hidden"
                >
                  <div className="relative h-36 bg-muted overflow-hidden">
                    {course.imgUrl ? (
                      <img
                        src={course.imgUrl}
                        alt={course.courseName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/60">
                        <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {course.courseName}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(course.basePrice)}
                      </span>
                    </div>
                    <Link to={`/courses/${course.courseId}`} className="block">
                      <Button size="sm" variant="outline" className="w-full">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
