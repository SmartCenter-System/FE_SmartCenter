import { Check, Filter, Search, Star } from "lucide-react";
import Header from "@/shared/components/common/Header";
import PaginationBar from "@/shared/components/common/PaginationBar";

const categories = ["Toán học", "Ngữ văn", "Vật lý", "Hóa học", "Tiếng Anh", "Lịch sử & Địa lý"];
const levels = ["Lớp 10", "Lớp 11", "Lớp 12"];
const fees = ["Miễn phí", "Dưới 500k", "Trên 500k"];

const courses = [
  {
    tag: "Thiết kế",
    title: "UI/UX Design Masterclass: Từ Cơ Bản Đến Nâng Cao 2024",
    mentor: "John Doe, Lead Designer",
    rating: "4.9",
    learners: "2.5k học viên",
    price: "799,000đ",
    oldPrice: "1,200,000đ",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&h=600&fit=crop",
  },
  {
    tag: "Lập trình",
    title: "Fullstack Web Development với React & Node.js",
    mentor: "Alex Miller, Senior Dev",
    rating: "4.8",
    learners: "1.8k học viên",
    price: "1,500,000đ",
    oldPrice: "2,100,000đ",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900&h=600&fit=crop",
  },
  {
    tag: "Marketing",
    title: "Facebook & Google Ads: Thực Chiến Cho Người Mới Bắt Đầu",
    mentor: "Sarah Lee, Marketing Pro",
    rating: "4.7",
    learners: "3.2k học viên",
    price: "1,200,000đ",
    oldPrice: "2,000,000đ",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop",
  },
  {
    tag: "Data Science",
    title: "Phân tích dữ liệu với Python và PowerBI từ số 0",
    mentor: "Robert King, Data Analyst",
    rating: "4.9",
    learners: "900 học viên",
    price: "2,200,000đ",
    oldPrice: "3,000,000đ",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop",
  },
  {
    tag: "Kinh doanh",
    title: "Quản trị dự án chuyên nghiệp theo chuẩn quốc tế PMP",
    mentor: "Linda Vu, PMP Certified",
    rating: "4.6",
    learners: "1.1k học viên",
    price: "3,100,000đ",
    oldPrice: "4,500,000đ",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=600&fit=crop",
  },
  {
    tag: "Marketing",
    title: "Xây dựng thương hiệu cá nhân đột phá trên Social Media",
    mentor: "Tom Tran, Brand Expert",
    rating: "4.8",
    learners: "1.5k học viên",
    price: "950,000đ",
    oldPrice: "1,400,000đ",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&h=600&fit=crop",
  },
];

export default function ExploreCoursePage() {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<Header tone="solid" />

			<main className="flex-1 bg-[#f5f7fb] pt-[72px]">
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

								<button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-800">
									<Check className="h-4 w-4" />
									Áp dụng
								</button>
							</div>
						</aside>

						<div className="space-y-6">
							<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
								<div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-inner">
									<div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold text-slate-500">
										<Search className="h-5 w-5 shrink-0 text-slate-400" />
										<span>Tìm kiếm</span>
									</div>
									<div className="h-4 w-px shrink-0 bg-slate-200" />
									<input
										type="text"
										placeholder="Tìm kiếm khóa học hoặc giáo viên"
										className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
									/>
									<div className="flex shrink-0 items-center gap-2">
										<button className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-yellow-400 hover:text-blue-950">
											Tìm kiếm
										</button>
										
									</div>
								</div>
							</div>

							<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
								{courses.map((course) => (
									<article key={course.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
										<div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
											<img src={course.image} alt={course.title} className="h-full w-full object-cover" />
											<span className="absolute left-3 top-3 rounded-full bg-indigo-700 px-3 py-1 text-xs font-semibold text-white shadow-sm">
												{course.tag}
											</span>
										</div>

										<div className="space-y-4 p-5">
											<h3 className="min-h-14 text-base font-semibold leading-7 text-slate-700">
												{course.title}
											</h3>

											<div className="flex items-center gap-3 border-b border-slate-100 pb-4">
												<div className="h-9 w-9 rounded-full bg-slate-200" />
												<div>
													<p className="text-sm font-medium text-slate-600">{course.mentor}</p>
												</div>
											</div>

											<div className="flex items-end justify-between gap-4">
												<div className="space-y-1">
													<div className="flex items-center gap-1 text-sm text-amber-500">
														<Star className="h-4 w-4 fill-current" />
														<span className="font-semibold text-slate-700">{course.rating}</span>
														<span className="text-slate-400">({course.learners})</span>
													</div>
												</div>
												<div className="text-right">
													<p className="text-xs text-slate-400 line-through">{course.oldPrice}</p>
													<p className="text-xl font-bold tracking-tight text-indigo-700">{course.price}</p>
												</div>
											</div>

											<button className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-yellow-400 hover:text-blue-950">
												Đăng kí ngay
											</button>
										</div>
									</article>
								))}
							</div>

							<div className="flex justify-center pt-6 pb-2">
								<PaginationBar
									items={[1, 2, 3, "ellipsis", 12]}
									activePage={1}
									previousLabel="Trước"
									nextLabel="Sau"
									className="mx-auto"
								/>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
