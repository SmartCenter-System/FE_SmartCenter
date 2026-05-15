import { useState, useMemo } from "react";
import { CourseTable } from "@/features/courses/components/CourseTable";
import { CourseGrid } from "@/features/courses/components/CourseGrid";
import { CourseFilter } from "@/features/courses/components/CourseFilter";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Plus, BookOpen, Globe, Building2, ChevronRight, RotateCw } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/features/courses/services";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function CourseManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState<1 | 2 | "ALL">("ALL");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Lấy toàn bộ danh sách để thống kê chính xác 100% và thực hiện lọc phía client cực mượt
  const { data: allCoursesRes, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["courses", "admin-all-for-stats"],
    queryFn: () => courseService.getCourses({ limit: 1000 }),
    staleTime: 5 * 60 * 1000,
  });
  const allCourses = allCoursesRes?.data || [];

  // Lọc trực tiếp phía client đảm bảo tìm kiếm và chọn hình thức luôn chạy mượt mà ngay tức thì
  const filteredCourses = useMemo(() => {
    return allCourses.filter((c) => {
      const matchesSearch = !search || 
        c.courseName.toLowerCase().includes(search.toLowerCase()) ||
        c.courseId.toLowerCase().includes(search.toLowerCase());
      
      const matchesFormat = format === "ALL" || c.courseType === format;
      
      return matchesSearch && matchesFormat;
    });
  }, [allCourses, search, format]);

  const totalFiltered = filteredCourses.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;

  const courses = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, pageIndex, pageSize]);

  const isStatsLoading = isLoading;

  // Global stats that stay constant regardless of table filters
  const stats = [
    {
      label: "Tổng khóa học",
      value: allCoursesRes?.total || allCourses.length,
      icon: BookOpen,
      color: "bg-blue-500",
      loading: isStatsLoading,
    },
    {
      label: "Học Online",
      value: allCourses.filter((c) => c.courseType === 1).length,
      icon: Globe,
      color: "bg-green-500",
      loading: isStatsLoading,
    },
    {
      label: "Tại trung tâm",
      value: allCourses.filter((c) => c.courseType === 2).length,
      icon: Building2,
      color: "bg-purple-500",
      loading: isStatsLoading,
    },
  ];

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPageIndex(1);
  };

  const handleFormatChange = (val: 1 | 2 | "ALL") => {
    setFormat(val);
    setPageIndex(1);
  };

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/admin" className="hover:text-primary transition-colors">
              Admin
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Khóa học</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khóa học</h1>
          <p className="text-muted-foreground">
            Hệ thống quản lý và điều phối các chương trình đào tạo của SmartCenter.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              refetch();
              queryClient.invalidateQueries({ queryKey: ["courses"] });
            }}
            disabled={isLoading || isRefetching}
            className="rounded-full hover:rotate-180 transition-transform duration-500"
            title="Làm mới dữ liệu"
          >
            <RotateCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
          </Button>
          <Link to="/admin/courses/create">
            <Button size="lg" className="shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
              <Plus className="mr-2 h-5 w-5" />
              Tạo khóa học mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                {s.loading ? <Skeleton className="h-9 w-16" /> : <p className="text-3xl font-bold">{s.value}</p>}
              </div>
              <div className={`p-3 rounded-2xl ${s.color} bg-opacity-10 text-${s.color.split("-")[1]}-600`}>
                <s.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-8 flex items-center justify-between">
          <div>Đã có lỗi từ server. Vui lòng thử lại sau hoặc xóa bộ lọc.</div>
          <div className="flex gap-2">
            <Button onClick={() => refetch()}>Thử lại</Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setFormat("ALL");
                setPage(1);
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area: Filter + Table Integrated */}
      <div className="bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
        <CourseFilter
          search={search}
          onSearchChange={handleSearchChange}
          format={format}
          onFormatChange={handleFormatChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="p-0">
          {viewMode === "table" ? (
            <CourseTable courses={courses} isLoading={isLoading} onDeleteSuccess={() => refetch()} />
          ) : (
            <CourseGrid courses={courses} isLoading={isLoading} onDeleteSuccess={() => refetch()} />
          )}
        </div>

        {/* Pagination integrated at bottom of the same container */}
        {/* Pagination integrated at bottom of the same container */}
        {totalPages > 1 && (
          <div className="p-4 border-t bg-muted/20">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                    className={pageIndex === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    text="Trước"
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  // Only show current, first, last, and neighbors
                  if (p === 1 || p === totalPages || (p >= pageIndex - 1 && p <= pageIndex + 1)) {
                    return (
                      <PaginationItem key={p}>
                        <PaginationLink
                          onClick={() => setPageIndex(p)}
                          isActive={pageIndex === p}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  if (p === pageIndex - 2 || p === pageIndex + 2) {
                    return <PaginationEllipsis key={p} />;
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
                    className={pageIndex >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    text="Sau"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
