import { useState, useMemo } from "react";
import { CourseTable } from "@/features/courses/components/CourseTable";
import { CourseFilter } from "@/features/courses/components/CourseFilter";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import type { CourseFormat } from "@/features/courses";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/courses/services";

const ITEMS_PER_PAGE = 3;

export default function CourseManagementPage() {
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState<CourseFormat | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-courses", { search, format }],
    queryFn: () => courseService.getCourses({ 
      search, 
      format: format === "ALL" ? undefined : format 
    }),
  });

  const filteredCourses = data?.data || [];
  const totalCourses = data?.total || 0;

  // Phân trang dữ liệu giả lập (thường thì API sẽ handle cái này nhưng ở đây ta slice ở client tạm thời)
  const paginatedCourses = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCourses, page]);

  const totalPages = Math.ceil(totalCourses / ITEMS_PER_PAGE) || 1;

  // Xử lý khi đổi filter thì reset về page 1
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleFormatChange = (val: CourseFormat | "ALL") => {
    setFormat(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khóa học</h1>
          <p className="text-muted-foreground">Xem, tìm kiếm và lọc danh sách khóa học của hệ thống.</p>
        </div>
        <Link to="/admin/courses/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo khóa học
          </Button>
        </Link>
      </div>

      <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
        <CourseFilter
          search={search}
          onSearchChange={handleSearchChange}
          format={format}
          onFormatChange={handleFormatChange}
        />
      </div>

      <CourseTable courses={paginatedCourses} isLoading={isLoading} />

      {totalPages > 1 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  href="#"
                  isActive={page === idx + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(idx + 1);
                  }}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
