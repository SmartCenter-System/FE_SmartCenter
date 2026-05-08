import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { courseService } from "@/features/courses/services";
import type { PublicCourseItem } from "@/features/courses/type";

const placeholderImage = "https://placehold.co/600x400/17218F/FFFFFF?text=Khóa+học";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

function getModeLabel(mode: number) {
  return mode === 2 ? "Trực tiếp" : "Online";
}

export function FeaturedCoursesSection() {
  const { data: courses = [], isLoading, isError } = useQuery<PublicCourseItem[], Error>({
    queryKey: ["courses", "top-popular"],
    queryFn: () => courseService.getTopPopularCourses(),
  });

  const placeholders = Array.from({ length: 6 });

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground mb-4 sm:mb-0">
            Khoá học
          </h2>
          <Button
            variant="outline"
            className="h-11 rounded-md border-border bg-white px-5 text-sm font-medium text-blue-700 transition-colors hover:bg-yellow-400 hover:text-black"
            asChild
          >
            <Link to="/courses">Xem tất cả</Link>
          </Button>
        </div>

        {isError ? (
          <div className="rounded-3xl border border-border/50 bg-card p-8 text-center text-sm text-destructive">
            Không thể tải danh sách khoá học. Vui lòng thử lại sau.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {isLoading
              ? placeholders.map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="group flex flex-col animate-pulse bg-card border border-border/50 rounded-2xl overflow-hidden p-6"
                  >
                    <div className="rounded-xl mb-6 aspect-video bg-slate-900" />
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                      <div className="h-8 w-24 rounded-full bg-slate-700" />
                      <div className="h-6 w-20 rounded-full bg-slate-700" />
                    </div>
                    <div className="h-8 rounded-md bg-slate-700 mb-3" />
                    <div className="h-5 rounded-md bg-slate-700 mb-6" />
                    <div className="h-12 rounded-full bg-slate-700" />
                  </div>
                ))
              : courses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="group flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="rounded-xl overflow-hidden mb-6 aspect-video bg-slate-900">
                      <img
                        src={placeholderImage}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                      <Badge variant="outline" className="bg-background text-muted-foreground border-border font-normal px-3 py-1">
                        {getModeLabel(course.mode)}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">
                        {course.availableSlots} chỗ
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-6 min-h-[3rem]">
                      {formatCurrency(course.price)}
                    </p>

                    <div className="w-full rounded-md bg-blue-700 text-white py-3 text-sm sm:text-base font-medium text-center transition-colors hover:bg-yellow-400 hover:text-black">
                      Xem chi tiết & Đăng kí
                    </div>
                  </Link>
                ))}
          </div>
        )}
      </div>
    </section>
  );
}
