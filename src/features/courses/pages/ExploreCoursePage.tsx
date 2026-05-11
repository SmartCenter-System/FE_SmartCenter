import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, Filter, Search, Users, Wifi, Building2, Loader2, CircleX, Link } from "lucide-react";
import Header from "@/shared/components/common/Header";
import { useCategories } from "../hooks/useCategories";
import {
  useApplyPublicCourseFiltersMutation,
  usePublicCourses,
  type PublicCourseFilterState,
} from "../hooks/usePublicCourses";
import type { PublicCourseItem } from "../type";
import PaginationBar from "@/shared/components/common/PaginationBar";
import { CourseListSkeleton } from "../components/CourseCardSkeleton";
import { EmptyState } from "@/shared/components/common/EmptyState";

const DEFAULT_PAGE_SIZE = 9;

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

function getModeLabel(mode: number) {
  return mode === 1 ? "Online" : "Offline";
}

function getModeIcon(mode: number) {
  return mode === 1 ? Wifi : Building2;
}

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

export default function ExploreCoursePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialKeyword = searchParams.get("keyword") || "";
  const initialMode = searchParams.get("mode") ? Number(searchParams.get("mode")) : undefined;
  const initialCategoryId = searchParams.get("categoryId") || undefined;
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";

  const [searchInput, setSearchInput] = useState(initialKeyword);
  const [mode, setMode] = useState<number | undefined>(initialMode);
  const [minPriceInput, setMinPriceInput] = useState(initialMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(initialMaxPrice);
  const [categoryId, setCategoryId] = useState<string | undefined>(initialCategoryId);
  const [pageIndex, setPageIndex] = useState(1);
  const [filters, setFilters] = useState<PublicCourseFilterState>({ 
    keyword: initialKeyword,
    mode: initialMode,
    categoryId: initialCategoryId,
    minPrice: initialMinPrice ? Number(initialMinPrice) : undefined,
    maxPrice: initialMaxPrice ? Number(initialMaxPrice) : undefined
  });

  const { data: categories } = useCategories();

  // Cập nhật URL khi bộ lọc thay đổi
  useEffect(() => {
    const params: any = {};
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.mode) params.mode = String(filters.mode);
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.minPrice) params.minPrice = String(filters.minPrice);
    if (filters.maxPrice) params.maxPrice = String(filters.maxPrice);
    if (pageIndex > 1) params.page = String(pageIndex);
    
    setSearchParams(params, { replace: true });
  }, [filters, pageIndex, setSearchParams]);

  const queryParams = useMemo(
    () => ({
      CategoryId: filters.categoryId,
      Mode: filters.mode,
      MinPrice: filters.minPrice,
      MaxPrice: filters.maxPrice,
      PageIndex: pageIndex,
      PageSize: DEFAULT_PAGE_SIZE,
    }),
    [filters, pageIndex],
  );

  const { data, isLoading, isFetching, isError, refetch } = usePublicCourses(queryParams);

  const { mutate: applyFilterMutation, isPending: isApplyingFilter } = useApplyPublicCourseFiltersMutation((next) => {
    setFilters(next);
    setPageIndex(1);
  });

  const courses = data?.items ?? [];
  const totalCount = data?.total ?? 0;
  const totalPages = Math.ceil(totalCount / DEFAULT_PAGE_SIZE) || 1;
  const canGoPrevious = pageIndex > 1;
  const canGoNext = pageIndex < totalPages;

  const paginationItems = useMemo(() => createPaginationItems(totalPages, pageIndex), [pageIndex, totalPages]);

  const applyFilters = () => {
    const minPrice = minPriceInput === "" ? undefined : Number(minPriceInput);
    const maxPrice = maxPriceInput === "" ? undefined : Number(maxPriceInput);

    applyFilterMutation({
      keyword: searchInput.trim(),
      mode,
      categoryId,
      minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    });
  };

  const handleModeChange = (newMode: number | undefined) => {
    setMode(newMode);
    applyFilterMutation({
      keyword: searchInput.trim(),
      mode: newMode,
      categoryId,
      minPrice: minPriceInput === "" ? undefined : Number(minPriceInput),
      maxPrice: maxPriceInput === "" ? undefined : Number(maxPriceInput),
    });
  };

  const handleCategoryChange = (newCatId: string | undefined) => {
    setCategoryId(newCatId);
    applyFilterMutation({
      keyword: searchInput.trim(),
      mode,
      categoryId: newCatId,
      minPrice: minPriceInput === "" ? undefined : Number(minPriceInput),
      maxPrice: maxPriceInput === "" ? undefined : Number(maxPriceInput),
    });
  };

  const resetFilters = () => {
    setSearchInput("");
    setMode(undefined);
    setCategoryId(undefined);
    setMinPriceInput("");
    setMaxPriceInput("");
    applyFilterMutation({ keyword: "", mode: undefined, categoryId: undefined, minPrice: undefined, maxPrice: undefined });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
  };

  const handleOpenCourse = (courseId: string) => {
    if (!courseId) return;
    navigate(`/courses/${encodeURIComponent(courseId)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header tone="solid" />

      <main className="flex-1 bg-background">
        <section className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <div className="mb-6 flex items-center gap-2 text-slate-900">
                <Filter className="h-4 w-4" />
                <h2 className="text-base font-semibold">Bộ lọc</h2>
              </div>

              <div className="space-y-7">
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-foreground">Hình thức học</div>
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <input
                        type="radio"
                        name="mode"
                        checked={mode === undefined}
                        onChange={() => handleModeChange(undefined)}
                        className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Tất cả</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <input
                        type="radio"
                        name="mode"
                        checked={mode === 1}
                        onChange={() => handleModeChange(1)}
                        className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Online</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <input
                        type="radio"
                        name="mode"
                        checked={mode === 2}
                        onChange={() => handleModeChange(2)}
                        className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Offline</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-foreground">Danh mục</div>
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <input
                        type="radio"
                        name="category"
                        checked={categoryId === undefined}
                        onChange={() => handleCategoryChange(undefined)}
                        className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Tất cả</span>
                    </label>
                    {categories?.map((cat) => (
                      <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                        <input
                          type="radio"
                          name="category"
                          checked={categoryId === cat.id}
                          onChange={() => handleCategoryChange(cat.id)}
                          className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-700">Giá thấp nhất</div>
                  <input
                    type="number"
                    min={0}
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    placeholder="Ví dụ: 200000"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-700">Giá cao nhất</div>
                  <input
                    type="number"
                    min={0}
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    placeholder="Ví dụ: 800000"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>

                <button
                  onClick={applyFilters}
                  disabled={isApplyingFilter}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-800"
                >
                  <Check className="h-4 w-4" />
                  Áp dụng
                </button>
                <button
                  onClick={resetFilters}
                  disabled={isApplyingFilter}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
                >
                  <CircleX className="h-4 w-4" />
                  Xóa lọc
                </button>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2 shadow-inner"
                >
                  <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold text-slate-500">
                    <Search className="h-5 w-5 shrink-0 text-slate-400" />
                    <span>Tìm kiếm</span>
                  </div>
                  <div className="h-4 w-px shrink-0 bg-slate-200" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Tìm kiếm khóa học"
                    className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="submit"
                      className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-yellow-400 hover:text-blue-950"
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </form>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <div>
                  Hiển thị <span className="font-semibold text-slate-700">{courses.length}</span> khóa học trên tổng{" "}
                  <span className="font-semibold text-slate-700">{totalCount}</span>
                </div>
                {isFetching && !isLoading ? (
                  <div className="inline-flex items-center gap-2 text-indigo-700">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </div>
                ) : null}
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {isLoading ? <CourseListSkeleton count={6} /> : null}

                {isError ? (
                  <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                    <p className="font-semibold">Không thể tải danh sách khóa học</p>
                    <button
                      onClick={() => void refetch()}
                      className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Thử lại
                    </button>
                  </div>
                ) : null}

                {!isLoading && !isError && courses.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState
                      title="Không tìm thấy khóa học"
                      description="Chúng tôi không tìm thấy kết quả nào phù hợp với bộ lọc của bạn. Hãy thử thay đổi từ khóa hoặc bộ lọc khác."
                      action={{
                        label: "Xóa tất cả bộ lọc",
                        onClick: resetFilters,
                      }}
                    />
                  </div>
                ) : null}

                {!isLoading && !isError
                  ? courses.map((course: PublicCourseItem) => {
                      const ModeIcon = getModeIcon(course.mode);

                      return (
                        <article
                          key={course.id}
                          onClick={() => navigate(`/courses/${course.id}`)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              navigate(`/courses/${course.id}`);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                        >
                          <div className="relative bg-gradient-to-br from-indigo-50 to-cyan-50 p-5">
                            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-700 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                              <ModeIcon className="h-3.5 w-3.5" />
                              {getModeLabel(course.mode)}
                            </span>
                            <h3 className="mt-4 min-h-14 text-base font-semibold leading-7 text-slate-800">
                              {course.title}
                            </h3>
                            <div className="mt-6 flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                                <Users className="h-4 w-4 text-slate-400" />
                                <span>{course.availableSlots} chỗ</span>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Học phí</p>
                                <p className="text-lg font-bold text-indigo-700">
                                  {formatPrice(course.price)}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-yellow-400 hover:text-blue-950">
                                Xem chi tiết
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })
                  : null}
              </div>

              {totalPages > 1 ? (
                <div className="flex justify-center pt-6 pb-2">
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
                    previousDisabled={!canGoPrevious}
                    nextDisabled={!canGoNext}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
