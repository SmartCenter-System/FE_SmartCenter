import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, BookOpen, Star, Users, Wifi, Building2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import PaginationBar from "@/shared/components/common/PaginationBar";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/courses/services";

const ITEMS_PER_PAGE = 6;

function createPaginationItems(totalPages: number, currentPage: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

export default function CoursesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      const normalized = searchInput.trim();
      setSearch((prev) => {
        if (prev === normalized) {
          return prev;
        }

        setPage(1);
        return normalized;
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-courses", { search, mode, page }],
    queryFn: () => courseService.getPublicCourses({
      Keyword: search.trim() || undefined,
      Mode: mode === "ALL" ? undefined : Number(mode),
      PageIndex: page,
      PageSize: ITEMS_PER_PAGE,
    }),
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const paginatedCourses = data?.items || [];
  const totalCourses = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;
  const canGoPrevious = (data?.hasPreviousPage ?? false) && page > 1;
  const canGoNext = (data?.hasNextPage ?? false) && page < totalPages;
  const paginationItems = useMemo(() => createPaginationItems(totalPages, page), [page, totalPages]);

  const handleFilterChange = (nextPage = 1) => {
    setPage(nextPage);
  };

  const modeBadge = (courseMode: number) => {
    if (courseMode === 1) {
      return { label: "Online", icon: Wifi, variant: "default" as const };
    }

    return { label: "Offline", icon: Building2, variant: "secondary" as const };
  };

  const displayedSummary = useMemo(() => {
    const start = totalCourses === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(page * ITEMS_PER_PAGE, totalCourses);
    return { start, end };
  }, [page, totalCourses]);

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setMode("ALL");
    setPage(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="bg-muted/30 min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Khám phá Khóa học</h1>
          
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4 space-y-6">
            <Card className="sticky top-24 border-none shadow-md bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <Filter className="h-5 w-5 text-primary" />
                  Bộ lọc tìm kiếm
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tìm kiếm</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Tên khóa học..." 
                      className="pl-9 bg-background/50"
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Hình thức học</label>
                  <Select 
                    value={mode} 
                    onValueChange={(val) => {
                      setMode(val);
                      handleFilterChange();
                    }}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Tất cả hình thức" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tất cả hình thức</SelectItem>
                      <SelectItem value="1">Online</SelectItem>
                      <SelectItem value="2">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" onClick={resetFilters}>Xóa bộ lọc</Button>
              </CardContent>
            </Card>
          </div>

          {/* Courses Grid */}
          <div className="w-full lg:w-3/4 flex flex-col">
            
            <div className="mb-6 flex justify-between items-center text-sm text-muted-foreground">
              <span>
                Hiển thị <strong>{displayedSummary.start}-{displayedSummary.end}</strong> trên tổng số <strong>{totalCourses}</strong> khóa học
              </span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-muted-foreground">Đang tải danh sách khóa học...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-background/40 rounded-2xl border border-dashed border-border">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Không thể tải danh sách khóa học</h3>
                <p className="text-muted-foreground">API đang lỗi 500. Vui lòng thử lại sau hoặc đổi bộ lọc.</p>
              </div>
            ) : paginatedCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-background/40 rounded-2xl border border-dashed border-border">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Không tìm thấy khóa học nào</h3>
                <p className="text-muted-foreground">Vui lòng thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm.</p>
                <Button variant="outline" className="mt-6" onClick={resetFilters}>
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                {paginatedCourses.map((course) => (
                  <Link to={`/courses/${course.courseId}`} key={course.courseId} className="group h-full">
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-none bg-background/60 backdrop-blur-sm group-hover:-translate-y-1">
                      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-sky-100 via-indigo-100 to-cyan-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-indigo-500/60" />
                        </div>
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <Badge variant={modeBadge(course.mode).variant} className="shadow-sm inline-flex items-center gap-1.5">
                            {(() => {
                              const Icon = modeBadge(course.mode).icon;
                              return <Icon className="h-3.5 w-3.5" />;
                            })()}
                            {modeBadge(course.mode).label}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader className="flex-1 p-5 pb-0">
                        <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium mb-2">
                          <Star className="h-4 w-4 fill-current" />
                          <span>4.8</span>
                          <span className="text-muted-foreground ml-1">(120)</span>
                        </div>
                        <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {course.courseName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                          Khóa học tại SmartCenter
                        </p>
                      </CardHeader>

                      <CardContent className="p-5 pt-4 pb-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            Còn {course.availableSlots} chỗ
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            4.8
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-5 pt-0 flex items-end justify-between">
                        <div>
                          <div className="text-lg font-bold text-primary">
                            {formatPrice(course.basePrice)}
                          </div>
                        </div>
                        <Button variant="ghost" className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                          Chi tiết
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-auto pt-8 flex justify-center">
                <PaginationBar
                  items={paginationItems}
                  activePage={page}
                  previousLabel="Trước"
                  nextLabel="Sau"
                  previousHref={`?page=${Math.max(1, page - 1)}`}
                  nextHref={`?page=${Math.min(totalPages, page + 1)}`}
                  pageHref={(nextPage) => `?page=${nextPage}`}
                  onPageChange={(nextPage) => setPage(nextPage)}
                  onPrevious={() => setPage((prev) => Math.max(1, prev - 1))}
                  onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  previousDisabled={!canGoPrevious}
                  nextDisabled={!canGoNext}
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
