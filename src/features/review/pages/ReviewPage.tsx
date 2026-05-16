import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, BookOpen, Star } from "lucide-react";

import PaginationBar from "@/shared/components/common/PaginationBar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { PublicCourseItem } from "@/features/courses/type";
import { usePublicCourses } from "@/features/courses/hooks/usePublicCourses";
import { useCourseReviewQueries } from "../hooks/useReviews";
import type { ReviewItem } from "../type";

const placeholderImage = "https://placehold.co/800x500/17218F/FFFFFF?text=Smart+Center";
const PAGE_SIZE = 6;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

function getModeLabel(mode: number) {
  return mode === 2 ? "Trực tiếp" : "Online";
}

function getReviewStats(reviews: ReviewItem[] = []) {
  const total = reviews.length;
  const average = total ? reviews.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / total : 0;

  return { total, average };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object") {
    const record = error as { message?: unknown; userMessage?: unknown };
    if (typeof record.userMessage === "string") return record.userMessage;
    if (typeof record.message === "string") return record.message;
  }

  return fallback;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const iconSize = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`${iconSize} ${index < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
        />
      ))}
    </div>
  );
}

function CourseReviewSkeleton() {
  return (
    <Card className="overflow-hidden border-border/60 bg-card">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <CardHeader className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

function CourseReviewCard({
  course,
  reviews,
}: {
  course: PublicCourseItem;
  reviews?: ReviewItem[];
}) {
  const stats = getReviewStats(reviews);
  const image = course.imgUrl || placeholderImage;

  return (
    <Card className="group overflow-hidden border-border/70 bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={image}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur">
            {getModeLabel(course.mode)}
          </Badge>
          {course.cateName ? (
            <Badge variant="outline" className="border-white/40 bg-black/30 text-white backdrop-blur">
              {course.cateName}
            </Badge>
          ) : null}
        </div>
      </div>

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 text-lg leading-6">{course.title}</CardTitle>
          <div className="shrink-0 rounded-md bg-yellow-50 px-2.5 py-1 text-sm font-bold text-yellow-700">
            {stats.average ? stats.average.toFixed(1) : "0.0"}
          </div>
        </div>
        <CardDescription className="flex items-center justify-between gap-3">
          <span>{formatCurrency(course.price)}</span>
          <span>{course.availableSlots} chỗ</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2">
          <StarRating rating={stats.average} />
          <span className="text-sm font-medium text-muted-foreground">{stats.total} đánh giá</span>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Button asChild>
            <Link to={`/review/${course.id}`}>Xem review</Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label={`Xem khóa học ${course.title}`}>
            <Link to={`/courses/${course.id}`}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReviewPage() {
  const [pageIndex, setPageIndex] = useState(1);

  // Optimized: Only fetch courses for the current page to avoid loading 1000 items
  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    isError: isCourseError,
    error: courseError,
  } = usePublicCourses({ 
    PageIndex: pageIndex, 
    PageSize: PAGE_SIZE 
  });

  const courses = useMemo(() => coursesData?.items ?? [], [coursesData?.items]);
  const totalCount = coursesData?.totalCount ?? coursesData?.total ?? 0;
  
  // Optimized: Only fetch IDs for the current page's courses
  const courseIds = useMemo(() => courses.map((course) => course.id), [courses]);

  // Optimized: Only fetch reviews for the courses visible on the current page
  const reviewQueries = useCourseReviewQueries(courseIds, !!courseIds.length);

  const reviewsByCourseId = useMemo(() => {
    const map = new Map<string, ReviewItem[]>();
    courses.forEach((course, index) => {
      map.set(course.id, reviewQueries[index]?.data ?? []);
    });
    return map;
  }, [courses, reviewQueries]);

  const overviewStats = useMemo(() => {
    // Stats now represent the courses visible on the current page
    // This is a trade-off to prevent 1000+ API calls
    const allReviewsOnPage = Array.from(reviewsByCourseId.values()).flat();
    return {
      courses: totalCount,
      ...getReviewStats(allReviewsOnPage),
    };
  }, [totalCount, reviewsByCourseId]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const canGoPrevious = pageIndex > 1;
  const canGoNext = pageIndex < totalPages;

  const paginationItems = useMemo(() => {
    const items: (number | "ellipsis")[] = [];

    for (let page = 1; page <= totalPages; page += 1) {
      const isEdge = page === 1 || page === totalPages;
      const isNearActive = Math.abs(page - pageIndex) <= 1;

      if (isEdge || isNearActive) {
        items.push(page);
        continue;
      }

      if (items[items.length - 1] !== "ellipsis") {
        items.push("ellipsis");
      }
    }

    return items;
  }, [pageIndex, totalPages]);

  const handlePageChange = (nextPage: number) => {
    setPageIndex(Math.min(Math.max(nextPage, 1), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="min-h-screen bg-background py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              <Star className="h-4 w-4 fill-primary text-primary" />
              Review Course
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">Đánh giá khóa học</h1>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:min-w-[420px]">
            <Card className="border-border/60 bg-card">
              <CardContent className="p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Khóa học</div>
                <div className="mt-2 text-2xl font-bold">{overviewStats.courses}</div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card">
              <CardContent className="p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Review</div>
                <div className="mt-2 text-2xl font-bold">{overviewStats.total}</div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card">
              <CardContent className="p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Trung bình</div>
                <div className="mt-2 text-2xl font-bold">{overviewStats.average ? overviewStats.average.toFixed(1) : "0.0"}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {isCourseError ? (
          <Card className="border-red-200 bg-red-50/70">
            <CardContent className="flex items-center gap-3 py-8 text-sm text-red-700">
              <AlertCircle className="h-5 w-5" />
              {getErrorMessage(courseError, "Không thể tải danh sách khóa học.")}
            </CardContent>
          </Card>
        ) : isLoadingCourses ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CourseReviewSkeleton key={index} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <Card className="border-dashed border-border/70 bg-card">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <div className="text-lg font-semibold">Chưa có khóa học</div>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Khi backend có dữ liệu khóa học, các card đánh giá sẽ hiển thị tại đây.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <CourseReviewCard key={course.id} course={course} reviews={reviewsByCourseId.get(course.id)} />
              ))}
            </div>

            {totalPages > 1 ? (
              <PaginationBar
                className="mt-8 justify-center"
                items={paginationItems}
                activePage={pageIndex}
                previousDisabled={!canGoPrevious}
                nextDisabled={!canGoNext}
                onPageChange={handlePageChange}
                onPrevious={() => handlePageChange(pageIndex - 1)}
                onNext={() => handlePageChange(pageIndex + 1)}
              />
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
