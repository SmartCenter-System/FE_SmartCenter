import { Link } from "react-router-dom";
import { useMemo } from "react";
import { BookOpen, PlayCircle, GraduationCap } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { CourseListSkeleton } from "../components/CourseCardSkeleton";
import { useAuthStore } from "@/features/auth/store";
import { useMyEnrollments } from "@/features/enrollment";

export default function MyCoursesPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: enrollmentData, isLoading } = useMyEnrollments(!!accessToken);

  const enrolledCourses = useMemo(
    () =>
      (enrollmentData?.items ?? []).map((item) => ({
        id: item.courseId ?? item.courseName,
        title: item.courseName,
        imgUrl: item.imgUrl,
        progress: item.progress || 0,
        lecturerName: "Giảng viên SmartCenter",
        courseType: item.courseType === 1 ? "Online" : "Offline",
      })),
    [enrollmentData?.items],
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Khóa học của tôi</h1>
              <p className="text-primary-foreground/70">Tiếp tục hành trình chinh phục kiến thức của bạn</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseListSkeleton count={3} />
          </div>
        ) : enrolledCourses.length === 0 ? (
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-background/60 backdrop-blur-xl">
            <EmptyState
              title="Bạn chưa có khóa học nào"
              description="Hãy bắt đầu hành trình học tập bằng cách đăng ký khóa học đầu tiên của bạn ngay hôm nay!"
              action={{
                label: "Khám phá khóa học",
                onClick: () => (window.location.href = "/courses"),
              }}
              icon={BookOpen}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden bg-background/60 backdrop-blur-xl">
                <div className="relative aspect-video overflow-hidden">
                  {course.imgUrl ? (
                    <img
                      src={course.imgUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <BookOpen className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/50 backdrop-blur-md border-none text-[10px] uppercase font-bold tracking-widest px-3">
                      {course.courseType}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{course.lecturerName}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Tiến độ học tập</span>
                      <span className="font-black text-primary">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2 rounded-full" />
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Link to={`/courses/${course.id}`} className="w-full">
                    <Button className="w-full h-12 rounded-2xl gap-2 font-bold group-hover:scale-[1.02] transition-transform">
                      <PlayCircle className="h-5 w-5" />
                      {course.progress > 0 ? "Tiếp tục học" : "Bắt đầu học ngay"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
