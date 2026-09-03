import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPagination from '../../components/BlogPagination'
import ContactRequestForm from '../../components/ContactRequestForm'
import { BLOG_POSTS, formatBlogDate, type BlogPost } from '../../lib/blog-posts'

export const metadata: Metadata = {
  title: 'Блог — Дизайн Освіти',
  description: 'Статті та поради про освіту за кордоном і кар’єрне консультування.',
}

const PAGE_SIZE = 8

const EXCERPT_LENGTH = 320

function truncateExcerpt(text: string, maxLength: number = EXCERPT_LENGTH) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

// The live site's blog grid repeats a 5-tile pattern: one big excerpt tile
// spanning 2x2, two tall accent tiles (1 column, 2 rows), then two wide
// tiles (2 columns, 1 row) — see live reference at education-design.com.ua/blog-uk.
type CardVariant = 'big' | 'accent' | 'wide'

function cardVariant(i: number): CardVariant {
  const pos = i % 5
  if (pos === 0) return 'big'
  if (pos === 1 || pos === 2) return 'accent'
  return 'wide'
}

function BlogCard({ post, variant }: { post: BlogPost; variant: CardVariant }) {
  const isAccent = variant === 'accent'
  return (
    <Link
      href={`/blog/${post.id}`}
      className={`flex h-full flex-col gap-3 rounded-3xl p-6 transition ${
        isAccent
          ? 'bg-primary text-white hover:opacity-90'
          : 'border border-black/5 bg-white shadow-[0_38px_56px_rgba(191,204,225,0.2)] hover:border-primary/30'
      }`}
    >
      <h2 className="text-xl font-medium leading-tight">{post.title}</h2>
      {variant === 'big' && (
        <p className="leading-6 text-gray-500">{truncateExcerpt(post.excerpt)}</p>
      )}
      <span className={`mt-auto text-sm ${isAccent ? 'text-white/70' : 'text-gray-500'}`}>
        {formatBlogDate(post.date)}
      </span>
    </Link>
  )
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const totalPages = Math.max(1, Math.ceil(BLOG_POSTS.length / PAGE_SIZE))
  const currentPage = Math.min(
    Math.max(Number(searchParams.page) || 1, 1),
    totalPages,
  )
  const start = (currentPage - 1) * PAGE_SIZE
  const posts = BLOG_POSTS.slice(start, start + PAGE_SIZE)

  return (
    <main className="bg-bg-base">
      <section className="mx-auto max-w-container px-4 py-16">
        <h1 className="mb-12 text-3xl font-bold text-dark md:text-5xl">Блог</h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {/* Below lg: plain single/2-column grid, no row/column spanning. */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
              {posts.map((post, i) => (
                <BlogCard key={post.id} post={post} variant={cardVariant(i)} />
              ))}
            </div>

            {/* lg+: 3-column grid following the live site's 5-tile repeating pattern. */}
            <div className="hidden gap-10 lg:grid lg:grid-cols-3">
              {posts.map((post, i) => {
                const variant = cardVariant(i)
                const style =
                  variant === 'big'
                    ? { gridColumn: 'span 2 / span 2', gridRow: 'span 2 / span 2' }
                    : variant === 'accent'
                      ? { gridRow: 'span 2 / span 2' }
                      : { gridColumn: 'span 2 / span 2' }
                return (
                  <div
                    key={post.id}
                    style={style}
                    className={variant === 'big' ? 'min-h-[400px]' : undefined}
                  >
                    <BlogCard post={post} variant={variant} />
                  </div>
                )
              })}
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
