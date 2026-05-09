import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/courses/services";
import { enrollmentService } from "@/features/courses/enrollmentService";
import type { Course } from "@/features/courses/type";
import { BookOpen, Clock, TrendingUp, ChevronRight, PlayCircle, Sparkles, Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";

function EnrolledCourseCard({
  course,
  progress,
}: {
  course: { id?: string; title: string; thumbnail?: string | null; format: string };
  progress: number;
}) {

  const cardBody = (
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

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-lg">
            <PlayCircle className="h-3.5 w-3.5" />
            Tiếp tục học
          </div>
        </div>

        <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] uppercase tracking-wide">
          {course.format === "ONLINE" ? "Online" : "Offline"}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

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

  if (course.id) {
    return (
      <Link to={`/courses/${encodeURIComponent(course.id)}`} className="block">
        {cardBody}
      </Link>
    );
  }

  return cardBody;
}

export default function StudentDashboardPage() {
  const { data: suggestedCourses, isLoading: isSuggestedLoading } = useQuery({
    queryKey: ["courses", { limit: 4 }],
    queryFn: () => courseService.getAll({ limit: 4 }),
    staleTime: 0,
  });

  // Fetch danh sách khóa học đã đăng ký của học sinh
  const { data: enrolledCoursesData, isLoading: isEnrolledLoading } = useQuery({
    queryKey: ["myEnrollments"],
    queryFn: () => enrollmentService.getMyEnrollmentCourses(),
    staleTime: 1000 * 60 * 5,
  });

  console.log("Enrolled Courses Data:", enrolledCoursesData);

  const enrollmentItems = Array.isArray(enrolledCoursesData)
    ? enrolledCoursesData
    : Array.isArray((enrolledCoursesData as { items?: unknown[] } | undefined)?.items)
      ? ((enrolledCoursesData as unknown as { items: any[] }).items ?? [])
      : [];

  const enrolledCourses = enrollmentItems.map((item: any, index: number) => ({
    id: String(item.courseId ?? "").trim() || undefined,
    title: item.courseName || `Khóa học #${index + 1}`,
    thumbnail: item.imgUrl ?? null,
    format: item.courseType === 1 ? "ONLINE" : "OFFLINE",
    progress: item.progress ?? 0,
  }));

  const enrolledCount = enrolledCourses.length;

  const { data: dashboardData = { totalWatchTimeMinutes: 0, completedLessons: 0, inProgressLessons: 0 } } = useDashboardData();

  const totalHours = Math.floor(dashboardData.totalWatchTimeMinutes / 60);
  const totalMinutes = dashboardData.totalWatchTimeMinutes % 60;
  const totalLessons = dashboardData.completedLessons + dashboardData.inProgressLessons;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto space-y-10 px-4 py-8 md:px-8 max-w-6xl">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-8 text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium text-white/80">Chào mừng trở lại!</span>
            </div>
            {isEnrolledLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-9 w-64 bg-white/20" />
                <Skeleton className="h-4 w-48 bg-white/20" />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-1">Tiếp tục hành trình học tập 🚀</h1>
                <p className="text-white/70 max-w-lg text-sm mt-2">
                  Bạn đang học <strong className="text-white">{enrolledCount} khóa học</strong>. Hãy tiếp tục cố gắng và hoàn thành mục tiêu học tập của bạn!
                </p>
              </>
            )}
            <div className="mt-5 flex gap-3 flex-wrap">
              <Link to="/courses">
                <Button size="sm" variant="ghost" className="text-white border-white/30 border hover:bg-white/10">
                  Xem tất cả khóa học
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 right-24 h-48 w-48 rounded-full bg-white/10" />
        </section>

        <section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Khóa học đang học</div>
                  <div className="text-lg font-bold">{enrolledCount}</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-amber-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Thời gian học</div>
                  <div className="text-lg font-bold">{`${totalHours}h ${totalMinutes}m`}</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Bài học đã hoàn thành</div>
                  <div className="text-lg font-bold">{`${dashboardData.completedLessons}/${totalLessons}`}</div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Khóa học đang học</h2>
            <Link to="/courses" className="text-sm text-primary hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {enrolledCount === 0 ? (
            <div className="w-full py-12 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground mb-4 text-center">Bạn chưa mua khóa học nào. Hãy khám phá các khóa học để mua và bắt đầu học.</p>
              <Link to="/courses">
                <Button size="lg" className="gap-2 px-6 py-3 text-base md:text-lg">
                  Khám phá khóa học
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((c) => (
                <EnrolledCourseCard key={c.id ?? c.title} course={c} progress={c.progress} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Gợi ý dành cho bạn
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">Các khóa học phổ biến bạn chưa đăng ký</p>
            </div>
            <Link to="/courses" className="text-sm text-primary hover:underline flex items-center gap-1">
              Khám phá thêm <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {isSuggestedLoading ? (
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
                <Card key={course.courseId} className="border-none shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group overflow-hidden">
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
                    <Link to={`/courses/${encodeURIComponent(course.courseId)}`} className="block">
                      <Button size="sm" variant="outline" className="w-full">Xem chi tiết</Button>
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
