import { useQuery } from "@tanstack/react-query";
import { FileText, Download, ExternalLink, FileArchive } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { documentService } from "@/features/document/service";

type LessonDocumentsProps = {
  lessonId?: string;
  enabled?: boolean;
};

function getDocumentIcon(fileType?: string) {
  const type = String(fileType ?? "").toUpperCase();

  if (type === "PDF") return FileText;
  if (type === "PPT" || type === "PPTX") return FileArchive;
  return FileText;
}

export function LessonDocuments({ lessonId, enabled = true }: LessonDocumentsProps) {
  const { data: documents, isLoading } = useQuery({
    queryKey: ["lessonDocuments", lessonId],
    queryFn: () => documentService.getByLesson(lessonId as string),
    enabled: enabled && Boolean(lessonId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  if (!enabled) return null;

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Tài liệu bài học</h2>
            <p className="text-sm text-muted-foreground">File đính kèm cho bài học này</p>
          </div>
          {isLoading ? <span className="text-sm text-muted-foreground">Đang tải...</span> : null}
        </div>

        {!isLoading && (!documents || documents.length === 0) ? (
          <p className="text-sm text-muted-foreground">Bài học này chưa có tài liệu đính kèm.</p>
        ) : null}

        {!isLoading && documents && documents.length > 0 ? (
          <ul className="space-y-3">
            {documents.map((document) => {
              const Icon = getDocumentIcon(document.fileType);

              return (
                <li
                  key={document.documentId}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{document.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {document.fileType ? `${document.fileType} · ` : ""}
                        {document.createdAt ? new Date(document.createdAt).toLocaleDateString("vi-VN") : "Tài liệu đính kèm"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Xem file
                    </a>
                    <a
                      href={document.fileUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <Download className="h-4 w-4" />
                      Tải xuống
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}