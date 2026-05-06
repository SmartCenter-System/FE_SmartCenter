import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, ListVideo } from "lucide-react";
import type { Course } from "../type";

interface CourseTableProps {
  courses: Course[];
  isLoading: boolean;
}

export function CourseTable({ courses, isLoading }: CourseTableProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</div>;
  }

  if (courses.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">Không tìm thấy khóa học nào.</div>;
  }

  const getFormatBadgeColor = (format: string) => {
    return format === "ONLINE" ? "default" : "secondary";
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "default";
      case "DRAFT":
        return "secondary";
      case "ARCHIVED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên khóa học</TableHead>
            <TableHead>Hình thức</TableHead>
            <TableHead>Cấp độ</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Giá (VNĐ)</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>
                <Badge variant={getFormatBadgeColor(course.format)}>{course.format}</Badge>
              </TableCell>
              <TableCell>{course.level}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeColor(course.status)}>{course.status}</Badge>
              </TableCell>
              <TableCell className="text-right">{new Intl.NumberFormat("vi-VN").format(course.price)} đ</TableCell>
              <TableCell className="text-right space-x-2">
                <Link to={`/admin/courses/${course.id}/edit`}>
                  <Button variant="outline" size="icon" className="h-8 w-8" title="Chỉnh sửa chung">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to={`/admin/courses/${course.id}/content`}>
                  <Button variant="default" size="icon" className="h-8 w-8 bg-blue-600 hover:bg-blue-700" title="Quản lý nội dung">
                    <ListVideo className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
