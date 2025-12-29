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


    // 產生「要顯示的頁碼」：前 1~5 或 中間 3 個
    const pages: number[] = (() => {
        // 前段：直接顯示 1~5（但不超過 total_pages）
        if (current_page <= 5) {
            const end = Math.min(5, total_pages)
            return Array.from({ length: end }, (_, i) => i + 1)
        }

        // 中段：顯示 current-1, current, current+1（不超界）
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

                {/* 右側：如果 pages 沒到最後，就補 … + last */}
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
