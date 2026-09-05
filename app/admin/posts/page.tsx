'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Pagination from '../../../components/Pagination'
import AdminPostActions from '../../../components/AdminPostActions'
import { formatBlogDate, type BlogPost } from '../../../lib/blog-posts'

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (debouncedSearch) params.set('search', debouncedSearch)
    fetch(`/api/admin/posts?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setPosts(d.posts ?? [])
        setPagination(d.pagination ?? { total: 0, totalPages: 1 })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, pageSize, debouncedSearch])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Статті</h1>
          <p className="text-sm text-gray-500">Список усіх статей блогу.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex h-12 shrink-0 items-center rounded-[32px] bg-primary px-6 text-base text-white transition hover:opacity-60"
        >
          Додати статтю
        </Link>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук за заголовком або описом…"
          className="h-11 w-full max-w-sm rounded-lg border border-black/10 px-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Завантаження…</p>
        ) : posts.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">Нічого не знайдено.</p>
        ) : (
          <div className="divide-y divide-black/5">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between gap-4 p-6">
                <div>
                  <div className="mb-1 flex items-center gap-3">
                    <span className="font-medium">{post.title}</span>
                    <span className="text-sm text-gray-500">{formatBlogDate(post.date)}</span>
                  </div>
                  <p className="text-sm text-gray-500">{post.excerpt}</p>
                </div>
                <div className="flex shrink-0 gap-3">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="flex h-10 items-center rounded-full border border-black/10 px-5 text-sm text-dark transition hover:border-primary hover:text-primary"
                  >
                    Редагувати
                  </Link>
                  <AdminPostActions id={post.id} onDeleted={load} />
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
