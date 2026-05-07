import { Button } from "@/shared/components/ui/button";

const testimonials = [
  {
    id: 1,
    content: "Khóa học Toán 12 thực sự là cứu cánh cho mình. Trước đây mình rất sợ hình học không gian, nhưng nhờ cách giảng dạy bằng hình ảnh 3D của thầy, mình đã nắm chắc kiến thức và tự tin đạt điểm 9 trong kỳ thi học kỳ vừa rồi. Rất đề xuất cho các bạn đang mất gốc!",
    author: "Minh Anh (Lớp 12 - Hà Nội)",
    avatar: "https://i.pravatar.cc/150?u=1",
    isPrimaryButton: true
  },
  {
    id: 2,
    content: "Mình thích nhất là khóa luyện thi IELTS 6.5+. Các thầy cô không chỉ dạy kiến thức mà còn chia sẻ những mẹo làm bài rất thực tế. Chỉ sau 3 tháng, kỹ năng Speaking của mình đã cải thiện rõ rệt, mình không còn cảm thấy run khi giao tiếp nữa. Cảm ơn trung tâm rất nhiều!",
    author: "Đức Huy (Lớp 11 - TP. HCM)",
    avatar: "https://i.pravatar.cc/150?u=2",
    isPrimaryButton: false
  },
  {
    id: 3,
    content: "Lần đầu tiên mình thấy học Văn lại thú vị đến thế. Phương pháp sơ đồ tư duy giúp mình nhớ các tác phẩm rất nhanh mà không cần học vẹt. Bài viết của mình cũng được cô nhận xét là sâu sắc hơn và có cảm xúc hơn trước. Đây là khóa học xứng đáng nhất mình từng tham gia.",
    author: "Khánh Linh (Lớp 12 - Đà Nẵng)",
    avatar: "https://i.pravatar.cc/150?u=3",
    isPrimaryButton: false
  },
  {
    id: 4,
    content: "Dù bắt đầu học Lý khá muộn nhưng nhờ lộ trình cấp tốc 10 tuần, mình đã kịp lấy lại căn bản để ôn thi đại học. Các bài tập thực hành sát với đề thi thật giúp mình làm quen với áp lực phòng thi. Một khởi đầu hoàn hảo cho những ai muốn bứt phá giai đoạn cuối.",
    author: "Nam Khánh (Lớp 12 - Cần Thơ)",
    avatar: "https://i.pravatar.cc/150?u=4",
    isPrimaryButton: true
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50/50 dark:bg-muted/10 border-t border-border/40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground mb-4">
              Học Viên Nói Gì Về Chúng Tôi?
            </h2>
            <p className="text-muted-foreground text-base">
              Hàng ngàn học sinh THPT trên khắp cả nước đã bứt phá điểm số và đỗ vào ngôi trường đại học mơ ước nhờ lộ trình học tập tối ưu. Hãy lắng nghe những chia sẻ chân thật nhất từ chính các bạn ấy.
            </p>
          </div>
          <Button variant="outline" className="h-11 rounded-md shrink-0 border-border bg-white px-5 text-sm font-medium text-blue-700 transition-colors hover:bg-yellow-400 hover:text-black">
            Xem tất cả cảm nhận
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-background border border-border/50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <p className="text-foreground leading-relaxed text-sm sm:text-base mb-10">
                {testimonial.content}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-border/30 mt-auto">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-border">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">
                    {testimonial.author}
                  </span>
                </div>
                
                <Button 
                  variant={testimonial.isPrimaryButton ? "default" : "outline"}
                  className={`rounded-md h-12 px-6 text-base font-medium shrink-0 border-border bg-white text-blue-700 transition-colors hover:bg-yellow-400 hover:text-black ${testimonial.isPrimaryButton ? 'border-border bg-white text-blue-700 hover:bg-yellow-400 hover:text-black' : ''}`}
                >
                  Đọc toàn bộ câu chuyện
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
