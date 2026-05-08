import { useState } from "react";
import { Check, Filter, Search, Star } from "lucide-react";
import Header from "@/shared/components/common/Header";
import PaginationBar from "@/shared/components/common/PaginationBar";
import { useCourses } from "../hooks/useCourses";
import type { CourseFilterParams } from "../type";

const categories = ["Toán học", "Ngữ văn", "Vật lý", "Hóa học", "Tiếng Anh", "Lịch sử & Địa lý"];
const levels = ["Lớp 10", "Lớp 11", "Lớp 12"];
const fees = ["Miễn phí", "Dưới 500k", "Trên 500k"];

const PAGE_SIZE = 12;

export default function ExploreCoursePage() {
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [format, setFormat] = useState<1 | 2 | undefined>(undefined);

  const params: CourseFilterParams = {
    Keyword: keyword || undefined,
    page,
    limit: PAGE_SIZE,
    Mode: format,
  };

  const { data, isLoading } = useCourses(params);
  const courses = data ?? [];
  const total = data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handleSearch() {
    setKeyword(search);
    setPage(1);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-foreground">
      <Header tone="solid" />

      <main className="flex-1 bg-white">
        <section className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <div className="mb-6 flex items-center gap-2 text-slate-900">
                <Filter className="h-4 w-4" />
                <h2 className="text-base font-semibold">Danh mục</h2>
              </div>

              <div className="space-y-7">
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-700">Danh mục</div>
                  <div className="space-y-2">
                    {categories.map((item) => (
                      <label key={item} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-700">Hình thức</div>
                  <div className="space-y-2">
                    {(["Tất cả", "Online", "Offline"] as const).map((item) => (
                      <label key={item} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                        <input
                          type="radio"
                          name="format"
                          className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          checked={
                            item === "Tất cả" ? format === undefined :
                            item === "Online" ? format === 1 : format === 2
                          }
                          onChange={() => {
                            setFormat(item === "Tất cả" ? undefined : item === "Online" ? 1 : 2);
                            setPage(1);
                          }}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-700">Cấp độ</div>
                  <div className="space-y-2">
                    {levels.map((item) => (
                      <label key={item} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                        <input type="radio" name="level" className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-700">Học phí</div>
                  <div className="space-y-2">
                    {fees.map((item) => (
                      <label key={item} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setPage(1)}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-800"
                >
                  <Check className="h-4 w-4" />
                  Áp dụng
                </button>
              </div>
            </aside>

            <div className="space-y-6">
              {/* Search bar */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-inner">
                  <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold text-slate-500">
                    <Search className="h-5 w-5 shrink-0 text-slate-400" />
                    <span>Tìm kiếm</span>
                  </div>
                  <div className="h-4 w-px shrink-0 bg-slate-200" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Tìm kiếm khóa học hoặc giáo viên"
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  <button
                    onClick={handleSearch}
                    className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-yellow-400 hover:text-blue-950"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>

              {/* Course grid */}
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="aspect-[16/9] bg-slate-200" />
                      <div className="space-y-3 p-5">
                        <div className="h-4 w-3/4 rounded bg-slate-200" />
                        <div className="h-4 w-1/2 rounded bg-slate-200" />
                        <div className="h-10 rounded bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <p className="text-lg font-medium">Không tìm thấy khóa học nào</p>
                  <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {courses.map((course) => (
                    <article
                      key={course.courseId}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                        {course.imgUrl ? (
                          <img src={course.imgUrl} alt={course.courseName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-indigo-50 text-indigo-300">
                            <span className="text-4xl">📚</span>
                          </div>
                        )}
                        <span className="absolute left-3 top-3 rounded-full bg-indigo-700 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                          {course.courseType === 2 ? "Offline" : "Online"}
                        </span>
                      </div>

                      <div className="space-y-4 p-5">
                        <h3 className="min-h-14 text-base font-semibold leading-7 text-slate-700 line-clamp-2">
                          {course.courseName}
                        </h3>

                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                          <div className="h-9 w-9 rounded-full bg-slate-200" />
                          <p className="text-sm font-medium text-slate-600">Giảng viên</p>
                        </div>

                        <div className="flex items-end justify-between gap-4">
                          <div className="flex items-center gap-1 text-sm text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-semibold text-slate-700">—</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold tracking-tight text-indigo-700">
                              {course.basePrice.toLocaleString("vi-VN")}đ
                            </p>
                          </div>
                        </div>

                        <button className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-yellow-400 hover:text-blue-950">
                          Đăng kí ngay
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <div className="flex justify-center pt-6 pb-2">
                  <PaginationBar
                    items={Array.from({ length: totalPages }, (_, i) => i + 1)}
                    activePage={page}
                    previousLabel="Trước"
                    nextLabel="Sau"
                    className="mx-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
