'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Pagination from '../../../components/Pagination'
import type { Redirect, RedirectType } from '../../../lib/redirects'

const inputClass =
  'h-10 w-full rounded-lg border border-black/10 px-3 text-sm outline-none focus:border-primary'

const TYPE_LABEL: Record<RedirectType, string> = {
  permanent: 'Постійний (308)',
  temporary: 'Тимчасовий (307)',
}

function TypeSelect({
  value,
  onChange,
}: {
  value: RedirectType
  onChange: (value: RedirectType) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as RedirectType)}
      className={inputClass}
    >
      <option value="permanent">{TYPE_LABEL.permanent}</option>
      <option value="temporary">{TYPE_LABEL.temporary}</option>
    </select>
  )
}

function AddRedirectForm({ onAdded }: { onAdded: () => void }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [type, setType] = useState<RedirectType>('permanent')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/redirects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, type }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Не вдалося додати редирект')
        return
      }
      setFrom('')
      setTo('')
      setType('permanent')
      onAdded()
    } catch {
      setError('Не вдалося з’єднатися з сервером.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_180px_auto] sm:items-start">
        <div>
          <label className="mb-1 block text-xs text-gray-500">Звідки (/stara-storinka)</label>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="/stara-storinka"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Куди (/blog/post-1)</label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="/blog/post-1"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Тип</label>
          <TypeSelect value={type} onChange={setType} />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 self-end rounded-full bg-primary px-5 text-sm text-white transition hover:opacity-60 disabled:opacity-50"
        >
          {isSubmitting ? 'Додавання…' : 'Додати'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}

function RedirectRow({
  redirect,
  onChanged,
}: {
  redirect: Redirect
  onChanged: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [from, setFrom] = useState(redirect.from)
  const [to, setTo] = useState(redirect.to)
  const [type, setType] = useState<RedirectType>(redirect.type)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function startEdit() {
    setFrom(redirect.from)
    setTo(redirect.to)
    setType(redirect.type)
    setError(null)
    setEditing(true)
  }

  async function save() {
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/redirects/${redirect.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, type }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Не вдалося зберегти')
        return
      }
      setEditing(false)
      onChanged()
    } catch {
      setError('Не вдалося з’єднатися з сервером.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function remove() {
    if (!confirm('Видалити цей редирект?')) return
    await fetch(`/api/admin/redirects/${redirect.id}`, { method: 'DELETE' })
    onChanged()
  }

  if (editing) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_180px_auto_auto] sm:items-start">
          <input value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass} />
          <input value={to} onChange={(e) => setTo(e.target.value)} className={inputClass} />
          <TypeSelect value={type} onChange={setType} />
          <button
            type="button"
            onClick={save}
            disabled={isSubmitting}
            className="h-10 rounded-full bg-primary px-5 text-sm text-white transition hover:opacity-60 disabled:opacity-50"
          >
            Зберегти
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="h-10 rounded-full border border-black/10 px-5 text-sm text-dark transition hover:border-primary hover:text-primary"
          >
            Скасувати
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <code className="rounded bg-gray-100 px-2 py-0.5">{redirect.from}</code>
          <span className="text-gray-400">→</span>
          <code className="rounded bg-gray-100 px-2 py-0.5">{redirect.to}</code>
        </div>
        <p className="mt-1 text-xs text-gray-500">{TYPE_LABEL[redirect.type]}</p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={startEdit}
          className="h-10 rounded-full border border-black/10 px-5 text-sm text-dark transition hover:border-primary hover:text-primary"
        >
          Редагувати
        </button>
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

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
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
  }, [debouncedSearch])

  // A page-change and a debounced-search update can both trigger a new
  // load() before the previous fetch resolves (e.g. searching while on
  // page 2+ first re-fetches that page, then resets to page 1) — without
  // this guard, whichever response arrives last wins, even if it's the
  // stale one, and it silently overwrites the correct results.
  const load = useCallback(() => {
    const id = ++requestId.current
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (debouncedSearch) params.set('search', debouncedSearch)
    fetch(`/api/admin/redirects?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (id !== requestId.current) return
        setRedirects(d.redirects ?? [])
        setPagination(d.pagination ?? { total: 0, totalPages: 1 })
      })
      .catch(console.error)
      .finally(() => {
        if (id === requestId.current) setLoading(false)
      })
  }, [page, pageSize, debouncedSearch])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Редиректи</h1>
        <p className="text-sm text-gray-500">
          Спрацьовують лише для URL, які інакше показали б 404 (видалена стаття, стара
          адреса) — на живі сторінки сайту вплив не мають.
        </p>
      </div>

      <AddRedirectForm onAdded={load} />

      <div className="rounded-2xl border border-black/10 bg-white p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук за URL…"
          className="h-11 w-full max-w-sm rounded-lg border border-black/10 px-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Завантаження…</p>
        ) : redirects.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">Редиректів ще немає.</p>
        ) : (
          <div className="divide-y divide-black/5">
            {redirects.map((r) => (
              <RedirectRow key={r.id} redirect={r} onChanged={load} />
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
