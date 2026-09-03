import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS, formatBlogDate, type BlogBlock } from '../../../lib/blog-posts'
import ContactRequestForm from '../../../components/ContactRequestForm'

function BlogBlockView({ block }: { block: BlogBlock }) {
  if (block.type === 'paragraph') {
    return <p className="mb-2.5 text-base leading-6 text-dark">{block.text}</p>
  }
  if (block.type === 'subheading') {
    return (
      <h3 className="mb-[5px] mt-[18px] text-lg font-medium leading-tight text-dark">
        {block.text}
      </h3>
    )
  }
  const ListTag = block.style === 'ordered' ? 'ol' : 'ul'
  return (
    <ListTag
      className={`my-[18px] pl-10 text-base leading-6 text-dark ${
        block.style === 'ordered' ? 'list-decimal' : 'list-disc'
      }`}
    >
      {block.items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ListTag>
  )
}

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/MarianaKalabukhova',
    icon: (props: { className?: string }) => (
      <svg viewBox="0 0 320 512" fill="currentColor" className={props.className} aria-hidden="true">
        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/mariana_klb/',
    icon: (props: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Telegram',
    href: 'https://t.me/edu_carrier_design',
    icon: (props: { className?: string }) => (
      <svg viewBox="0 0 448 512" fill="currentColor" className={props.className} aria-hidden="true">
        <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
      </svg>
    ),
  },
]

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ id: post.id }))
}

export function generateMetadata({
  params,
}: {
  params: { id: string }
}): Metadata {
  const post = BLOG_POSTS.find((p) => p.id === params.id)
  if (!post) return {}
  return {
    title: `${post.title} — Дизайн Освіти`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const index = BLOG_POSTS.findIndex((p) => p.id === params.id)
  if (index === -1) notFound()

  const post = BLOG_POSTS[index]
  const olderPost = BLOG_POSTS[index + 1]
  const newerPost = BLOG_POSTS[index - 1]

  return (
    <main className="bg-bg-base">
      {/* Banner */}
      <section className="bg-bg-secondary">
        <div className="mx-auto max-w-container px-4 py-16 md:py-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-16">
            <div className="flex gap-12">
              <div className="flex shrink-0 flex-col gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-dark transition hover:border-primary hover:text-primary"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <div>
                <h1 className="mb-8 max-w-2xl text-3xl font-bold leading-tight text-dark md:text-4xl">
                  {post.title}
                </h1>
                <p className="text-sm text-gray-500">{formatBlogDate(post.date)}</p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start text-left">
              <Image
                src="/images/mariana.png"
                alt="Мар'яна Калабухова"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
              <p className="mt-3 font-medium">Мар&apos;яна Калабухова</p>
              <p className="text-sm text-gray-500">
                Автор проєкту, консультант з освіти, PhD
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-container px-4 py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <article className="rounded-[20px] bg-white p-10 lg:col-span-2">
            {post.intro && (
              <div className="mb-10 [&>*:last-child]:mb-0">
                {post.intro.map((paragraph, i) => (
                  <p key={i} className="mb-2.5 text-base leading-6 text-dark">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {post.sections.length > 1 && (
              <div className="mb-10 rounded-2xl border border-black/5 bg-white p-6">
                <p className="mb-3 font-medium">Про що поговоримо:</p>
                <ol className="flex list-decimal flex-col gap-2 pl-5">
                  {post.sections.map((section, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className="text-primary hover:opacity-60"
                      >
                        {section.tocLabel ?? section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex flex-col gap-8">
              {post.sections.map((section, i) => (
                <div key={i} id={`section-${i}`} className="scroll-mt-24">
                  <h2 className="mb-5 text-2xl font-medium leading-tight text-dark">
                    {section.heading}
                  </h2>
                  <div className="[&>*:last-child]:mb-0">
                    {section.blocks
                      ? section.blocks.map((block, j) => <BlogBlockView key={j} block={block} />)
                      : section.paragraphs?.map((paragraph, j) => (
                          <p key={j} className="mb-2.5 text-base leading-6 text-dark">
                            {paragraph}
                          </p>
                        ))}
                  </div>
                </div>
              ))}
            </div>

            {(olderPost || newerPost) && (
              <nav className="mt-12 flex flex-col gap-4 border-t border-black/10 pt-8 sm:flex-row sm:justify-between">
                {newerPost ? (
                  <Link
                    href={`/blog/${newerPost.id}`}
                    className="flex flex-col gap-1 text-left transition hover:text-primary"
                  >
                    <span className="text-sm text-gray-500">Наступна стаття</span>
                    <span className="font-medium">{newerPost.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {olderPost && (
                  <Link
                    href={`/blog/${olderPost.id}`}
                    className="flex flex-col gap-1 text-left transition hover:text-primary sm:items-end sm:text-right"
                  >
                    <span className="text-sm text-gray-500">Попередня стаття</span>
                    <span className="font-medium">{olderPost.title}</span>
                  </Link>
                )}
              </nav>
            )}
          </article>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-6 shadow-[0_38px_56px_rgba(191,204,225,0.4)]">
              <ContactRequestForm />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6">
              <h3 className="mb-4 text-lg font-medium">Підписатися</h3>
              <div className="flex gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 text-dark transition hover:border-primary hover:text-primary"
                  >
                    <s.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
