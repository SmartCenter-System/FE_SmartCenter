import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Check,
  CircleX,
  Users,
  ArrowRight,
  Loader2,
  X,
  LayoutGrid,
} from "lucide-react";
import Header from "@/shared/components/common/Header";
import { usePublicCourses } from "../hooks/usePublicCourses";
import { useCategories } from "../hooks/useCategories";
import { formatPrice } from "@/shared/utils/format";
import { getModeIcon, getModeLabel } from "../utils/courseUtils";
import { CourseListSkeleton } from "../components/CourseCardSkeleton";
import { EmptyState } from "@/shared/components/common/EmptyState";
import PaginationBar from "@/shared/components/common/PaginationBar";
import type { PublicCourseItem } from "../type";

const DEFAULT_PAGE_SIZE = 12;

const ExploreCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // =========================
  // States
  // =========================
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    mode: searchParams.get("mode") ? Number(searchParams.get("mode")) : undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
  });

  const [pageIndex, setPageIndex] = useState(Number(searchParams.get("page")) || 1);
  const [searchInput, setSearchInput] = useState(filters.keyword);
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice?.toString() || "");
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice?.toString() || "");

  // =========================
  // Sync URL
  // =========================
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.mode !== undefined) params.set("mode", String(filters.mode));
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
    if (pageIndex > 1) params.set("page", String(pageIndex));

    setSearchParams(params, { replace: true });
  }, [filters, pageIndex, setSearchParams]);

  // =========================
  // Query params (Always fetch all for local filtering)
  // =========================
  const queryParams = useMemo(
    () => ({
      PageIndex: 1,
      PageSize: 100, // Fetch all to support robust local filtering
    }),
    [],
  );

  // =========================
  // API
  // =========================
  const { data: rawData, isLoading, isFetching, isError, refetch } = usePublicCourses(queryParams);

  // =========================
  // Client-Side Filtering & Search Logic
  // =========================
  const filteredCourses = useMemo(() => {
    const allItems = rawData?.items || [];
    
    // Helper to normalize Vietnamese strings (remove accents for robust searching)
    const normalizeStr = (str: string) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/đ/g, "d")
        .trim();
    };

    return allItems.filter((course) => {
      // 1. Filter by Keyword (Case-insensitive & Accent-insensitive)
      if (filters.keyword) {
        const title = (course.title || (course as any).courseName || "").toLowerCase();
        const keyword = filters.keyword.toLowerCase();
        
        // Try exact match first (case-insensitive)
        if (title.includes(keyword)) return true;
        
        // Fallback to accent-insensitive match
        const normalizedTitle = normalizeStr(title);
        const normalizedKeyword = normalizeStr(keyword);
        if (!normalizedTitle.includes(normalizedKeyword)) return false;
      }

      // 2. Filter by Category
      if (filters.categoryId && course.cateId !== filters.categoryId) {
        return false;
      }

      // 3. Filter by Mode
      if (filters.mode !== undefined && course.mode !== filters.mode) {
        return false;
      }

      // 4. Filter by Price
      if (filters.minPrice !== undefined && (course.price || 0) < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && (course.price || 0) > filters.maxPrice) return false;

      return true;
    });
  }, [rawData, filters]);

  // =========================
  // Pagination (Local)
  // =========================
  const totalCount = filteredCourses.length;
  const totalPages = Math.ceil(totalCount / DEFAULT_PAGE_SIZE) || 1;
  
  const courses = useMemo(() => {
    const start = (pageIndex - 1) * DEFAULT_PAGE_SIZE;
    const end = start + DEFAULT_PAGE_SIZE;
    return filteredCourses.slice(start, end);
  }, [filteredCourses, pageIndex]);

  // =========================
  // Categories (Enhanced Fallback)
  // =========================
  const { data: apiCategories } = useCategories();
  const safeApiCategories = Array.isArray(apiCategories) ? apiCategories : [];

  const categories = useMemo(() => {
    const combined = [...safeApiCategories];
    const allItems = rawData?.items || [];
    if (Array.isArray(allItems)) {
      allItems.forEach((course: any) => {
        if (!course) return;
        const cateId = course.cateId;
        const cateName = course.cateName ?? course.categoryName;
        if (cateId && !combined.find((c) => c.id === cateId)) {
          combined.push({ id: cateId, name: cateName || "Danh mục khác" });
        }
      });
    }
    return combined.filter((c) => c && c.id && c.id !== "");
  }, [safeApiCategories, rawData]);

  // =========================
  // Logic
  // =========================
  const canGoPrevious = pageIndex > 1;
  const canGoNext = pageIndex < totalPages;

  const paginationItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push({
        label: i.toString(),
        active: i === pageIndex,
        href: `?page=${i}`,
      });
    }
    return items;
  }, [totalPages, pageIndex]);

  const applyFilters = () => {
    const parsedMinPrice = Number(minPriceInput);
    const parsedMaxPrice = Number(maxPriceInput);
    const minPrice = minPriceInput.trim() !== "" && !Number.isNaN(parsedMinPrice) ? parsedMinPrice : undefined;
    const maxPrice = maxPriceInput.trim() !== "" && !Number.isNaN(parsedMaxPrice) ? parsedMaxPrice : undefined;

    setFilters((prev) => ({
      ...prev,
      keyword: searchInput.trim(),
      minPrice,
      maxPrice,
    }));
    setPageIndex(1);
  };

  const handleCategoryChange = (newCategoryId: string | undefined) => {
    setFilters((prev) => ({ ...prev, categoryId: newCategoryId }));
    setPageIndex(1);
  };

  const handleModeChange = (newMode: number | undefined) => {
    setFilters((prev) => ({ ...prev, mode: newMode }));
    setPageIndex(1);
  };

  const clearAllFilters = () => {
    setFilters({
      keyword: "",
      categoryId: undefined,
      mode: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setPageIndex(1);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, keyword: searchInput.trim() }));
    setPageIndex(1);
  };

  const handleOpenCourse = (courseId?: string) => {
    if (!courseId) return;
    navigate(`/courses/${encodeURIComponent(courseId)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header tone="solid" />

      <main className="flex-1 bg-background">
        <section className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            {/* Sidebar */}
            <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <div className="mb-6 flex items-center gap-2 text-slate-900">
                <Filter className="h-4 w-4" />
                <h2 className="text-base font-semibold">Bộ lọc</h2>
              </div>

              <div className="space-y-7">
                {/* Mode */}
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-foreground">Hình thức học</div>
                  <div className="space-y-2">
                    {[
                      { id: "mode-all", label: "Tất cả", value: undefined },
                      { id: "mode-online", label: "Online", value: 1 },
                      { id: "mode-offline", label: "Offline", value: 2 },
                    ].map((m) => (
                      <label key={m.id} htmlFor={m.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                        <input
                          id={m.id}
                          type="radio"
                          name="mode"
                          checked={filters.mode === m.value}
                          onChange={() => handleModeChange(m.value)}
                          className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{m.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-foreground">Danh mục</div>
                  <div className="space-y-2">
                    <label htmlFor="cat-all" className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <input
                        id="cat-all"
                        type="radio"
                        name="category"
                        checked={!filters.categoryId}
                        onChange={() => handleCategoryChange(undefined)}
                        className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Tất cả</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat.id} htmlFor={`cat-${cat.id}`} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                        <input
                          id={`cat-${cat.id}`}
                          type="radio"
                          name="category"
                          checked={filters.categoryId === cat.id}
                          onChange={() => handleCategoryChange(cat.id)}
                          className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-700">Học phí (VND)</div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      placeholder="Từ"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <input
                      type="number"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      placeholder="Đến"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={applyFilters}
                    disabled={isFetching}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-60 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Áp dụng
                  </button>
                  <button
                    onClick={clearAllFilters}
                    disabled={isFetching}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted disabled:opacity-60 transition-colors"
                  >
                    <CircleX className="h-4 w-4" />
                    Xóa lọc
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2 shadow-inner">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Tìm tên khóa học..."
                    className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <button type="submit" disabled={isFetching} className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-400 hover:text-blue-950 transition-colors disabled:opacity-60">
                    Tìm kiếm
                  </button>
                </form>
              </div>

              {/* Active Filters Badges */}
              {(filters.keyword || filters.categoryId || filters.mode !== undefined) && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Đang lọc:</span>
                  {filters.keyword && (
                    <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-100">
                      Từ khóa: {filters.keyword}
                      <button onClick={() => { setFilters(p => ({...p, keyword: ""})); setSearchInput(""); }} className="ml-1 hover:text-indigo-900">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {filters.categoryId && (
                    <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-100">
                      Danh mục: {categories.find(c => c.id === filters.categoryId)?.name || "N/A"}
                      <button onClick={() => handleCategoryChange(undefined)} className="ml-1 hover:text-indigo-900">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {filters.mode !== undefined && (
                    <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-100">
                      Hình thức: {filters.mode === 1 ? "Online" : "Offline"}
                      <button onClick={() => handleModeChange(undefined)} className="ml-1 hover:text-indigo-900">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <button onClick={clearAllFilters} className="text-xs font-medium text-slate-400 hover:text-indigo-600 underline decoration-dotted ml-2">
                    Xóa tất cả
                  </button>
                </div>
              )}

              {/* Top info */}
              <div className="flex items-center justify-between text-sm text-slate-500">
                <div>
                  Hiển thị <span className="font-semibold text-slate-700">{courses.length}</span> khóa học trên tổng <span className="font-semibold text-slate-700">{totalCount}</span>
                </div>
                {isFetching && !isLoading && (
                  <div className="inline-flex items-center gap-2 text-indigo-700">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </div>
                )}
              </div>

              {/* Course Grid */}
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {isLoading && <CourseListSkeleton count={6} />}
                {isError && (
                  <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                    <p className="font-semibold">Không thể tải danh sách khóa học</p>
                    <button onClick={() => void refetch()} className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                      Thử lại
                    </button>
                  </div>
                )}
                {!isLoading && !isError && courses.length === 0 && (
                  <div className="col-span-full">
                    <EmptyState
                      title="Không tìm thấy khóa học"
                      description="Chúng tôi không tìm thấy kết quả nào phù hợp với bộ lọc của bạn."
                      action={{ label: "Xóa tất cả bộ lọc", onClick: clearAllFilters }}
                    />
                  </div>
                )}
                {!isLoading && !isError && courses.map((course: PublicCourseItem) => {
                  const ModeIcon = getModeIcon(course.mode);
                  const realId = course.id ?? (course as any).courseId;

                  return (
                    <article
                      key={realId ?? course.title}
                      onClick={() => handleOpenCourse(realId)}
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative bg-gradient-to-br from-indigo-50 to-cyan-50 p-5">
                        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-700 px-3 py-1 text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
                          <ModeIcon className="h-3 w-3" />
                          {getModeLabel(course.mode)}
                        </span>

                        <h3 className="mt-4 min-h-14 text-base font-bold leading-tight text-slate-800 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                          {course.title ?? (course as any).courseName}
                        </h3>

                        <div className="mt-6 flex items-center justify-between border-t border-slate-200/50 pt-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <Users className="h-4 w-4 text-slate-400" />
                            <span>{course.availableSlots ?? (course as any).maxStudents} chỗ trống</span>
                          </div>

                          <div className="text-right">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Học phí</p>
                            <p className="text-lg font-black text-indigo-700">
                              {formatPrice(course.price ?? (course as any).basePrice ?? 0)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-bold text-white transition-all group-hover:bg-yellow-400 group-hover:text-blue-950">
                            Xem chi tiết
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <div className="flex justify-center pb-2 pt-10">
                  <PaginationBar
                    items={paginationItems}
                    activePage={pageIndex}
                    previousLabel="Trước"
                    nextLabel="Sau"
                    previousHref={`?page=${Math.max(1, pageIndex - 1)}`}
                    nextHref={`?page=${Math.min(totalPages, pageIndex + 1)}`}
                    pageHref={(nextPage) => `?page=${nextPage}`}
                    onPageChange={(nextPage) => setPageIndex(nextPage)}
                    onPrevious={() => setPageIndex((prev) => Math.max(1, prev - 1))}
                    onNext={() => setPageIndex((prev) => Math.min(totalPages, prev + 1))}
                    previousDisabled={!canGoPrevious || isFetching}
                    nextDisabled={!canGoNext || isFetching}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExploreCoursePage;
