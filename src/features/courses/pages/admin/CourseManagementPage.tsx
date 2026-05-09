import { useState, useMemo } from "react";
import { CourseTable } from "@/features/courses/components/CourseTable";
import { CourseFilter } from "@/features/courses/components/CourseFilter";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Plus, BookOpen, Globe, Building2, ChevronRight, RotateCw } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/courses/services";

const ITEMS_PER_PAGE = 5;

export default function CourseManagementPage() {
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState<1 | 2 | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["admin-courses", { search, format }],
    queryFn: () => courseService.getAll({ 
      Keyword: search || undefined, 
      Mode: format === "ALL" ? undefined : format,
    }),
  });

  const filteredCourses = data?.data || [];
  const totalCourses = data?.total || 0;

  // Mock stats based on data
  const stats = [
    { label: "Tổng khóa học", value: totalCourses, icon: BookOpen, color: "bg-blue-500" },
    { label: "Học Online", value: filteredCourses.filter(c => c.courseType === 1).length, icon: Globe, color: "bg-green-500" },
    { label: "Tại trung tâm", value: filteredCourses.filter(c => c.courseType === 2).length, icon: Building2, color: "bg-purple-500" },
  ];

  const paginatedCourses = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCourses, page]);

  const totalPages = Math.ceil(totalCourses / ITEMS_PER_PAGE) || 1;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleFormatChange = (val: 1 | 2 | "ALL") => {
    setFormat(val);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Khóa học</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khóa học</h1>
          <p className="text-muted-foreground">Hệ thống quản lý và điều phối các chương trình đào tạo của SmartCenter.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refetch()} 
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
                <p className="text-3xl font-bold">{s.value}</p>
              </div>
              <div className={`p-3 rounded-2xl ${s.color} bg-opacity-10 text-${s.color.split('-')[1]}-600`}>
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
            <Button variant="outline" onClick={() => { setSearch(""); setFormat("ALL"); setPage(1); }}>Xóa bộ lọc</Button>
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
        />
        
        <div className="p-0">
          <CourseTable 
            courses={paginatedCourses} 
            isLoading={isLoading} 
            onDeleteSuccess={() => refetch()}
          />
        </div>

        {/* Pagination integrated at bottom of the same container */}
        {totalPages > 1 && (
          <div className="p-4 border-t bg-muted/20">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
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
                    className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
