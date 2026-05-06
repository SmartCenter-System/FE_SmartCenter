import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/shared/components/ui/pagination";

type PaginationToken = number | "ellipsis";

interface PaginationBarProps {
	items: PaginationToken[];
	activePage: number;
	previousLabel?: string;
	nextLabel?: string;
	previousHref?: string;
	nextHref?: string;
	pageHref?: (page: number) => string;
	className?: string;
}

export default function PaginationBar({
	items,
	activePage,
	previousLabel = "Trước",
	nextLabel = "Sau",
	previousHref = "#",
	nextHref = "#",
	pageHref = (page) => `#page-${page}`,
	className,
}: PaginationBarProps) {
	return (
		<Pagination className={className}>
			<PaginationContent className="flex-wrap gap-2">
				<PaginationItem>
					<PaginationPrevious
						href={previousHref}
						text={previousLabel}
						className="h-10 w-auto min-w-0 shrink-0 rounded-xl border border-slate-200 bg-white px-4 text-slate-500 transition-colors hover:border-yellow-400 hover:bg-yellow-400 hover:text-blue-950"
					/>
				</PaginationItem>

				{items.map((item, index) => {
					if (item === "ellipsis") {
						return (
							<PaginationItem key={`ellipsis-${index}`}>
								<PaginationEllipsis className="text-slate-400" />
							</PaginationItem>
						);
					}

					return (
						<PaginationItem key={item}>
							<PaginationLink
								href={pageHref(item)}
								isActive={item === activePage}
								className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-yellow-400 hover:bg-yellow-400 hover:text-blue-950 data-[active=true]:border-indigo-700 data-[active=true]:bg-indigo-700 data-[active=true]:text-yellow-400 data-[active=true]:shadow-sm data-[active=true]:[&_svg]:text-yellow-400 data-[active=true]:[&_svg]:fill-yellow-400"
							>
								{item}
							</PaginationLink>
						</PaginationItem>
					);
				})}

				<PaginationItem>
					<PaginationNext
						href={nextHref}
						text={nextLabel}
						className="h-10 w-auto min-w-0 shrink-0 rounded-xl border border-slate-200 bg-white px-4 text-slate-500 transition-colors hover:border-yellow-400 hover:bg-yellow-400 hover:text-blue-950"
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}