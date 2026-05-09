import type { MouseEvent } from "react";
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
	onPageChange?: (page: number) => void;
	onPrevious?: () => void;
	onNext?: () => void;
	previousDisabled?: boolean;
	nextDisabled?: boolean;
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
	onPageChange,
	onPrevious,
	onNext,
	previousDisabled = false,
	nextDisabled = false,
	className,
}: PaginationBarProps) {
	const handlePreviousClick = (event: MouseEvent<HTMLAnchorElement>) => {
		if (!onPrevious) {
			return;
		}

		event.preventDefault();
		if (!previousDisabled) {
			onPrevious();
		}
	};

	const handleNextClick = (event: MouseEvent<HTMLAnchorElement>) => {
		if (!onNext) {
			return;
		}

		event.preventDefault();
		if (!nextDisabled) {
			onNext();
		}
	};

	const handlePageClick = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
		if (!onPageChange) {
			return;
		}

		event.preventDefault();
		onPageChange(page);
	};

	return (
		<Pagination className={className}>
			<PaginationContent className="flex-wrap gap-2">
				<PaginationItem>
					<PaginationPrevious
						href={previousHref}
						onClick={handlePreviousClick}
						aria-disabled={previousDisabled}
						text={previousLabel}
						className={`h-10 w-auto min-w-0 shrink-0 rounded-xl border border-border bg-card px-4 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary ${previousDisabled ? "pointer-events-none opacity-50" : ""}`}
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
								onClick={handlePageClick(item)}
								isActive={item === activePage}
								className="h-10 w-10 rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm"
							>
								{item}
							</PaginationLink>
						</PaginationItem>
					);
				})}

				<PaginationItem>
					<PaginationNext
						href={nextHref}
						onClick={handleNextClick}
						aria-disabled={nextDisabled}
						text={nextLabel}
						className={`h-10 w-auto min-w-0 shrink-0 rounded-xl border border-border bg-card px-4 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary ${nextDisabled ? "pointer-events-none opacity-50" : ""}`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}