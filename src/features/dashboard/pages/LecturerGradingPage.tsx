import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Save, 
  FileText,
  Loader2
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { useGradeExam } from "@/features/courses/hooks/useExams";

import { Badge } from "@/shared/components/ui/badge";
import { Label } from "@/shared/components/ui/label";

export default function LecturerGradingPage() {
  const { examId, studentId } = useParams();
  const navigate = useNavigate();
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState("");

  const { data: submission, isLoading } = useQuery({
    queryKey: ["exam-submission", examId, studentId],
    queryFn: async () => {
      // Mocking submission details for demo
      return {
        studentName: "Nguyễn Văn A",
        examTitle: "Bài kiểm tra cuối chương 1",
        submittedAt: new Date().toISOString(),
        answers: [
          { question: "React là gì?", studentAnswer: "React là thư viện JavaScript để xây dựng UI.", isCorrect: true, score: 2 },
          { question: "Tại sao nên dùng React?", studentAnswer: "Vì nó nhanh và dễ dùng.", isCorrect: true, score: 2 },
          { question: "Essay: Ưu điểm của Hooks?", studentAnswer: "Hooks giúp tái sử dụng logic mà không cần class...", isCorrect: null, score: null },
        ]
      };
    },
    enabled: !!examId && !!studentId,
  });

  const gradeMutation = useGradeExam();

  const handleGrade = () => {
    gradeMutation.mutate({
      examId: examId!,
      studentId: studentId!,
      gradeDetails: [
        {
          examManagementDetailId: "some-id", // Should come from submission
          point: grade,
          feedback: feedback
        }
      ]
    }, {
      onSuccess: () => {
        navigate(-1);
      }
    });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-black">Chấm điểm bài làm</h1>
          <p className="text-muted-foreground">Học viên: {submission?.studentName} - Đề: {submission?.examTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {submission?.answers.map((ans: any, i: number) => (
            <Card key={i} className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b py-4">
                <CardTitle className="text-sm font-bold">Câu hỏi {i + 1}</CardTitle>
                <CardDescription>{ans.question}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-4 bg-muted/20 rounded-xl border border-border/50 italic text-sm">
                  "{ans.studentAnswer}"
                </div>
                <div className="mt-4 flex items-center justify-between">
                  {ans.isCorrect !== null ? (
                    <Badge className={ans.isCorrect ? "bg-emerald-500" : "bg-red-500"}>
                      {ans.isCorrect ? "Tự động: Đúng" : "Tự động: Sai"} (+{ans.score}đ)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                      Cần chấm điểm thủ công
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-primary/5 border border-primary/10 sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Tổng kết chấm điểm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold">Điểm tổng kết (10đ)</Label>
                <Input 
                  type="number" 
                  max={10} 
                  min={0} 
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="h-12 text-2xl font-black text-center text-primary rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold">Nhận xét của giảng viên</Label>
                <Textarea 
                  placeholder="Nhập lời khuyên hoặc nhận xét..." 
                  className="min-h-[150px] rounded-xl resize-none"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
              <Button 
                className="w-full h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
                onClick={handleGrade}
                disabled={gradeMutation.isPending}
              >
                {gradeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Xác nhận chấm điểm
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
