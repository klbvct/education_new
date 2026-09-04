import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPagination from '../../../components/BlogPagination'
import ContactRequestForm from '../../../components/ContactRequestForm'
import { formatBlogDate, type BlogPost } from '../../../lib/blog-posts'
import { getPosts } from '../../../lib/posts'

export const metadata: Metadata = {
  title: 'Блог — Дизайн Освіти',
  description: 'Статті та поради про освіту за кордоном і кар’єрне консультування.',
}

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 7

const EXCERPT_LENGTH = 150
// The accent tile spans 2 card-rows on desktop (roughly double the height
// plus the gap between them), so it can fit a longer excerpt before truncating.
const ACCENT_EXCERPT_LENGTH = 320

function truncateExcerpt(text: string, maxLength: number = EXCERPT_LENGTH) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

function AccentCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className="flex h-full flex-col gap-3 rounded-3xl bg-primary p-6 text-white transition hover:opacity-60"
    >
      <h2 className="text-xl font-medium leading-tight">{post.title}</h2>
      <p className="text-base leading-6 text-white/90">
        {truncateExcerpt(post.excerpt, ACCENT_EXCERPT_LENGTH)}
      </p>
      <span className="mt-auto text-sm text-white/70">
        {formatBlogDate(post.date)}
      </span>
    </Link>
  )
}

function RegularCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className="flex h-full flex-col gap-3 rounded-3xl border border-black/5 bg-white p-6 shadow-[0_38px_56px_rgba(191,204,225,0.2)] transition hover:border-primary/30"
    >
      <h2 className="text-xl font-medium leading-tight">{post.title}</h2>
      <p className="text-base leading-6 text-gray-500">{truncateExcerpt(post.excerpt)}</p>
      <span className="mt-auto text-sm text-gray-500">
        {formatBlogDate(post.date)}
      </span>
    </Link>
  )
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const allPosts = await getPosts()
  const totalPages = Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE))
  const currentPage = Math.min(
    Math.max(Number(searchParams.page) || 1, 1),
    totalPages,
  )
  const start = (currentPage - 1) * PAGE_SIZE
  const posts = allPosts.slice(start, start + PAGE_SIZE)

  return (
    <main className="bg-bg-base">
      <section className="mx-auto max-w-container px-4 py-16">
        <h1 className="mb-12 text-3xl font-bold text-dark md:text-5xl">Блог</h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Below lg: plain single/2-column grid — the first post is still the accent tile, just without the row-span. */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
              {posts.map((post, i) =>
                i === 0 ? (
                  <AccentCard key={post.id} post={post} />
                ) : (
                  <RegularCard key={post.id} post={post} />
                ),
              )}
            </div>

            {/* lg+: the first post of every page is a tall accent tile spanning 2 rows in column 1. */}
            <div className="hidden gap-6 lg:grid lg:grid-cols-2">
              {posts.map((post, i) =>
                i === 0 ? (
                  <div key={post.id} style={{ gridColumn: 1, gridRow: '1 / span 2' }}>
                    <AccentCard post={post} />
                  </div>
                ) : (
                  <div key={post.id}>
                    <RegularCard post={post} />
                  </div>
                ),
              )}
            </div>

            <BlogPagination currentPage={currentPage} totalPages={totalPages} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-6 shadow-[0_38px_56px_rgba(191,204,225,0.4)]">
              <ContactRequestForm />
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
