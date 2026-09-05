'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Pagination from '../../../components/Pagination'
import AdminReviewActions from '../../../components/AdminReviewActions'
import type { Review } from '../../../lib/reviews'

const RATING_OPTIONS = [1, 2, 3, 4, 5]

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })
  const requestId = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, ratingFilter])

  // A page-change and a debounced-search/filter update can both trigger a
  // new load() before the previous fetch resolves (e.g. searching while
  // on page 2+ first re-fetches that page, then resets to page 1) —
  // without this guard, whichever response arrives last wins, even if
  // it's the stale one, and it silently overwrites the correct results.
  const load = useCallback(() => {
    const id = ++requestId.current
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (ratingFilter) params.set('rating', String(ratingFilter))
    fetch(`/api/admin/reviews?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (id !== requestId.current) return
        setReviews(d.reviews ?? [])
        setPagination(d.pagination ?? { total: 0, totalPages: 1 })
      })
      .catch(console.error)
      .finally(() => {
        if (id === requestId.current) setLoading(false)
      })
  }, [page, pageSize, debouncedSearch, ratingFilter])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Відгуки</h1>
        <p className="text-sm text-gray-500">
          Нові відгуки публікуються одразу. Тут можна редагувати або видалити небажані.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/10 bg-white p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук за іменем або текстом…"
          className="h-11 w-full max-w-sm rounded-lg border border-black/10 px-4 text-sm outline-none focus:border-primary"
        />
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setRatingFilter(null)}
            className={`h-9 rounded-lg px-3 text-sm font-medium transition ${
              ratingFilter === null ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Усі
          </button>
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRatingFilter(r)}
              className={`h-9 rounded-lg px-3 text-sm font-medium transition ${
                ratingFilter === r ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {r}★
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Завантаження…</p>
        ) : reviews.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">Нічого не знайдено.</p>
        ) : (
          <div className="divide-y divide-black/5">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-medium">{review.name || 'Анонімно'}</span>
                  <span className="text-sm text-gray-500">
                    {review.rating ? `${review.rating}/5` : '—'} ·{' '}
                    {new Date(review.createdAt).toLocaleString('uk-UA')}
                  </span>
                </div>
                <p className="mb-4 leading-6">{review.text}</p>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/reviews/${review.id}/edit`}
                    className="flex h-10 items-center rounded-full border border-black/10 px-5 text-sm text-dark transition hover:border-primary hover:text-primary"
                  >
                    Редагувати
                  </Link>
                  <AdminReviewActions id={review.id} onDeleted={load} />
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          onPageSizeChange={(n) => {
            setPageSize(n)
            setPage(1)
          }}
        />
      </div>
    </div>
  )
}
