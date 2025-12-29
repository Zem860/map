import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination"

type Props = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const FIRST_PAGE = 1

export function PaginationDemo({
  page,
  totalPages,
  onPageChange,
}: Props) {

  const isFirst = page === FIRST_PAGE
  const isLast = page === totalPages

  const go = (p: number) =>
    onPageChange(Math.min(Math.max(FIRST_PAGE, p), totalPages))

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault()
              go(page - FIRST_PAGE)
            }}
            aria-disabled={isFirst}
            className={isFirst ? "pointer-events-none opacity-40" : ""}
          />
        </PaginationItem>

        {/* 只顯示目前頁 */}
        <PaginationItem>
          <PaginationLink
            isActive
            onClick={(e) => e.preventDefault()}
            className="bg-primary text-primary-foreground hover:bg-primary"
          >
            {page}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault()
              go(page + FIRST_PAGE)
            }}
            aria-disabled={isLast}
            className={isLast ? "pointer-events-none opacity-40" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
