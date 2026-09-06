'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Pagination from '../../../components/Pagination'
import type { ConsultationRequest, ConsultationRequestStatus } from '../../../lib/consultation-requests'

const STATUS_LABEL: Record<ConsultationRequestStatus, string> = {
  new: 'Нова',
  contacted: 'Зв’язались',
  closed: 'Закрита',
}

const STATUS_OPTIONS: ConsultationRequestStatus[] = ['new', 'contacted', 'closed']

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('uk-UA')
}

function RequestRow({
  request,
  onChanged,
}: {
  request: ConsultationRequest
  onChanged: () => void
}) {
  const [isUpdating, setIsUpdating] = useState(false)

  async function changeStatus(status: ConsultationRequestStatus) {
    setIsUpdating(true)
    try {
      await fetch(`/api/admin/consultation-requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      onChanged()
    } finally {
      setIsUpdating(false)
    }
  }

  async function remove() {
    if (!confirm('Видалити цю заявку?')) return
    await fetch(`/api/admin/consultation-requests/${request.id}`, { method: 'DELETE' })
    onChanged()
  }

  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium">
            {request.firstName} {request.lastName}
          </span>
          <span className="text-gray-400">{formatDate(request.createdAt)}</span>
          {request.serviceLabel && (
            <code className="rounded bg-gray-100 px-2 py-0.5">{request.serviceLabel}</code>
          )}
          <span className="rounded bg-gray-100 px-2 py-0.5 uppercase text-gray-500">
            {request.locale}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {request.email} · {request.phone} · {request.messenger}
        </p>
        {request.message && <p className="mt-2 text-sm text-gray-800">{request.message}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <select
          value={request.status}
          disabled={isUpdating}
          onChange={(e) => changeStatus(e.target.value as ConsultationRequestStatus)}
          className="h-10 rounded-lg border border-black/10 px-3 text-sm outline-none focus:border-primary disabled:opacity-50"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={remove}
          className="h-10 rounded-full border border-black/10 px-5 text-sm text-dark transition hover:border-primary hover:text-primary"
        >
          Видалити
        </button>
      </div>
    </div>
  )
}

export default function AdminConsultationRequestsPage() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ConsultationRequestStatus | ''>('')
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
  }, [debouncedSearch, statusFilter])

  // Guards against a stale page-N response overwriting a newer page-1
  // response when search/filter changes while on page 2+ — see the same
  // fix in app/admin/{posts,reviews,redirects}/page.tsx.
  const load = useCallback(() => {
    const id = ++requestId.current
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (statusFilter) params.set('status', statusFilter)
    fetch(`/api/admin/consultation-requests?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (id !== requestId.current) return
        setRequests(d.requests ?? [])
        setPagination(d.pagination ?? { total: 0, totalPages: 1 })
      })
      .catch(console.error)
      .finally(() => {
        if (id === requestId.current) setLoading(false)
      })
  }, [page, pageSize, debouncedSearch, statusFilter])

  useEffect(() => {
    load()
  }, [load])

  const exportHref = `/api/admin/consultation-requests/export${statusFilter ? `?status=${statusFilter}` : ''}`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Заявки</h1>
          <p className="text-sm text-gray-500">
            Заявки з форми замовлення консультації (спливне вікно і сторінка контактів).
          </p>
        </div>
        <a
          href={exportHref}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm text-white transition hover:opacity-60"
        >
          Вивантажити в Excel
        </a>
      </div>

      <div className="flex flex-wrap gap-3 rounded-2xl border border-black/10 bg-white p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук за іменем, email, телефоном…"
          className="h-11 w-full max-w-sm rounded-lg border border-black/10 px-4 text-sm outline-none focus:border-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ConsultationRequestStatus | '')}
          className="h-11 rounded-lg border border-black/10 px-4 text-sm outline-none focus:border-primary"
        >
          <option value="">Усі статуси</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Завантаження…</p>
        ) : requests.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">Заявок ще немає.</p>
        ) : (
          <div className="divide-y divide-black/5">
            {requests.map((r) => (
              <RequestRow key={r.id} request={r} onChanged={load} />
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
