import { useState } from "react";
import { Plus, Users, Calendar, UserCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { Class } from "../schema";

// Dummy data for lecturers and classes
const DUMMY_LECTURERS = [
  { id: "lec-1", name: "Nguyễn Văn A" },
  { id: "lec-2", name: "Trần Thị B" },
];

const DUMMY_CLASSES: Class[] = [
  {
    id: "class-1",
    courseId: "course-1",
    className: "Lớp K1 - Tối 2-4-6",
    lecturerId: "lec-1",
    maxStudents: 30,
    enrollmentDeadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    status: "OPEN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

interface ClassManagementProps {
  courseId: string;
}

export function ClassManagement({ courseId }: ClassManagementProps) {
  const [classes] = useState<Class[]>(DUMMY_CLASSES.filter(c => c.courseId === courseId || courseId === '1')); // Demo filter
  
  return (
    <Card className="mt-8 border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Danh sách Lớp học (Niên khóa)</CardTitle>
          <CardDescription>Quản lý các lớp học, phân công giảng viên và hạn đăng ký.</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Thêm Lớp Mới
        </Button>
      </CardHeader>
      <CardContent>
        {classes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            Chưa có lớp học nào cho khóa này.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => {
              const lecturer = DUMMY_LECTURERS.find(l => l.id === cls.lecturerId);
              return (
                <Card key={cls.id} className="bg-muted/30">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">{cls.className}</h3>
                      <Badge variant={cls.status === "OPEN" ? "default" : "secondary"}>
                        {cls.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        <span>GV: {lecturer?.name || "Chưa phân công"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Sĩ số tối đa: {cls.maxStudents}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Hạn ĐK: {new Date(cls.enrollmentDeadline).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Button variant="outline" size="sm" className="w-full">Sửa</Button>
                      <Button variant="destructive" size="sm" className="w-full">Xóa</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
