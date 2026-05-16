import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  PlayCircle,
  FileText,
  HelpCircle,
  GripVertical,
  Save,
  Trash2,
  Loader2,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { useExams, useCreateExam } from "@/features/courses/hooks/useExams";
import {
  useSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  useLessons,
} from "@/features/courses/hooks/useCourseContent";

// types
type LessonType = "VIDEO" | "DOCUMENT" | "QUIZ";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  order: number;
  isPreview: boolean;
  duration: number;
  type?: LessonType; // Inferred or optional
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function CourseContentEditor() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState<LessonType>("VIDEO");
  const [editUrl, setEditUrl] = useState("");

  // Dialog state
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<LessonType>("VIDEO");
  const [newUrl, setNewUrl] = useState("");
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);

  // Exam state
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
  const [examTitle, setExamTitle] = useState("");
  const [examDuration, setExamDuration] = useState(60);
  const [examPoints, setExamPoints] = useState(10);

  const { data: rawSections, isLoading: isLoadingSections } = useSections(courseId!);

  // Normalize sections data
  const sections: Section[] = (Array.isArray(rawSections) ? rawSections : (rawSections as any)?.data || []).map(
    (s: any) => ({
      id: s.id || s.sectionId,
      title: s.title,
      lessons: [], // Lessons will be fetched dynamically per section
    }),
  );

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeSection, setActiveSection] = useState<Section | null>(null);

  const { data: exams } = useExams(courseId!);
  const currentLessonExam = ((exams as unknown as any[]) || [])?.find((e) => e.lessonId === activeLesson?.id);
  const createExamMutation = useCreateExam();

  const createSectionMutation = useCreateSection();
  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();

  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();

  const handleSelectLesson = (section: Section, lesson: Lesson) => {
    setActiveSection(section);
    setActiveLesson(lesson);
    setEditTitle(lesson.title);
    setEditDescription(lesson.description || "");
    setEditType(lesson.type || "VIDEO");
    setEditUrl(lesson.videoUrl || "");
  };

  const handleSelectSection = (section: Section) => {
    setActiveLesson(null);
    setActiveSection(section);
    setEditTitle(section.title);
  };

  const handleSaveLesson = () => {
    if (!activeLesson || !activeSection) return;
    updateLessonMutation.mutate({
      lessonId: activeLesson.id,
      courseId: courseId!,
      sectionId: activeSection.id,
      data: {
        title: editTitle,
        videoUrl: editUrl,
        description: editDescription,
      },
    });
  };

  const handleAddSection = () => {
    setNewTitle("");
    setIsSectionDialogOpen(true);
  };

  const handleConfirmAddSection = async () => {
    if (!courseId) return;
    if (newTitle.trim()) {
      createSectionMutation.mutate(
        { courseId, title: newTitle },
        {
          onSuccess: () => {
            setIsSectionDialogOpen(false);
            setNewTitle("");
          },
        },
      );
    }
  };

  const handleAddLesson = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNewTitle("");
    setNewType("VIDEO");
    setNewUrl("");
    setTargetSectionId(sectionId);
    setIsLessonDialogOpen(true);
  };

  const handleConfirmAddLesson = async () => {
    if (newTitle.trim() && targetSectionId) {
      createLessonMutation.mutate(
        {
          courseId: courseId!,
          sectionId: targetSectionId,
          data: {
            title: newTitle,
            videoUrl: newUrl || "https://youtube.com/watch?v=placeholder",
            description: "",
            order: 0,
          },
        },
        {
          onSuccess: () => {
            setIsLessonDialogOpen(false);
            setNewTitle("");
            setNewUrl("");
          },
        },
      );
    }
  };

  const getIconForType = (type: LessonType) => {
    switch (type) {
      case "VIDEO":
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case "DOCUMENT":
        return <FileText className="h-4 w-4 text-orange-500" />;
      case "QUIZ":
        return <HelpCircle className="h-4 w-4 text-purple-500" />;
    }
  };

  // Sub-component for rendering lessons of a section
  const LessonList = ({ section }: { section: Section }) => {
    const { data: lessons, isLoading } = useLessons(courseId!, section.id);

    if (isLoading)
      return (
        <div className="py-4 text-center">
          <Loader2 className="h-4 w-4 animate-spin inline mr-2 text-primary/60" />
          <span className="text-xs text-muted-foreground">Đang tải bài giảng...</span>
        </div>
      );

    const items = Array.isArray(lessons) ? lessons : [];

    if (items.length === 0)
      return (
        <div className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded mt-2">
          Chưa có bài giảng nào
        </div>
      );

    return (
      <ul className="space-y-1 mt-2">
        {items.map((lesson: any) => {
          // Infer type if missing
          const lessonType = lesson.type || (lesson.videoUrl ? "VIDEO" : "DOCUMENT");
          
          return (
            <li key={lesson.id}>
              <button
                onClick={() => handleSelectLesson(section, { ...lesson, type: lessonType })}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors text-left
                  ${
                    activeLesson?.id === lesson.id
                      ? "bg-primary/10 text-primary font-medium border border-primary/20"
                      : "hover:bg-muted text-foreground"
                  }
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {getIconForType(lessonType as LessonType)}
                  <span className="truncate">{lesson.title}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    );
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
          <Button variant="outline" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button className="flex items-center gap-2" disabled>
            <Save className="h-4 w-4" /> Đã lưu tự động
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Curriculum Tree */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Nội dung ({sections.length} chương)</h2>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-primary" onClick={handleAddSection}>
              <Plus className="h-4 w-4 mr-1" /> Thêm chương
            </Button>
          </div>

          <div className="bg-card border rounded-lg overflow-hidden min-h-[400px]">
            {isLoadingSections ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : sections.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Chưa có nội dung. Bấm "Thêm chương" để bắt đầu.
              </div>
            ) : (
              <Accordion type="multiple" defaultValue={[sections[0]?.id]} className="w-full">
                {sections.map((section) => (
                  <AccordionItem key={section.id} value={section.id} className="border-b last:border-0">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 data-[state=open]:bg-muted/20">
                      <div
                        className="flex items-center justify-between w-full pr-4"
                        onClick={() => handleSelectSection(section)}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                          <span className="font-semibold text-sm text-left">{section.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-auto hover:bg-background"
                          onClick={(e) => handleAddLesson(section.id, e)}
                        >
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-0 pb-2 px-2 bg-muted/10">
                      <LessonList section={section} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>

        {/* Right Column: Editor Workspace */}
        <div className="lg:col-span-8 xl:col-span-9">
          {/* No Selection State */}
          {!activeLesson && !activeSection && (
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

          {/* Section Editor */}
          {activeSection && !activeLesson && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Chỉnh sửa Chương</CardTitle>
                    <CardDescription>Cập nhật tiêu đề chương</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      if (confirm("Xóa chương này sẽ xóa tất cả bài giảng bên trong. Bạn chắc chứ?")) {
                        deleteSectionMutation.mutate({ sectionId: activeSection.id, courseId: courseId! });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Xóa chương
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tên chương</Label>
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                </div>
                <Button
                  onClick={() =>
                    updateSectionMutation.mutate({ sectionId: activeSection.id, courseId: courseId!, title: editTitle })
                  }
                  disabled={updateSectionMutation.isPending}
                >
                  {updateSectionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cập nhật chương
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Lesson Editor */}
          {activeLesson && activeSection && (
            <Card className="shadow-md border-border/60">
              <CardHeader className="bg-muted/30 border-b pb-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="bg-background uppercase">
                    LOẠI: {activeLesson.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => {
                      if (confirm("Bạn có chắc muốn xóa bài giảng này?")) {
                        deleteLessonMutation.mutate({
                          lessonId: activeLesson.id,
                          courseId: courseId!,
                          sectionId: activeSection.id,
                        });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-2xl">{editTitle || "Bài giảng không tên"}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <div className="space-y-3">
                  <Label className="text-base">Tên bài giảng / Bài tập</Label>
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="text-lg py-6" />
                </div>

                <div className="space-y-3">
                  <Label className="text-base">Mô tả bài giảng</Label>
                  <Input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Mô tả nội dung bài học..."
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base">Loại nội dung</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all
                        ${editType === "VIDEO" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:bg-muted"}
                      `}
                      onClick={() => setEditType("VIDEO")}
                    >
                      <PlayCircle
                        className={`h-8 w-8 ${editType === "VIDEO" ? "text-blue-500" : "text-muted-foreground"}`}
                      />
                      <span className="font-medium text-sm">Video (Youtube)</span>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all
                        ${editType === "DOCUMENT" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:bg-muted"}
                      `}
                      onClick={() => setEditType("DOCUMENT")}
                    >
                      <FileText
                        className={`h-8 w-8 ${editType === "DOCUMENT" ? "text-orange-500" : "text-muted-foreground"}`}
                      />
                      <span className="font-medium text-sm">Tài liệu (PDF)</span>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all
                        ${editType === "QUIZ" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:bg-muted"}
                      `}
                      onClick={() => setEditType("QUIZ")}
                    >
                      <HelpCircle
                        className={`h-8 w-8 ${editType === "QUIZ" ? "text-purple-500" : "text-muted-foreground"}`}
                      />
                      <span className="font-medium text-sm">Bài tập / Bài thi</span>
                    </div>
                  </div>
                </div>

                {editType === "VIDEO" && (
                  <div className="space-y-4 p-5 bg-blue-50/50 rounded-lg border border-blue-100">
                    <Label className="text-base text-blue-900">Liên kết Video Youtube</Label>
                    <Input
                      placeholder="VD: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                    />
                  </div>
                )}

                {editType === "DOCUMENT" && (
                  <div className="space-y-4 p-5 bg-orange-50/50 rounded-lg border border-orange-100">
                    <Label className="text-base text-orange-900">Liên kết Tài liệu (PDF, Word)</Label>
                    <Input
                      placeholder="Nhập link tài liệu (Cloudinary/Google Drive...)"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                    />
                  </div>
                )}

                {editType === "QUIZ" && (
                  <div className="space-y-4 p-5 bg-purple-50/50 rounded-lg border border-purple-100 flex flex-col items-center justify-center text-center py-12">
                    <HelpCircle className="h-16 w-16 text-purple-400 mb-4" />
                    <h3 className="text-lg font-bold text-purple-900">Trình soạn thảo Bài Tập / Bài Thi</h3>

                    {currentLessonExam ? (
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm text-left">
                          <p className="font-bold text-purple-900">{currentLessonExam.title}</p>
                          <div className="flex gap-4 mt-2 text-sm text-purple-700">
                            <span>Thời gian: {currentLessonExam.countDown} phút</span>
                            <span>Tổng điểm: {currentLessonExam.totalPoints}</span>
                          </div>
                        </div>
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                          onClick={() => toast.info("Tính năng chỉnh sửa câu hỏi chi tiết đang mở...")}
                        >
                          Chỉnh sửa câu hỏi
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-purple-700 max-w-md mx-auto mb-6">
                          Chưa có đề thi cho bài tập này. Hãy tạo mới để bắt đầu thêm câu hỏi.
                        </p>
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => {
                            setExamTitle(`Đề thi: ${editTitle}`);
                            setIsExamDialogOpen(true);
                          }}
                        >
                          Tạo Đề Thi Mới
                        </Button>
                      </>
                    )}
                  </div>
                )}

                <div className="pt-6 flex justify-end gap-3 border-t">
                  <Button variant="outline" onClick={() => handleSelectLesson(activeSection, activeLesson)}>
                    Hủy thay đổi
                  </Button>
                  <Button
                    onClick={handleSaveLesson}
                    className="flex items-center gap-2"
                    disabled={updateLessonMutation.isPending}
                  >
                    {updateLessonMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Lưu thông tin
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Section Dialog */}
      <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Thêm chương mới</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="section-title">Tiêu đề chương</Label>
              <Input
                id="section-title"
                placeholder="VD: Giới thiệu khóa học"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSectionDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmAddSection} disabled={!newTitle.trim() || createSectionMutation.isPending}>
              Thêm chương
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Lesson Dialog */}
      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Thêm bài giảng mới</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="lesson-title">Tiêu đề bài giảng</Label>
              <Input
                id="lesson-title"
                placeholder="VD: Cài đặt môi trường"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <Label>Loại bài giảng</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant={newType === "VIDEO" ? "default" : "outline"}
                  className="flex flex-col h-auto py-3 gap-1"
                  onClick={() => setNewType("VIDEO")}
                >
                  <PlayCircle className="h-5 w-5" />
                  <span className="text-xs">Video</span>
                </Button>
                <Button
                  type="button"
                  variant={newType === "DOCUMENT" ? "default" : "outline"}
                  className="flex flex-col h-auto py-3 gap-1"
                  onClick={() => setNewType("DOCUMENT")}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Tài liệu</span>
                </Button>
                <Button
                  type="button"
                  variant={newType === "QUIZ" ? "default" : "outline"}
                  className="flex flex-col h-auto py-3 gap-1"
                  onClick={() => setNewType("QUIZ")}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span className="text-xs">Quiz</span>
                </Button>
              </div>
            </div>

            {newType !== "QUIZ" && (
              <div className="space-y-2">
                <Label htmlFor="lesson-url">{newType === "VIDEO" ? "Link Youtube" : "Link Tài liệu"}</Label>
                <Input
                  id="lesson-url"
                  placeholder={newType === "VIDEO" ? "https://youtube.com/..." : "https://..."}
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsLessonDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmAddLesson} disabled={!newTitle.trim()}>
              Thêm bài giảng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Add Exam Dialog */}
      <Dialog open={isExamDialogOpen} onOpenChange={setIsExamDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Cấu hình Đề Thi</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề đề thi</Label>
              <Input value={examTitle} onChange={(e) => setExamTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Thời gian (phút)</Label>
                <Input type="number" value={examDuration} onChange={(e) => setExamDuration(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Tổng điểm</Label>
                <Input type="number" value={examPoints} onChange={(e) => setExamPoints(Number(e.target.value))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsExamDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (!activeLesson?.id) return;
                createExamMutation.mutate({
                  title: examTitle,
                  countDown: examDuration,
                  totalPoints: examPoints,
                  lessonId: activeLesson.id,
                });
              }}
              disabled={!examTitle.trim() || createExamMutation.isPending}
            >
              Xác nhận tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
