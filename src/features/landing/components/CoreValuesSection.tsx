import { ValueCard } from "./ValueCard";

const coreValues = [
  {
    number: "01",
    title: "Lịch học linh hoạt",
    description: "Học mọi lúc, mọi nơi trên mọi thiết bị. Phù hợp với lịch học dày đặc trên trường của học sinh cấp 3."
  },
  {
    number: "02",
    title: "Đội ngũ giáo viên giỏi",
    description: "Được dẫn dắt bởi các thầy cô có nhiều năm kinh nghiệm ôn thi đại học và có phương pháp truyền đạt dễ hiểu, sinh động."
  },
  {
    number: "03",
    title: "Kho tài liệu phong phú",
    description: "Hơn 1000+ bộ đề thi thử, file tóm tắt công thức và sơ đồ tư duy được cập nhật liên tục hàng tuần."
  },
  {
    number: "04",
    title: "Chương trình bám sát thực tế",
    description: "Nội dung bài giảng luôn cập nhật theo cấu trúc đề thi mới nhất của Bộ Giáo dục, tập trung vào các dạng bài trọng tâm."
  },
  {
    number: "05",
    title: "Luyện tập & Kiểm tra",
    description: "Hệ thống bài tập tự luyện có chấm điểm tự động và lời giải chi tiết, giúp bạn nhận ra lỗi sai ngay lập tức."
  },
  {
    number: "06",
    title: "Cộng đồng học tập năng động",
    description: "Tham gia nhóm học tập để cùng trao đổi bài, chia sẻ kinh nghiệm ôn thi và giải tỏa áp lực cùng bạn bè đồng lứa."
  }
];

export function CoreValuesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Những Giá Trị Bạn Sẽ Nhận Được
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
            Smart Center cam kết mang lại môi trường học tập toàn diện, phát triển kỹ năng và tư duy.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {coreValues.map((value, i) => (
            <div 
              key={value.number} 
              className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <ValueCard
                number={value.number}
                title={value.title}
                description={value.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
