import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, BookOpen, Star, Clock, Users } from "lucide-react";
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

const ITEMS_PER_PAGE = 6;

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<string>("ALL");
  const [format, setFormat] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["courses", { search, level, format }],
    queryFn: () => courseService.getCourses({ 
      search, 
      level: level === "ALL" ? undefined : level as any, 
      format: format === "ALL" ? undefined : format as any 
    }),
  });

  const filteredCourses = data?.data || [];
  const totalCourses = data?.total || 0;

  const paginatedCourses = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCourses, page]);

  const totalPages = Math.ceil(totalCourses / ITEMS_PER_PAGE) || 1;

  const handleFilterChange = () => {
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
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        handleFilterChange();
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trình độ</label>
                  <Select 
                    value={level} 
                    onValueChange={(val) => {
                      setLevel(val);
                      handleFilterChange();
                    }}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Tất cả trình độ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tất cả trình độ</SelectItem>
                      <SelectItem value="BEGINNER">Người mới bắt đầu</SelectItem>
                      <SelectItem value="INTERMEDIATE">Trung bình</SelectItem>
                      <SelectItem value="ADVANCED">Nâng cao</SelectItem>
                      <SelectItem value="ALL_LEVELS">Mọi trình độ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Hình thức học</label>
                  <Select 
                    value={format} 
                    onValueChange={(val) => {
                      setFormat(val);
                      handleFilterChange();
                    }}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Tất cả hình thức" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tất cả hình thức</SelectItem>
                      <SelectItem value="ONLINE">Học Online</SelectItem>
                      <SelectItem value="OFFLINE">Học Offline tại trung tâm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Courses Grid */}
          <div className="w-full lg:w-3/4 flex flex-col">
            
            <div className="mb-6 flex justify-between items-center text-sm text-muted-foreground">
              <span>Hiển thị <strong>{paginatedCourses.length}</strong> trên tổng số <strong>{totalCourses}</strong> khóa học</span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-muted-foreground">Đang tải danh sách khóa học...</p>
              </div>
            ) : paginatedCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-background/40 rounded-2xl border border-dashed border-border">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Không tìm thấy khóa học nào</h3>
                <p className="text-muted-foreground">Vui lòng thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm.</p>
                <Button variant="outline" className="mt-6" onClick={() => { setSearch(""); setLevel("ALL"); setFormat("ALL"); }}>
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                {paginatedCourses.map((course) => (
                  <Link to={`/courses/${course.id}`} key={course.id} className="group h-full">
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-none bg-background/60 backdrop-blur-sm group-hover:-translate-y-1">
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={course.thumbnail || undefined} 
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <Badge variant={course.format === "ONLINE" ? "default" : "secondary"} className="shadow-sm">
                            {course.format === "ONLINE" ? "Online" : "Offline"}
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
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                          Bởi Giảng viên
                        </p>
                      </CardHeader>

                      <CardContent className="p-5 pt-4 pb-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            24 giờ
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            1200
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-5 pt-0 flex items-end justify-between">
                        <div>
                          {course.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through mb-0.5">
                              {formatPrice(course.originalPrice)}
                            </div>
                          )}
                          <div className="text-lg font-bold text-primary">
                            {formatPrice(course.price)}
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
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }}
                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <PaginationItem key={idx}>
                        <PaginationLink 
                          href="#" 
                          isActive={page === idx + 1}
                          onClick={(e) => { e.preventDefault(); setPage(idx + 1); }}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)); }}
                        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
