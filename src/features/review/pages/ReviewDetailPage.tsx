import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, CalendarClock, Search, Star } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { useReviews } from "../hooks/useReviews";
import type { ReviewItem } from "../type";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
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

export default function ReviewDetailPage() {
  const { courseId = "" } = useParams();

  const {
    data: reviews = [],
    isLoading: isLoadingReviews,
    isError: isReviewError,
    error: reviewError,
  } = useReviews(courseId);

  const { data: course } = useCourse(courseId);

  const stats = useMemo(() => getReviewStats(reviews), [reviews]);
  const courseName = course?.courseName || "Khóa học";

  return (
    <section className="min-h-screen bg-background py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-6 px-0">
          <Link to="/review">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách review
          </Link>
        </Button>

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{courseName}</h1>
            
          </div>

          <div className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3">
            <StarRating rating={stats.average} size="md" />
            <div className="text-sm font-semibold">
              {stats.average ? stats.average.toFixed(1) : "0.0"}/5
              <span className="ml-2 font-normal text-muted-foreground">({stats.total} review)</span>
            </div>
          </div>
        </div>

        {isReviewError ? (
          <Card className="border-red-200 bg-red-50/70">
            <CardContent className="flex items-center gap-3 py-8 text-sm text-red-700">
              <AlertCircle className="h-5 w-5" />
              {getErrorMessage(reviewError, "Không thể tải review của khóa học.")}
            </CardContent>
          </Card>
        ) : isLoadingReviews ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border-border/60 bg-card">
                <CardHeader className="space-y-3">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card className="border-dashed border-border/70 bg-card">
            <CardContent className="flex flex-col items-center justify-center py-14 text-center">
              <Search className="mb-4 h-12 w-12 text-muted-foreground" />
              <div className="text-lg font-semibold">Khóa học này chưa có review</div>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Điểm trung bình sẽ được cập nhật khi học viên gửi đánh giá.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <Card key={review.reviewId} className="border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-base">{review.studentName}</CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-1.5">
                        <CalendarClock className="h-4 w-4" />
                        {formatDate(review.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 rounded-md bg-yellow-50 px-2.5 py-1 text-sm font-semibold text-yellow-700">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {review.rating}/5
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-6 text-muted-foreground">{review.comment || "Không có bình luận."}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
