'use client'

type PaginationProps = {
  page: number
  pageSize: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export default function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  if (total <= 10) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col gap-3 border-t border-black/10 px-6 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-gray-500">
        <span>
          {from}–{to} з {total}
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-black/10 bg-white px-2 py-1 text-sm outline-none focus:border-primary"
        >
          {[10, 25, 50].map((n) => (
            <option key={n} value={n}>
              {n} / сторінка
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-black/10 px-3 py-1.5 text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Попередня
        </button>
        <span className="text-gray-500">
          Сторінка {page} з {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-black/10 px-3 py-1.5 text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Наступна
        </button>
      </div>
    </div>
  )
}
