import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Users,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Trophy,
  Smartphone,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/courses/services";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => courseService.getById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Đang tải thông tin khóa học...</p>
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

  // TODO: Extend data from API with UI mock properties if missing.
  // Khi Backend đã có đủ các trường này (như rating, reviews, syllabus), bạn có thể xóa cục MOCK DATA này đi và dùng thẳng `const course = courseData`.
  const course = {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

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
                  className="w-10 h-10 rounded-full border-2 border-slate-700"
                />
                <span className="text-slate-300">
                  Được tạo bởi{" "}
                  <span className="text-white font-medium hover:underline cursor-pointer">
                    {course.instructor.name}
                  </span>
                </span>
              </div>
            </div>

            {/* Mobile Video Preview (Hidden on Desktop) */}
            <div className="lg:hidden w-full mt-4">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                <img
                  src={course.imgUrl || undefined}
                  alt="Course Preview"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="icon"
                    className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/30 text-white"
                  >
                    <PlayCircle className="h-10 w-10" />
                  </Button>
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
                  {course.syllabus.length} chương • {course.duration}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Accordion type="multiple" defaultValue={["item-0"]} className="w-full">
                  {course.syllabus.map((chapter, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="px-6 border-b last:border-0">
                      <AccordionTrigger className="hover:no-underline py-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left pr-4 gap-2">
                          <span className="font-semibold text-base">{chapter.title}</span>
                          <span className="text-sm font-normal text-muted-foreground shrink-0 hidden md:block">
                            {chapter.lectures} bài giảng • {chapter.duration}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 pt-0">
                        <ul className="space-y-3">
                          {chapter.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between text-muted-foreground pl-4 border-l-2 border-muted"
                            >
                              <div className="flex items-center gap-3">
                                <PlayCircle className="h-4 w-4 shrink-0" />
                                <span>{item}</span>
                              </div>
                            </li>
                          ))}
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
                <div className="relative aspect-video bg-slate-900 group cursor-pointer">
                  <img
                    src={course.imgUrl || undefined}
                    alt="Course Preview"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlayCircle className="h-10 w-10 text-white" />
                    </div>
                    <span className="text-white font-medium mt-3 drop-shadow-md">Xem trước khóa học</span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6">
                    <div className="text-4xl font-extrabold text-foreground">{formatPrice(course.basePrice)}</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <Button
                      className="w-full text-lg h-12 shadow-md"
                      onClick={() => navigate(`/checkout/${course.courseId}`)}
                    >
                      Đăng ký học ngay
                    </Button>
                    <Button variant="outline" className="w-full text-lg h-12 border-primary/20 hover:bg-primary/5">
                      Thêm vào giỏ hàng
                    </Button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground mb-6">Đảm bảo hoàn tiền trong 30 ngày</p>

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
                      <li className="flex items-center gap-3">
                        <Trophy className="h-5 w-5 shrink-0 text-primary" />
                        Cấp chứng chỉ hoàn thành
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-sm font-semibold mb-3">Dành cho doanh nghiệp?</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Cung cấp khóa học này cho đội ngũ của bạn để nâng cao kỹ năng chuyên môn.
                    </p>
                    <Button variant="secondary" className="w-full text-sm h-10">
                      Liên hệ tư vấn Doanh nghiệp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Buy Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-bold">{formatPrice(course.basePrice)}</div>
        </div>
        <Button
          className="flex-1 max-w-xs h-12 text-lg shadow-md"
          onClick={() => navigate(`/checkout/${course.courseId}`)}
        >
          Đăng ký ngay
        </Button>
      </div>
    </div>
  );
}
