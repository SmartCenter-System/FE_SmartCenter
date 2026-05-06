
import { ArrowUpRight } from "lucide-react";
import Header from "@/shared/components/common/Header";
import Footer from "@/shared/components/common/Footer";
import FullscreenHero from "./components/FullscreenHero";



export default function HomePage() {


  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <Header />

      <main className="flex-1">
        <FullscreenHero className="relative isolate h-screen w-full overflow-hidden bg-[#0E3BAF] pt-[72px]" />

       
        {/* Values Section */}
        <section className="relative z-10 py-24 px-6 bg-background overflow-hidden">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-16 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Những Giá Trị Bạn Sẽ Nhận Được
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed max-w-4xl">
                Chúng tôi không chỉ cung cấp kiến thức, mà còn mang đến một môi trường học tập biến đổi, giúp học sinh THPT phát triển toàn diện kỹ năng và tự duy.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Lịch học linh hoạt",
                  description:
                    "Học yêu lựa, một nơi trên một thiết bị. Phù hợp với lịch học dạy độc trên trường của học sinh cấp 3.",
                },
                {
                  number: "02",
                  title: "Đội ngũ giáo viên giỏi",
                  description:
                    "Được đón đặt bối các thầy cô có nhiều năm kinh nghiệm ôn thi học lực và có phương pháp dạy hiệu quả.",
                },
                {
                  number: "03",
                  title: "Kho tài liệu phong phú",
                  description:
                    "Hơn 1000+ bộ đề thi thử, file tóm tắt công thức và sơ đồ tư duy được cập nhật liên tục hàng tuần.",
                },
                {
                  number: "04",
                  title: "Chương trình bám sát thực tế",
                  description:
                    "Nội dung bài giảng luôn cập nhật theo cấu trúc để thi mỗi năm của Bộ Giáo dục, tập trung các dạng tầm.",
                },
                {
                  number: "05",
                  title: "Luyện tập & Kiểm tra",
                  description:
                    "Hệ thống bài tập tu luyện có chấm điểm tự động và lời giải chi tiết, giúp ban nhận ra lỗi sai ngay tức.",
                },
                {
                  number: "06",
                  title: "Cộng đồng học tập nâng cao",
                  description:
                    "Tham gia nhóm học tập của cùng trao đối bài, chia sẻ kinh nghiệm ôn thi với những bạn cùng được lựa.",
                },
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="relative space-y-4 rounded-lg border border-border/50 bg-card/30 p-8 backdrop-blur-sm transition-all duration-300 hover:border-border/50 hover:bg-card/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="mb-3 text-5xl font-bold text-blue-700 transition-colors duration-300 group-hover:text-yellow-400">{item.number}</div>
                        <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                      </div>
                      <ArrowUpRight className="h-6 w-6 text-blue-700/70 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-yellow-400" />
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="relative z-10 py-24 px-6 bg-background overflow-hidden">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Khóa học
              </h2>
              <button className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                Xem tất cả
              </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {[
                {
                  image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=300&fit=crop",
                  duration: "4 Weeks",
                  level: "Beginner",
                  instructor: "Thầy Nguyễn Văn An",
                  title: "Toán Học Lập 12: Chính Phục Kỳ Thi TN THPT",
                  description:
                    "Hệ thống lý toán bộ kiến thức gốc tích và hiểu hòa lập 12. Tập trung vào các dạng bài tập thực tế và kỹ thuật giải nhanh bằng máy tính cầm tay (Casio).",
                },
                {
                  image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=300&fit=crop",
                  duration: "4 Weeks",
                  level: "Beginner",
                  instructor: "Thầy Nguyễn Văn An",
                  title: "Toán Học Lập 12: Chính Phục Kỳ Thi TN THPT",
                  description:
                    "Hệ thống lý toán bộ kiến thức gốc tích và hiểu hòa lập 12. Tập trung vào các dạng bài tập thực tế và kỹ thuật giải nhanh bằng máy tính cầm tay (Casio).",
                },
                {
                  image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=300&fit=crop",
                  duration: "4 Weeks",
                  level: "Beginner",
                  instructor: "Thầy Nguyễn Văn An",
                  title: "Toán Học Lập 12: Chính Phục Kỳ Thi TN THPT",
                  description:
                    "Hệ thống lý toán bộ kiến thức gốc tích và hiểu hòa lập 12. Tập trung vào các dạng bài tập thực tế và kỹ thuật giải nhanh bằng máy tính cầm tay (Casio).",
                },
                {
                  image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=300&fit=crop",
                  duration: "4 Weeks",
                  level: "Beginner",
                  instructor: "Thầy Nguyễn Văn An",
                  title: "Toán Học Lập 12: Chính Phục Kỳ Thi TN THPT",
                  description:
                    "Hệ thống lý toán bộ kiến thức gốc tích và hiểu hòa lập 12. Tập trung vào các dạng bài tập thực tế và kỹ thuật giải nhanh bằng máy tính cầm tay (Casio).",
                },
                {
                  image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=300&fit=crop",
                  duration: "4 Weeks",
                  level: "Beginner",
                  instructor: "Thầy Nguyễn Văn An",
                  title: "Toán Học Lập 12: Chính Phục Kỳ Thi TN THPT",
                  description:
                    "Hệ thống lý toán bộ kiến thức gốc tích và hiểu hòa lập 12. Tập trung vào các dạng bài tập thực tế và kỹ thuật giải nhanh bằng máy tính cầm tay (Casio).",
                },
                {
                  image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=300&fit=crop",
                  duration: "4 Weeks",
                  level: "Beginner",
                  instructor: "Thầy Nguyễn Văn An",
                  title: "Toán Học Lập 12: Chính Phục Kỳ Thi TN THPT",
                  description:
                    "Hệ thống lý toán bộ kiến thức gốc tích và hiểu hòa lập 12. Tập trung vào các dạng bài tập thực tế và kỹ thuật giải nhanh bằng máy tính cầm tay (Casio).",
                },
              ].map((course, idx) => (
                <div key={idx} className="overflow-hidden rounded-lg border border-border/50 bg-card transition-all duration-300 hover:border-border/50 hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex gap-2">
                      <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {course.duration}
                      </span>
                      <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {course.level}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{course.instructor}</p>
                      <h3 className="text-base font-semibold text-foreground">{course.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <button className="w-full rounded-md bg-blue-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-yellow-400 hover:text-black">
                      Đăng ký ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative z-10 py-24 px-6 bg-background overflow-hidden">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-12 flex items-start justify-between gap-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  Học Viên Nói Gì Về Chúng Tôi?
                </h2>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Hàng ngàn học sinh THPT trên khắp cả nước đã bứt phá điểm số và đỗ vào ngôi trường đại học mơ ước nhờ lộ trình học tập tối ưu. Hãy lắng nghe những chia sẻ thật nhất từ chính các bạn ấy.
                </p>
              </div>

              <button className="shrink-0 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                Xem tất cả cảm nhận
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  content:
                    "Khóa học Toán 12 thực sự là cứu cánh cho mình. Trước đây mình rất sợ hình học không gian, nhưng nhờ cách giảng dạy bằng hình ảnh 3D của thầy, mình đã nắm chắc kiến thức và tự tin đạt điểm 9 trong kỳ thi học kỳ vừa rồi. Rất đề xuất cho các bạn đang mất gốc!",
                  name: "Minh Anh (Lớp 12 - Hà Nội)",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
                },
                {
                  content:
                    "Mình thích nhất là khóa luyện thi IELTS 6.5+. Các thầy cô không chỉ dạy kiến thức mà còn chia sẻ những mẹo làm bài rất thực tế. Chỉ sau 3 tháng, kỹ năng Speaking của mình đã cải thiện rõ rệt, mình không còn cảm thấy run khi giao tiếp nữa. Cảm ơn trung tâm rất nhiều!",
                  name: "Đức Huy (Lớp 11 - TP. HCM)",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
                },
                {
                  content:
                    "Lần đầu tiên mình thấy học Văn lại thú vị đến thế. Phương pháp sơ đồ tư duy giúp mình nhớ các tác phẩm rất nhanh mà không cần học vẹt. Bài viết của mình cũng được cô nhận xét là sâu sắc hơn và có cảm xúc hơn trước. Đây là khóa học xứng đáng nhất mình từng tham gia.",
                  name: "Khánh Linh (Lớp 12 - Đà Nẵng)",
                  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
                },
                {
                  content:
                    "Dù bắt đầu học Lý khá muộn nhưng nhờ lộ trình cấp tốc 10 tuần, mình đã kịp lấy lại căn bản để ôn thi đại học. Các bài tập thực hành sát với đề thi thật giúp mình làm quen với áp lực phòng thi. Một khởi đầu hoàn hảo cho những ai muốn bứt phá giai đoạn cuối.",
                  name: "Nam Khánh (Lớp 12 - Cần Thơ)",
                  avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
                },
              ].map((testimonial, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:shadow-lg">
                  <div className="min-h-[180px] border-b border-border/50 p-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {testimonial.content}
                  </div>

                  <div className="flex items-center justify-between gap-4 p-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="font-semibold text-foreground">{testimonial.name}</span>
                    </div>

                    <button className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-yellow-400 hover:text-black">
                      Đọc toàn bộ câu chuyện
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
