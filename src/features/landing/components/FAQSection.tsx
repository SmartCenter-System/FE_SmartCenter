import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    id: 1,
    question: "Tôi có thể đăng ký nhiều khóa học cùng lúc không",
    answer: "Chắc chắn rồi! Mỗi khóa học đều có các bài giảng miễn phí để bạn trải nghiệm phương pháp giảng dạy trước khi quyết định. Bạn hoàn toàn có thể đăng ký nhiều khóa học nếu sắp xếp được thời gian."
  },
  {
    id: 2,
    question: "Tôi sẽ nhận được sự hỗ trợ nào từ giáo viên?",
    answer: "Giáo viên và trợ giảng sẽ giải đáp thắc mắc qua group lớp hoặc hệ thống chat trực tiếp. Bạn cũng có các buổi live Q&A hàng tuần để trực tiếp hỏi đáp."
  },
  {
    id: 3,
    question: "Khóa học là tự học theo tiến độ cá nhân hay có ngày bắt đầu và kết thúc cụ thể?",
    answer: "Các bài giảng video đã được ghi hình sẵn giúp bạn linh hoạt thời gian. Tuy nhiên, lộ trình bài tập và kiểm tra định kỳ sẽ có deadline để đảm bảo bạn bám sát mục tiêu."
  },
  {
    id: 4,
    question: "Có yêu cầu điều kiện tiên quyết nào để tham gia các khóa học không?",
    answer: "Đa phần các khóa học đều có hướng dẫn từ cơ bản. Với các khóa nâng cao, bạn nên vượt qua bài test đầu vào để đảm bảo theo kịp chương trình."
  },
  {
    id: 5,
    question: "Tôi có thể tải tài liệu khóa học về để xem ngoại tuyến không?",
    answer: "Tất cả tài liệu PDF, bài tập và sơ đồ tư duy đều có thể tải về. Tuy nhiên, video bài giảng chỉ có thể xem trực tuyến trên hệ thống để bảo vệ bản quyền."
  }
];

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
          
          {/* Left Column */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
              Những câu hỏi thường gặp
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Bạn vẫn còn băn khoăn? Đừng ngần ngại liên hệ với đội ngũ tư vấn qua email hoặc hotline để được hỗ trợ nhanh nhất.
            </p>
            <Button variant="outline" className="rounded-md font-medium px-6 py-6 h-auto mt-4">
              Xem tất cả câu hỏi
            </Button>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              
              return (
                <div 
                  key={faq.id} 
                  className={cn(
                    "border border-border/50 rounded-2xl overflow-hidden transition-all duration-300",
                    isOpen ? "bg-card shadow-sm" : "bg-transparent hover:border-primary/30"
                  )}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="font-semibold text-foreground text-lg pr-8">
                      {faq.question}
                    </span>
                    <div 
                      className={cn(
                        "shrink-0 flex items-center justify-center w-10 h-10 rounded-md transition-colors",
                        isOpen ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </div>
                  </button>
                  
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="p-6 pt-0 text-muted-foreground leading-relaxed border-t border-border/30 mx-6">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
}
