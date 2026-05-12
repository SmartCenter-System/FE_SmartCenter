import { Badge } from "@/shared/components/ui/badge";

export interface EnrollmentTableItem {
  courseId?: string;
  courseName: string;
  courseType: number;
  progress?: number;
}

interface EnrollmentTableProps {
  items: EnrollmentTableItem[];
}

export function EnrollmentTable({ items }: EnrollmentTableProps) {
  if (items.length === 0) {
    return <div className="rounded-lg border p-6 text-sm text-muted-foreground">Chưa có dữ liệu ghi danh.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="px-4 py-3 text-left font-semibold">Khóa học</th>
            <th className="px-4 py-3 text-left font-semibold">Hình thức</th>
            <th className="px-4 py-3 text-right font-semibold">Tiến độ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.courseId ?? item.courseName}-${index}`} className="border-b last:border-b-0">
              <td className="px-4 py-3">{item.courseName}</td>
              <td className="px-4 py-3">
                <Badge variant="outline">{item.courseType === 1 ? "Online" : "Offline"}</Badge>
              </td>
              <td className="px-4 py-3 text-right">{item.progress ?? 0}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
