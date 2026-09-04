import Link from 'next/link'
import { getPosts } from '../../../lib/posts'
import { formatBlogDate } from '../../../lib/blog-posts'

export const dynamic = 'force-dynamic'

export default async function AdminPostsPage() {
  const posts = await getPosts()

  return (
    <main className="mx-auto max-w-container px-4 py-16">
      <Link href="/admin" className="mb-6 inline-block text-sm text-gray-500 hover:text-primary">
        ← Адмінка
      </Link>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-dark">Статті</h1>
          <p className="leading-6 text-gray-500">Список усіх статей блогу.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex h-12 shrink-0 items-center rounded-[32px] bg-primary px-6 text-base text-white transition hover:opacity-60"
        >
          Додати статтю
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="leading-6">Статей ще немає.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-6"
            >
              <div>
                <div className="mb-1 flex items-center gap-3">
                  <span className="font-medium">{post.title}</span>
                  <span className="text-sm text-gray-500">{formatBlogDate(post.date)}</span>
                </div>
                <p className="text-sm text-gray-500">{post.excerpt}</p>
              </div>
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="flex h-10 shrink-0 items-center rounded-full border border-black/10 px-5 text-sm text-dark transition hover:border-primary hover:text-primary"
              >
                Редагувати
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
