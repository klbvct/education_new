import Link from 'next/link'
import { getPosts } from '../../lib/posts'
import { getReviews } from '../../lib/reviews'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [posts, reviews] = await Promise.all([getPosts(), getReviews()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Огляд</h1>
        <p className="text-sm text-gray-500">Загальний стан контенту сайту.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-sm text-gray-500">Статей</p>
          <p className="mt-0.5 text-3xl font-bold text-gray-900">{posts.length}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-sm text-gray-500">Відгуків</p>
          <p className="mt-0.5 text-3xl font-bold text-gray-900">{reviews.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          href="/admin/reviews"
          className="rounded-2xl border border-black/10 bg-white p-6 transition hover:border-primary"
        >
          <h2 className="mb-2 text-xl font-medium">Відгуки</h2>
          <p className="leading-6 text-gray-500">Редагувати або видалити відгуки.</p>
        </Link>
        <Link
          href="/admin/posts"
          className="rounded-2xl border border-black/10 bg-white p-6 transition hover:border-primary"
        >
          <h2 className="mb-2 text-xl font-medium">Статті</h2>
          <p className="leading-6 text-gray-500">Додати нову статтю або відредагувати існуючу.</p>
        </Link>
      </div>
    </div>
  )
}
