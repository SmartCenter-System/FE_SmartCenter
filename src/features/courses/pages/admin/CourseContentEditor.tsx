import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  GripVertical,
  Save,
  Trash2
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { toast } from "sonner";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Badge } from "@/shared/components/ui/badge";

// Mock types
type LessonType = "VIDEO" | "DOCUMENT" | "QUIZ";

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  contentUrl?: string; // Youtube URL or Cloudinary URL
  duration?: string;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

// Mock initial data
const MOCK_CHAPTERS: Chapter[] = [
  {
    id: "ch-1",
    title: "Chuyên đề 1: Khảo sát hàm số",
    lessons: [
      { id: "ls-1", title: "Tính đơn điệu của hàm số", type: "VIDEO", contentUrl: "https://youtube.com/watch?v=123", duration: "45 phút" },
      { id: "ls-2", title: "Cực trị của hàm số", type: "VIDEO", contentUrl: "https://youtube.com/watch?v=456", duration: "60 phút" },
      { id: "ls-3", title: "Bài tập tự luyện Khảo sát hàm số", type: "QUIZ" },
    ]
  },
  {
    id: "ch-2",
    title: "Chuyên đề 2: Lũy thừa và Logarit",
    lessons: [
      { id: "ls-4", title: "Công thức Logarit cần nhớ", type: "DOCUMENT", contentUrl: "https://cloudinary.com/docs/logarit.pdf" },
    ]
  }
];

