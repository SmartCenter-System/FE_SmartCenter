import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Users,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Lock,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/courses/services";
import { lessonService } from "@/features/courses/lessonService";
import { enrollmentService } from "@/features/courses/enrollmentService";
import { useAuthStore } from "@/features/auth/store";
import { getYouTubeEmbedUrl, isYouTubeUrl } from "@/lib/utils";
import type { Course } from "@/features/courses/type";
import type { Enrollment } from "@/features/courses/enrollmentService";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isValidCourseId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(id ?? ""),
  );

  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: courseData, isLoading } = useQuery<Course>({
    queryKey: ["course", id],
    queryFn: () => courseService.getById(id as string),
    enabled: !!id && isValidCourseId,
  });

  const { data: enrollmentData } = useQuery<{ items: Enrollment[]; total: number }>({
    queryKey: ["myEnrollments"],
    queryFn: () => enrollmentService.getMyEnrollments(),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnMount: "always",
  });
  const enrollments = enrollmentData?.items;

  // TODO: Extend data from API with UI mock properties if missing.
  // Khi Backend đã có đủ các trường này (như rating, reviews, syllabus), bạn có thể xóa cục MOCK DATA này đi và dùng thẳng `const course = courseData`.

  const coursePlaceholderImage = "https://placehold.co/600x400/17218F/FFFFFF?text=Preview+Image";

  type CourseLesson = {
    id: string;
    title: string;
    isPreview: boolean;
    videoUrl?: string;
  };

  type CourseSection = {
    id: string;
    title: string;
    lessons: CourseLesson[];
  };

  const { data: sectionLessonsData } = useQuery<CourseSection[]>({
    queryKey: ["courseSectionLessons", courseData?.courseId],
    queryFn: async () => {
      if (!courseData || !Array.isArray(courseData.sections)) {
        return [];
      }

      const sectionResults = await Promise.all(
        courseData.sections.map(async (section) => {
          const rawLessons = await lessonService.getAll(courseData.courseId, section.id);
          return {
            ...section,
            lessons: Array.isArray(rawLessons)
              ? rawLessons.map((lesson) => ({
                  id: String(lesson.id),
                  title: lesson.title,
                  isPreview: Boolean(lesson.isPreview),
                  videoUrl: lesson.videoUrl,
                }))
              : [],
          };
        }),
      );

      return sectionResults;
    },
    enabled: !!courseData?.courseId && Array.isArray(courseData?.sections) && courseData.sections.length > 0,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const course = useMemo(() => {
    if (!courseData) return null as unknown as Course;

    return {
      ...courseData,
      instructor: {
        name: "Thầy Nguyễn Đức Anh",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        title: "Chuyên gia luyện thi môn Toán THPT Quốc Gia",
        rating: 4.9,
        students: 15400,
        courses: 12,
        bio: "Với hơn 10 năm kinh nghiệm luyện thi, Thầy đã giúp hàng ngàn học sinh đạt điểm 9+ môn Toán trong kỳ thi THPT Quốc Gia. Phương pháp dạy dễ hiểu, bám sát cấu trúc đề thi mới nhất.",
      },
      rating: 4.8,
      reviews: 1240,
      students: 5430,
      duration: "48 giờ video",
      lastUpdated: courseData.startAt ? new Date(courseData.startAt).toLocaleDateString("vi-VN") : "01/01/2026",
      benefits: [
        "Hệ thống hóa toàn bộ kiến thức Toán 12 theo chuyên đề",
        "Kỹ năng bấm máy tính Casio giải nhanh trắc nghiệm",
        "Luyện các dạng bài vận dụng cao (câu 35-50)",
        "Làm quen với áp lực phòng thi qua các đề thi thử",
      ],
      syllabus: [
        {
          title: "Chuyên đề 1: Ứng dụng đạo hàm để khảo sát hàm số",
          lectures: 12,
          duration: "4 giờ 15 phút",
          items: [
            "Tính đơn điệu của hàm số",
            "Cực trị của hàm số",
            "Giá trị lớn nhất, nhỏ nhất",
            "Tiệm cận đồ thị hàm số",
          ],
        },
        {
          title: "Chuyên đề 2: Hàm số Lũy thừa, Mũ và Logarit",
          lectures: 15,
          duration: "5 giờ 30 phút",
          items: [
            "Lũy thừa và Logarit",
            "Hàm số mũ và logarit",
            "Phương trình mũ và logarit",
            "Bất phương trình mũ và logarit",
          ],
        },
        {
          title: "Chuyên đề 3: Nguyên hàm, Tích phân và Ứng dụng",
          lectures: 10,
          duration: "3 giờ 45 phút",
          items: ["Nguyên hàm cơ bản", "Phương pháp tính tích phân", "Ứng dụng tính diện tích và thể tích"],
        },
        {
          title: "Chuyên đề 4: Khối đa diện và Thể tích",
          lectures: 8,
          duration: "2 giờ 30 phút",
          items: ["Khái niệm khối đa diện", "Thể tích khối lăng trụ", "Thể tích khối chóp", "Khoảng cách và góc"],
        },
      ],
    };
  }, [courseData]) as Course & {
    instructor: {
      name: string;
      avatar: string;
      title: string;
      rating: number;
      students: number;
      courses: number;
      bio: string;
    };
    rating: number;
    reviews: number;
    students: number;
    duration: string;
    lastUpdated: string;
    benefits: string[];
    syllabus: Array<{ title: string; lectures: number; duration: string; items: string[] }>;
  };

  const sections: CourseSection[] = useMemo(() => {
    if (!courseData) return [];
    if (Array.isArray(sectionLessonsData) && sectionLessonsData.length > 0) {
      return sectionLessonsData;
    }

    return (courseData as any).sections ?? course.syllabus.map((chapter: any, idx: number) => ({
      id: chapter.id ?? `mock-${idx}`,
      title: chapter.title,
      lessons: (chapter.items ?? []).map((item: string, lessonIndex: number) => ({
        id: `mock-${idx}-${lessonIndex}`,
        title: item,
        isPreview: false,
      })),
    }));
  }, [courseData, sectionLessonsData]);

  const isPurchased = useMemo(() => {
    if (!enrollments) return false;
    const currentCourseId = String(courseData?.courseId ?? id ?? "").trim().toLowerCase();
    if (!currentCourseId) return false;

    return enrollments.some((item) => String(item.courseId ?? "").trim().toLowerCase() === currentCourseId);
  }, [courseData?.courseId, enrollments, id]);

  const allLessons = useMemo(() => sections.flatMap((section) => section.lessons), [sections]);

  const selectedLesson = useMemo(
    () => allLessons.find((lesson) => lesson.isPreview || isPurchased),
    [allLessons, isPurchased],
  );

  const studyNowLessonId = useMemo(() => {
    if (selectedLesson?.id) return selectedLesson.id;
    if (allLessons.length > 0) return allLessons[0].id;
    return undefined;
  }, [allLessons, selectedLesson?.id]);

  const handleLessonClick = (lesson: CourseLesson) => {
    const currentSectionId = sections.find((section) => section.lessons.some((item) => item.id === lesson.id))?.id;

    if (lesson.isPreview || isPurchased) {
      navigate(
        `/courses/${course?.courseId ?? ""}/study/${lesson.id}${currentSectionId ? `?sectionId=${currentSectionId}` : ""}`,
      );
      return;
    }

    navigate(`/checkout/${course?.courseId ?? ""}`);
  };

  const previewTitle = selectedLesson ? selectedLesson.title : "Chọn bài giảng để xem trước";
  const previewLabel = selectedLesson
    ? selectedLesson.isPreview
      ? "Xem trước" 
      : "Đã mở khóa"
    : "Chọn bài giảng xem trước";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen pb-20">
        {/* Skeleton Header */}
        <div className="bg-slate-900 pt-8 pb-16 px-4 md:px-8">
          <div className="container mx-auto space-y-6">
            <Skeleton className="h-4 w-48 bg-slate-800" />
            <Skeleton className="h-12 w-3/4 bg-slate-800" />
            <Skeleton className="h-20 w-full bg-slate-800" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-24 bg-slate-800" />
              <Skeleton className="h-6 w-24 bg-slate-800" />
              <Skeleton className="h-6 w-24 bg-slate-800" />
            </div>
          </div>
        </div>
        
        {/* Skeleton Body */}
        <div className="container mx-auto px-4 md:px-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <Skeleton className="h-48 w-full rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            </div>
            <div className="hidden lg:block space-y-6">
              <Card className="p-6 space-y-6 -mt-40 bg-background border shadow-xl">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidCourseId) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Liên kết khóa học không hợp lệ.</p>
          <Button onClick={() => navigate("/courses")}>Quay lại danh sách khóa học</Button>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy khóa học.</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Dark Header Hero */}
      <div className="bg-slate-900 text-slate-50 pt-8 pb-12 lg:pb-16 px-4 md:px-8">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-slate-200 transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/courses" className="hover:text-slate-200 transition-colors">
              Khóa học
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-slate-200 truncate">{course.courseName}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{course.courseName}</h1>
              <p className="text-lg md:text-xl text-slate-300">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
                <div className="flex items-center text-yellow-500 font-semibold bg-yellow-500/10 px-2 py-1 rounded">
                  <span className="mr-1">{course.rating}</span>
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-slate-300 ml-2 font-normal">({course.reviews} đánh giá)</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Users className="h-4 w-4 mr-2" />
                  {course.students} học viên
                </div>
                <div className="flex items-center text-slate-300">
                  <Clock className="h-4 w-4 mr-2" />
                  Cập nhật lần cuối: {course.lastUpdated}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <img
                  src={course.instructor.avatar}
                  alt="Instructor"
                  className="w-10 h-10 rounded-full border-2 border-border/50"
                />
                <span className="text-slate-300">
                  Được tạo bởi{" "}
                  <span className="text-slate-50 font-medium hover:underline cursor-pointer">
                    {course.instructor.name}
                  </span>
                </span>
              </div>
            </div>

            {/* Mobile Video Preview (Hidden on Desktop) */}
            <div className="lg:hidden w-full mt-4">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
                {selectedLesson?.videoUrl ? (
                  isYouTubeUrl(selectedLesson.videoUrl) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(selectedLesson.videoUrl)}
                      title={selectedLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <video src={selectedLesson.videoUrl} controls className="w-full h-full object-cover" />
                  )
                ) : (
                  <img
                    src={course.imgUrl ?? coursePlaceholderImage}
                    alt={previewTitle}
                    className="w-full h-full object-cover opacity-80"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <div className="text-sm font-semibold">{previewTitle}</div>
                  <div className="text-xs text-slate-200">{previewLabel}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-12">
            {/* What you'll learn */}
            <section className="bg-muted/30 border border-border rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Bạn sẽ học được gì?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Syllabus */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Nội dung khóa học</h2>
                <div className="text-sm text-muted-foreground">
                  {sections.length} chương • {course.duration}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Accordion type="multiple" defaultValue={["item-0"]} className="w-full">
                  {sections.map((section, index) => (
                    <AccordionItem key={section.id ?? index} value={`item-${index}`} className="px-6 border-b last:border-0">
                      <AccordionTrigger className="hover:no-underline py-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left pr-4 gap-2">
                          <span className="font-semibold text-base">{section.title}</span>
                          <span className="text-sm font-normal text-muted-foreground shrink-0 hidden md:block">
                            {section.lessons.length} bài giảng
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 pt-0">
                        <ul className="space-y-3">
                          {section.lessons.map((lesson) => {
                            const isAccessible = isPurchased || lesson.isPreview;
                            const isSelected = selectedLesson?.id === lesson.id;

                            return (
                              <li
                                key={lesson.id}
                                onClick={() => handleLessonClick(lesson)}
                                className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
                                  isAccessible ? "border-border/50 bg-background/80 hover:border-primary/60 hover:bg-background cursor-pointer" : "border-border/50 bg-muted/10 cursor-not-allowed opacity-80"
                                } ${isSelected ? "ring-2 ring-primary/40" : ""}`}
                              >
                                <div className="flex items-center gap-3">
                                  <PlayCircle className={`h-4 w-4 shrink-0 ${isAccessible ? "text-primary" : "text-muted-foreground"}`} />
                                  <span className={isAccessible ? "text-foreground" : "text-muted-foreground opacity-70"}>
                                    {lesson.title}
                                  </span>
                                </div>
                                {lesson.isPreview ? (
                                  <span className="rounded-full bg-emerald-500/10 text-emerald-500 px-2 py-1 text-[11px] font-semibold">
                                    Xem trước
                                  </span>
                                ) : isAccessible ? (
                                  <span className="rounded-full bg-primary/10 text-primary px-2 py-1 text-[11px] font-semibold">
                                    Mở khóa
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Lock className="h-4 w-4" />
                                    <span>Khoá</span>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            {/* Instructor */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Giảng viên</h2>
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-32 h-32 rounded-full object-cover border shadow-sm"
                    />
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-primary hover:underline cursor-pointer">
                          {course.instructor.name}
                        </h3>
                        <p className="text-muted-foreground">{course.instructor.title}</p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {course.instructor.rating} Điểm
                          đánh giá
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-primary" /> {course.instructor.students} Học viên
                        </div>
                        <div className="flex items-center gap-1">
                          <PlayCircle className="h-4 w-4 text-primary" /> {course.instructor.courses} Khóa học
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed pt-2">{course.instructor.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sticky Sidebar (Right Column) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 z-10 transition-all duration-300">
              <Card className="overflow-hidden border-border shadow-2xl -mt-40 bg-background/80 backdrop-blur-xl">
                {/* Desktop Video Preview */}
                <div className="relative aspect-video bg-slate-900 group cursor-pointer rounded-t-xl overflow-hidden">
                  {selectedLesson?.videoUrl ? (
                    isYouTubeUrl(selectedLesson.videoUrl) ? (
                      <iframe
                        src={getYouTubeEmbedUrl(selectedLesson.videoUrl)}
                        title={selectedLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : (
                      <video src={selectedLesson.videoUrl} controls className="w-full h-full object-cover" />
                    )
                  ) : (
                    <img
                      src={course.imgUrl ?? coursePlaceholderImage}
                      alt={previewTitle}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <div className="text-sm font-semibold">{previewTitle}</div>
                    <div className="text-xs text-slate-200">{previewLabel}</div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {isPurchased ? (
                    <div className="mb-6 space-y-3">
                      <Button
                        className="w-full text-lg h-12 shadow-md"
                        onClick={() => {
                          if (studyNowLessonId) {
                            const currentSectionId = sections.find((section) =>
                              section.lessons.some((item) => item.id === studyNowLessonId),
                            )?.id;
                            navigate(
                              `/courses/${course.courseId}/study/${studyNowLessonId}${currentSectionId ? `?sectionId=${currentSectionId}` : ""}`,
                            );
                          }
                        }}
                        disabled={!studyNowLessonId}
                      >
                        Vào học ngay
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-foreground">{formatPrice(course.basePrice)}</div>
                        </div>
                        <Button
                          className="w-full text-lg h-12 shadow-md"
                          onClick={() => navigate(`/checkout/${course.courseId}`)}
                        >
                          Mua khoá học ngay
                        </Button>
                        <Button variant="outline" className="w-full text-lg h-12 border-primary/20 hover:bg-primary/5">
                          Thêm vào giỏ hàng
                        </Button>
                      </div>

                      <p className="text-center text-sm text-muted-foreground mb-6">Đảm bảo hoàn tiền trong 30 ngày</p>
                    </>
                  )}

                  <div className="space-y-4 text-sm">
                    <h4 className="font-semibold text-foreground">Khóa học này bao gồm:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-center gap-3">
                        <PlayCircle className="h-5 w-5 shrink-0 text-primary" />
                        {course.duration} video bài giảng
                      </li>
                      <li className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                        Quyền truy cập trọn đời
                      </li>
                      <li className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 shrink-0 text-primary" />
                        Học trên máy tính và thiết bị di động
                      </li>
                      
                    </ul>
                  </div>

                  
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Buy Button */}
      {!isPurchased && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between gap-4">
          <div className="leading-tight">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Giá khóa học</div>
            <div className="text-2xl font-bold">{formatPrice(course.basePrice)}</div>
          </div>
          <Button
            className="flex-1 max-w-xs h-12 text-base shadow-md"
            onClick={() => navigate(`/checkout/${course.courseId}`)}
          >
            Đăng ký ngay
          </Button>
        </div>
      )}
    </div>
  );
}
