import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/courses/services";
import { lessonService } from "@/features/courses/lessonService";
import { enrollmentService } from "@/features/courses/enrollmentService";
import { LessonDocuments } from "@/features/document/components/LessonDocuments";
import { useAuthStore } from "@/features/auth/store";
import { getYouTubeEmbedUrl, isYouTubeUrl } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ChevronLeft, Lock } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { CommentSection } from "../components/CommentSection";
import type { Course } from "@/features/courses/type";
import type { Enrollment } from "@/features/courses/enrollmentService";

export default function CourseStudyingPage() {
  const { id, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const sectionId = searchParams.get("sectionId") ?? undefined;
  const isValidCourseId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(id ?? ""),
  );

  const { data: courseData, isLoading } = useQuery<Course>({
    queryKey: ["courses", "detail", id],
    queryFn: () => courseService.getById(id as string),
    enabled: !!id && isValidCourseId,
    staleTime: 1000 * 60 * 10, // Thông tin khóa học giữ 10 phút
  });

  const { data: enrollmentData } = useQuery<{ items: Enrollment[]; total: number }>({
    queryKey: ["enrollments", "me"],
    queryFn: () => enrollmentService.getMyEnrollments(),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 30, // Thông tin ghi danh giữ 30 phút
    retry: false,
  });

  const enrollments = enrollmentData?.items;

  const { data: sectionLessonsData } = useQuery<
    { id: string; title: string; lessons: { id: string; title: string; description?: string; videoUrl?: string; order?: number; isPreview?: boolean; duration?: number }[] }[]
  >({
    queryKey: ["courses", "study-content", courseData?.courseId],
    queryFn: async () => {
      if (!courseData || !Array.isArray(courseData.sections)) return [];

      return Promise.all(
        courseData.sections.map(async (section) => {
          const rawLessons = await lessonService.getAll(courseData.courseId, section.id);
          return {
            ...section,
            lessons: Array.isArray(rawLessons)
              ? rawLessons.map((lesson) => ({
                  id: String(lesson.id),
                  title: lesson.title,
                  description: lesson.description,
                  videoUrl: lesson.videoUrl,
                  order: lesson.order,
                  isPreview: Boolean(lesson.isPreview),
                  duration: lesson.duration,
                }))
              : [],
          };
        }),
      );
    },
    enabled: !!courseData?.courseId && Array.isArray(courseData?.sections) && courseData.sections.length > 0,
    staleTime: 1000 * 60 * 15, // Nội dung bài học giữ 15 phút
    gcTime: 1000 * 60 * 30,
    retry: false,
  });

  const sections = useMemo(() => {
    if (!courseData) return [];
    if (Array.isArray(sectionLessonsData) && sectionLessonsData.length > 0) {
      return sectionLessonsData;
    }
    return (courseData as any).sections ?? [];
  }, [courseData, sectionLessonsData]);

  const allLessons = useMemo(
    () => sections.flatMap((section: any) => section.lessons ?? []),
    [sections],
  );

  const isPurchased = useMemo(() => {
    if (!enrollments) return false;
    const currentCourseId = String(courseData?.courseId ?? id ?? "").trim().toLowerCase();
    if (!currentCourseId) return false;

    return enrollments.some((item) => String(item.courseId ?? "").trim().toLowerCase() === currentCourseId);
  }, [courseData?.courseId, enrollments, id]);

  const lesson = useMemo(() => {
    if (allLessons.length === 0) return null;

    if (!lessonId) {
      // Tìm bài học đầu tiên có thể xem (preview hoặc đã mua)
      const firstAccessible = allLessons.find((l: any) => l.isPreview || isPurchased) || allLessons[0];
      if (firstAccessible) {
        navigate(`/courses/${id}/study/${firstAccessible.id}`, { replace: true });
        return firstAccessible;
      }
    }
    
    const found = allLessons.find((item: any) => item.id === lessonId);
    
    // Nếu học viên cố tình truy cập bài học không tồn tại hoặc bài học bị khóa mà chưa mua
    // Chúng ta sẽ để logic canView xử lý việc hiển thị "Locked Screen" 
    // thay vì văng ra ngoài ngay lập tức để họ vẫn thấy được danh sách bài học khác.
    
    return found;
  }, [allLessons, lessonId, id, navigate, isPurchased]);

  const canView = Boolean(lesson && (lesson.isPreview || isPurchased));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Đang tải nội dung học...</p>
      </div>
    );
  }

  if (!isValidCourseId) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl text-center">
          <p className="text-xl font-semibold mb-4">Liên kết khóa học không hợp lệ.</p>
          <Button onClick={() => navigate("/courses")}>Quay lại danh sách khóa học</Button>
        </div>
      </div>
    );
  }

  if (!courseData || !lesson) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl text-center">
          <p className="text-xl font-semibold mb-4">Không tìm thấy bài học.</p>
          <Button onClick={() => navigate(`/courses/${id}`)}>Quay lại trang khóa học</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-12">
      <div className="container mx-auto px-4 md:px-8 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" className="h-11 px-4" onClick={() => navigate(`/courses/${id}`)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại khóa học
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">{courseData.courseName}</p>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
          <section className="space-y-6">
            <Card className="overflow-hidden border-border shadow-sm">
              <div className="relative aspect-video bg-slate-950">
                {canView ? (
                  lesson.videoUrl ? (
                    isYouTubeUrl(lesson.videoUrl) ? (
                      <iframe
                        src={getYouTubeEmbedUrl(lesson.videoUrl)}
                        title={lesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : (
                      <video src={lesson.videoUrl} controls className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-white text-lg font-medium bg-slate-900">
                      Video chưa có sẵn cho bài học này.
                    </div>
                  )
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-6 bg-slate-950 text-center text-white px-8 animate-in fade-in zoom-in duration-500">
                    <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20">
                      <Lock className="h-10 w-10 text-amber-500" />
                    </div>
                    <div className="max-w-md">
                      <h2 className="text-2xl font-bold mb-2">Nội dung này đã bị khóa</h2>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Bài học này chỉ dành cho học viên đã đăng ký khóa học. Hãy mua khóa học để mở khóa toàn bộ nội dung và tài liệu đi kèm.
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button 
                          size="lg"
                          className="w-full sm:w-auto font-bold bg-amber-500 hover:bg-amber-600 text-black rounded-2xl"
                          onClick={() => navigate(`/checkout/${id}`)}
                        >
                          Mua khóa học - {formatPrice(courseData.basePrice)}
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full sm:w-auto text-white hover:bg-white/10 rounded-2xl"
                          onClick={() => navigate(`/courses/${id}`)}
                        >
                          Xem chi tiết khóa học
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="border-border shadow-sm">
              <CardContent>
                <h2 className="text-xl font-semibold mb-3">Mô tả bài học</h2>
                <p className="text-sm text-muted-foreground">
                  {lesson.isPreview
                    ? "Đây là bài xem trước. Bạn có thể truy cập ngay cả khi chưa mua khóa học."
                    : "Bạn đã mở khoá bài học này."}
                </p>
                {courseData.description ? (
                  <p className="text-sm text-foreground/80 leading-relaxed">{courseData.description}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Chưa có mô tả chi tiết cho bài học này.</p>
                )}
              </CardContent>
            </Card>

            {/* Discussion Section */}
            <div className="mt-10 pt-10 border-t">
              <CommentSection lessonId={lesson.id} />
            </div>
          </section>

          <aside className="space-y-6">
            <Card className="border-border shadow-sm">
              <CardContent>
                <h2 className="text-lg font-semibold mb-4">Danh sách bài học</h2>
                <ul className="space-y-2">
                  {sections.map((section: any) => (
                    <li key={section.id} className="space-y-2">
                      <p className="text-sm font-semibold">{section.title}</p>
                      <ul className="space-y-2">
                        {section.lessons?.map((item: any) => {
                          const isActive = item.id === lesson.id;
                          const allowed = item.isPreview || isPurchased;
                          return (
                            <li
                              key={item.id}
                              className={`rounded-xl px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                                isActive ? "bg-primary/20 text-primary font-medium" : "bg-muted/50 text-foreground"
                              } ${allowed ? "cursor-pointer hover:bg-primary/10" : "opacity-60 cursor-not-allowed"}`}
                              onClick={() => {
                                if (allowed) {
                                  navigate(
                                    `/courses/${id}/study/${item.id}${sectionId ? `?sectionId=${sectionId}` : ""}`,
                                  );
                                }
                              }}
                            >
                              <span>{item.title}</span>
                              {!isPurchased ? (
                                <span className="text-[11px] rounded-full px-2 py-1 font-semibold text-muted-foreground bg-muted border border-border/50">
                                  {item.isPreview ? "Xem trước" : "Khoá"}
                                </span>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>

        {!isPurchased ? (
          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              Nếu bạn chưa mua khóa học, chỉ những bài xem trước mới có thể truy cập được. Giá khóa học hiện tại là {formatPrice(courseData.basePrice)}.
              Để mở khóa thêm bài học, vui lòng đăng ký khóa học.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