export default function CourseContentEditor() {
  const navigate = useNavigate();
  
  // TODO: Gọi API lấy dữ liệu nội dung khóa học theo id (useQuery)
  // const { data: chapters } = useQuery(...)
  const [chapters, setChapters] = useState<Chapter[]>(MOCK_CHAPTERS);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);

  // Form state for lesson
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<LessonType>("VIDEO");
  const [lessonUrl, setLessonUrl] = useState("");

  const handleSelectLesson = (_chapter: Chapter, lesson: Lesson) => {
    setActiveChapter(null);
    setActiveLesson(lesson);
    setLessonTitle(lesson.title);
    setLessonType(lesson.type);
    setLessonUrl(lesson.contentUrl || "");
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setActiveLesson(null);
    setActiveChapter(chapter);
  };

  const handleSaveLesson = () => {
    if (!activeLesson) return;
    
    // TODO: Gọi API cập nhật bài giảng (useMutation -> put /lessons/:id)
    // Update local state (Mock logic)
    const updatedChapters = chapters.map(ch => ({
      ...ch,
      lessons: ch.lessons.map(ls => ls.id === activeLesson.id ? {
        ...ls,
        title: lessonTitle,
        type: lessonType,
        contentUrl: lessonUrl
      } : ls)
    }));
    
    setChapters(updatedChapters);
    toast.success("Lưu bài giảng thành công!");
  };

  const handleAddChapter = () => {
    // TODO: Gọi API tạo chương mới (useMutation -> post /chapters)
    const newChapter: Chapter = {
      id: `ch-${Date.now()}`,
      title: "Chương mới",
      lessons: []
    };
    setChapters([...chapters, newChapter]);
    handleSelectChapter(newChapter);
  };

  const handleAddLesson = (chapterId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion toggle
    
    // TODO: Gọi API tạo bài giảng mới thuộc chapterId (useMutation -> post /chapters/:chapterId/lessons)
    const newLesson: Lesson = {
      id: `ls-${Date.now()}`,
      title: "Bài giảng mới",
      type: "VIDEO"
    };

    const updatedChapters = chapters.map(ch => 
      ch.id === chapterId 
        ? { ...ch, lessons: [...ch.lessons, newLesson] } 
        : ch
    );
    
    setChapters(updatedChapters);
    toast.success("Đã thêm bài giảng mới!");
  };

  const getIconForType = (type: LessonType) => {
    switch (type) {
      case "VIDEO": return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case "DOCUMENT": return <FileText className="h-4 w-4 text-orange-500" />;
      case "QUIZ": return <HelpCircle className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cấu trúc Chương trình</h1>
            <p className="text-muted-foreground text-sm">
              Sắp xếp và quản lý các video, tài liệu, bài tập cho khóa học.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Hủy</Button>
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Xuất bản (Publish)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Curriculum Tree */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Nội dung ({chapters.length} chương)</h2>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-primary" onClick={handleAddChapter}>
              <Plus className="h-4 w-4 mr-1" /> Thêm chương
            </Button>
          </div>

          <div className="bg-card border rounded-lg overflow-hidden">
            <Accordion type="multiple" defaultValue={["ch-1", "ch-2"]} className="w-full">
              {chapters.map((chapter) => (
                <AccordionItem key={chapter.id} value={chapter.id} className="border-b last:border-0">
                  <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 data-[state=open]:bg-muted/20">
                    <div className="flex items-center justify-between w-full pr-4" onClick={() => handleSelectChapter(chapter)}>
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <span className="font-semibold text-sm text-left">{chapter.title}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-auto hover:bg-background"
                        onClick={(e) => handleAddLesson(chapter.id, e)}
                      >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="pt-0 pb-2 px-2 bg-muted/10">
                    {chapter.lessons.length === 0 ? (
                      <div className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded mt-2">
                        Chưa có bài giảng nào
                      </div>
                    ) : (
                      <ul className="space-y-1 mt-2">
                        {chapter.lessons.map((lesson) => (
                          <li key={lesson.id}>
                            <button
                              onClick={() => handleSelectLesson(chapter, lesson)}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors text-left
                                ${activeLesson?.id === lesson.id 
                                  ? 'bg-primary/10 text-primary font-medium border border-primary/20' 
                                  : 'hover:bg-muted text-foreground'
                                }
                              `}
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                {getIconForType(lesson.type)}
                                <span className="truncate">{lesson.title}</span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Right Column: Editor Workspace */}
        <div className="lg:col-span-8 xl:col-span-9">
          
          {/* No Selection State */}
          {!activeLesson && !activeChapter && (
            <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-xl bg-muted/20">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <PlayCircle className="h-8 w-8 text-primary opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Chọn bài giảng để chỉnh sửa</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
                Bấm vào một chương hoặc bài giảng ở danh sách bên trái để thêm nội dung video, tài liệu hoặc bài tập.
              </p>
            </div>
          )}

          {/* Chapter Editor */}
          {activeChapter && !activeLesson && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Chỉnh sửa Chương</CardTitle>
                    <CardDescription>Cập nhật tiêu đề chương</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" /> Xóa chương
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tên chương</Label>
                  <Input defaultValue={activeChapter.title} />
                </div>
                <Button>Cập nhật chương</Button>
              </CardContent>
            </Card>
          )}

          {/* Lesson Editor */}
          {activeLesson && (
            <Card className="shadow-md border-border/60">
              <CardHeader className="bg-muted/30 border-b pb-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="bg-background">ID: {activeLesson.id}</Badge>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-2xl">{lessonTitle || "Bài giảng không tên"}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                
                <div className="space-y-3">
                  <Label className="text-base">Tên bài giảng / Bài tập</Label>
                  <Input 
                    value={lessonTitle} 
                    onChange={(e) => setLessonTitle(e.target.value)} 
                    className="text-lg py-6"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base">Loại nội dung</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all
                        ${lessonType === "VIDEO" ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:bg-muted'}
                      `}
                      onClick={() => setLessonType("VIDEO")}
                    >
                      <PlayCircle className={`h-8 w-8 ${lessonType === "VIDEO" ? 'text-blue-500' : 'text-muted-foreground'}`} />
                      <span className="font-medium text-sm">Video (Youtube)</span>
                    </div>
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all
                        ${lessonType === "DOCUMENT" ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:bg-muted'}
                      `}
                      onClick={() => setLessonType("DOCUMENT")}
                    >
                      <FileText className={`h-8 w-8 ${lessonType === "DOCUMENT" ? 'text-orange-500' : 'text-muted-foreground'}`} />
                      <span className="font-medium text-sm">Tài liệu (PDF)</span>
                    </div>
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all
                        ${lessonType === "QUIZ" ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:bg-muted'}
                      `}
                      onClick={() => setLessonType("QUIZ")}
                    >
                      <HelpCircle className={`h-8 w-8 ${lessonType === "QUIZ" ? 'text-purple-500' : 'text-muted-foreground'}`} />
                      <span className="font-medium text-sm">Bài tập / Bài thi</span>
                    </div>
                  </div>
                </div>

                {lessonType === "VIDEO" && (
                  <div className="space-y-4 p-5 bg-blue-50/50 rounded-lg border border-blue-100">
                    <Label className="text-base text-blue-900">Liên kết Video Youtube</Label>
                    <Input 
                      placeholder="VD: https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                      value={lessonUrl}
                      onChange={(e) => setLessonUrl(e.target.value)}
                    />
                    {lessonUrl && lessonUrl.includes("youtube.com") && (
                      <div className="aspect-video w-full max-w-xl mx-auto bg-black rounded-lg mt-4 flex items-center justify-center overflow-hidden">
                        {/* Fake Youtube Iframe Preview */}
                        <div className="text-white flex flex-col items-center">
                          <PlayCircle className="h-12 w-12 text-red-600 mb-2" />
                          <span className="text-sm">Bản xem trước Video</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {lessonType === "DOCUMENT" && (
                  <div className="space-y-4 p-5 bg-orange-50/50 rounded-lg border border-orange-100">
                    <Label className="text-base text-orange-900">Tải lên Tài liệu (PDF, Word)</Label>
                    <div className="border-2 border-dashed border-orange-200 rounded-lg p-10 flex flex-col items-center justify-center text-center bg-white">
                      <FileText className="h-10 w-10 text-orange-400 mb-4" />
                      <p className="font-medium text-orange-900">Kéo thả file vào đây hoặc bấm để chọn file</p>
                      <p className="text-sm text-orange-600/70 mt-1">Hỗ trợ PDF, DOCX (Tối đa 50MB)</p>
                      <Button variant="outline" className="mt-6 border-orange-200 text-orange-700 hover:bg-orange-50">
                        Chọn file từ máy tính
                      </Button>
                    </div>
                  </div>
                )}

                {lessonType === "QUIZ" && (
                  <div className="space-y-4 p-5 bg-purple-50/50 rounded-lg border border-purple-100 flex flex-col items-center justify-center text-center py-12">
                    <HelpCircle className="h-16 w-16 text-purple-400 mb-4" />
                    <h3 className="text-lg font-bold text-purple-900">Trình soạn thảo Bài Tập / Bài Thi</h3>
                    <p className="text-purple-700 max-w-md mx-auto mb-6">
                      Bạn sẽ được chuyển đến giao diện Quản lý Đánh giá để soạn thảo câu hỏi trắc nghiệm, tự luận và thiết lập chấm điểm.
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Mở Trình Soạn Thảo Đề Thi
                    </Button>
                  </div>
                )}

                <div className="pt-6 flex justify-end gap-3 border-t">
                  <Button variant="outline" onClick={() => handleSelectLesson(chapters[0], activeLesson)}>Hủy thay đổi</Button>
                  <Button onClick={handleSaveLesson} className="flex items-center gap-2">
                    <Save className="h-4 w-4" /> Lưu thông tin
                  </Button>
                </div>

              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
