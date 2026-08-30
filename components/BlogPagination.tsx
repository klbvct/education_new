import Link from 'next/link'

type BlogPaginationProps = {
  currentPage: number
  totalPages: number
}

const arrowClasses =
  'flex h-12 w-12 items-center justify-center rounded-full border border-black/10 text-dark transition hover:border-primary hover:text-primary'
const arrowDisabledClasses =
  'flex h-12 w-12 items-center justify-center rounded-full border border-black/5 text-black/20'

export default function BlogPagination({
  currentPage,
  totalPages,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      aria-label="Пагінація сторінок блогу"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={`/blog?page=${currentPage - 1}`}
          aria-label="Попередня сторінка"
          className={arrowClasses}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
      ) : (
        <span aria-hidden="true" className={arrowDisabledClasses}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </span>
      )}

      {pages.map((page) =>
        page === currentPage ? (
          <span
            key={page}
            aria-current="page"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-base text-white"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={`/blog?page=${page}`}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 text-base text-dark transition hover:border-primary hover:text-primary"
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={`/blog?page=${currentPage + 1}`}
          aria-label="Наступна сторінка"
          className={arrowClasses}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      ) : (
        <span aria-hidden="true" className={arrowDisabledClasses}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      )}
    </nav>
  )
}
