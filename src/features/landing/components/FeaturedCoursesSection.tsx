import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

const courses = [
  {
    id: "math-12",
    image: "https://placehold.co/600x400/17218F/FFFFFF?text=Toan+12",
    duration: "4 Tuần",
    level: "Cơ bản",
    instructor: "Thầy Nguyễn Văn An",
    title: "Toán Học Lớp 12: Chinh Phục Kỳ Thi TN THPT",
    description: "Hệ thống lại toàn bộ kiến thức giải tích và hình học lớp 12. Tập trung vào các dạng bài tập thực tế và kỹ thuật giải nhanh bằng máy tính cầm tay (Casio)."
  },
  {
    id: "physics-12",
    image: "https://placehold.co/600x400/E9C704/FFFFFF?text=Ly+12",
    duration: "4 Tuần",
    level: "Cơ bản",
    instructor: "Thầy Nguyễn Văn An",
    title: "Vật Lý Lớp 12: Chinh Phục Kỳ Thi TN THPT",
    description: "Hệ thống lại toàn bộ kiến thức vật lý lớp 12. Tập trung vào các dạng bài tập thực tế và kỹ thuật giải nhanh bằng máy tính cầm tay (Casio)."
  },
  {
    id: "chemistry-12",
    image: "https://placehold.co/600x400/17218F/FFFFFF?text=Hoa+12",
    duration: "4 Tuần",
    level: "Cơ bản",
    instructor: "Thầy Nguyễn Văn An",
    title: "Hóa Học Lớp 12: Chinh Phục Kỳ Thi TN THPT",
    description: "Hệ thống lại toàn bộ kiến thức hóa học lớp 12. Tập trung vào các dạng bài tập thực tế và kỹ thuật giải nhanh bằng máy tính cầm tay (Casio)."
  },
  {
    id: "english-12",
    image: "https://placehold.co/600x400/E9C704/FFFFFF?text=Anh+12",
    duration: "4 Tuần",
    level: "Cơ bản",
    instructor: "Thầy Nguyễn Văn An",
    title: "Tiếng Anh Lớp 12: Chinh Phục Kỳ Thi TN THPT",
    description: "Hệ thống lại toàn bộ kiến thức tiếng anh lớp 12. Tập trung vào các dạng bài tập thực tế và kỹ thuật giải nhanh bằng máy tính cầm tay (Casio)."
  },
  {
    id: "biology-12",
    image: "https://placehold.co/600x400/17218F/FFFFFF?text=Sinh+12",
    duration: "4 Tuần",
    level: "Cơ bản",
    instructor: "Thầy Nguyễn Văn An",
    title: "Sinh Học Lớp 12: Chinh Phục Kỳ Thi TN THPT",
    description: "Hệ thống lại toàn bộ kiến thức sinh học lớp 12. Tập trung vào các dạng bài tập thực tế và kỹ thuật giải nhanh bằng máy tính cầm tay (Casio)."
  },
  {
    id: "literature-12",
    image: "https://placehold.co/600x400/E9C704/FFFFFF?text=Van+12",
    duration: "4 Tuần",
    level: "Cơ bản",
    instructor: "Thầy Nguyễn Văn An",
    title: "Ngữ Văn Lớp 12: Chinh Phục Kỳ Thi TN THPT",
    description: "Hệ thống lại toàn bộ kiến thức ngữ văn lớp 12. Tập trung vào các dạng bài tập thực tế và kỹ thuật giải nhanh bằng máy tính cầm tay (Casio)."
  }
];

export function FeaturedCoursesSection() {
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

        <div className="grid md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="rounded-xl overflow-hidden mb-6 aspect-video">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-background text-muted-foreground border-border font-normal px-3 py-1">{course.duration}</Badge>
                  <Badge variant="outline" className="bg-background text-muted-foreground border-border font-normal px-3 py-1">{course.level}</Badge>
                </div>
                <span className="text-sm font-medium text-foreground">{course.instructor}</span>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                {course.title}
              </h3>

              <p className="text-muted-foreground text-xs sm:text-sm mb-6 line-clamp-3 flex-1">
                {course.description}
              </p>

              <div className="w-full rounded-md bg-blue-700 text-white py-3 text-sm sm:text-base font-medium text-center transition-colors hover:bg-yellow-400 hover:text-black">
                Xem chi tiết & Đăng kí
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
