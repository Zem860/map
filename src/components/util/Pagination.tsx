import type { PaginationData } from "@/type/product"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
} from "@/components/ui/pagination"

type Props = {
    pagination: PaginationData
    onPageChange: (page: number) => void
}

export function PaginationDemo({ pagination, onPageChange }: Props) {

    const { total_pages, current_page, has_pre, has_next } = pagination

    // 做出中間的page頁面
    const pages: number[] = (() => {
        if (current_page <= 5) {
            const end = Math.min(5, total_pages)
            return Array.from({ length: end }, (_, i) => i + 1)
        }
        const start = Math.max(1, current_page - 1)
        const end = Math.min(total_pages, current_page + 1)

        const arr: number[] = []
        for (let i = start; i <= end; i++) arr.push(i)
        return arr
    })()

    const showRightDots = pages[pages.length - 1] < total_pages - 1 // <last-1 才需要 "… last"

    return (

        <Pagination className="mt-4">

            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => has_pre && onPageChange(current_page - 1)}
                        className={!has_pre ? "pointer-events-none opacity-40" : ""}
                    />
                </PaginationItem>
                {/* RWD調整 */}
                <PaginationItem className="sm:hidden" >
                    <PaginationLink
                        isActive={true}
                        onClick={() => onPageChange(current_page)}
                    >
                        {current_page}
                    </PaginationLink>
                </PaginationItem>
                {pages.map((p) => (
                    <PaginationItem className="sm:block hidden" key={p}>
                        <PaginationLink
                            isActive={p === current_page}
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </PaginationLink>
                    </PaginationItem>

                ))}
                {/* 做點點點 */}
                {showRightDots && (
                    <>
                        <PaginationItem>
                            <span className="px-2 text-muted-foreground">…</span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink onClick={() => onPageChange(total_pages)}>
                                {total_pages}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => has_next && onPageChange(current_page + 1)}
                        className={!has_next ? "pointer-events-none opacity-40" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
