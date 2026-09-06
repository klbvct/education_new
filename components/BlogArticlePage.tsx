import Image from 'next/image'
import Link from 'next/link'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { formatBlogDate, getFirstImageUrl, type BlogBlock } from '../lib/blog-posts'
import { blogPostingJsonLd, breadcrumbJsonLd } from '../lib/jsonld'
import { getPost, getPosts } from '../lib/posts'
import { findRedirect } from '../lib/redirects'
import ContactRequestForm from './ContactRequestForm'
import JsonLd from './JsonLd'
import type { Locale } from '../lib/locale'

const STRINGS: Record<
  Locale,
  {
    blogCrumb: string
    authorName: string
    authorBio: string
    toc: string
    nextArticle: string
    prevArticle: string
    subscribe: string
  }
> = {
  uk: {
    blogCrumb: 'Блог',
    authorName: "Мар'яна Калабухова",
    authorBio: 'Автор проєкту, консультант з освіти, PhD',
    toc: 'Про що поговоримо:',
    nextArticle: 'Наступна стаття',
    prevArticle: 'Попередня стаття',
    subscribe: 'Підписатися',
  },
  ru: {
    blogCrumb: 'Блог',
    authorName: 'Марьяна Калабухова',
    authorBio: 'Автор проекта, консультант по образованию, PhD',
    toc: 'О чём поговорим:',
    nextArticle: 'Следующая статья',
    prevArticle: 'Предыдущая статья',
    subscribe: 'Подписаться',
  },
}

// Lightweight `[text](href)` link and `**bold**` syntax for inline
// formatting within body text — see post-18, ported from links in the
// live article (stubs use href="#").
function renderRichText(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/)
    if (bold) return <strong key={i}>{bold[1]}</strong>

    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const [, label, href] = link
      return (
        <a key={i} href={href} className="underline decoration-primary">
          {label}
        </a>
      )
    }

    return part
  })
}

function BlogBlockView({ block }: { block: BlogBlock }) {
  if (block.type === 'paragraph') {
    return <p className="mb-2.5 text-base leading-6 text-dark">{renderRichText(block.text)}</p>
  }
  if (block.type === 'subheading') {
    return (
      <h3 className="mb-[5px] mt-[18px] text-lg font-medium leading-tight text-dark">
        {block.text}
      </h3>
    )
  }
  if (block.type === 'image') {
    return (
      <div className="relative my-[18px] aspect-[2/1] w-full overflow-hidden rounded-2xl">
        <Image src={block.src} alt={block.alt} fill className="object-cover" />
      </div>
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

export default async function BlogArticlePage({ id, locale }: { id: string; locale: Locale }) {
  const t = STRINGS[locale]
  const blogBasePath = locale === 'ru' ? '/ru/blog' : '/blog'

  const allPosts = await getPosts(locale)
  const index = allPosts.findIndex((p) => p.id === id)
  if (index === -1) {
    const found = await findRedirect(`${blogBasePath}/${id}`)
    if (found) {
      if (found.type === 'temporary') redirect(found.to)
      permanentRedirect(found.to)
    }
    notFound()
  }

  const post = allPosts[index]
  const olderPost = allPosts[index + 1]
  const newerPost = allPosts[index - 1]
  const postPath = `${blogBasePath}/${id}`
  const homePath = locale === 'ru' ? '/ru' : '/'

  return (
    <main className="bg-bg-base">
      <JsonLd
        data={blogPostingJsonLd({
          post,
          locale,
          path: postPath,
          image: getFirstImageUrl(post.sections),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: locale === 'ru' ? 'Главная' : 'Головна', path: homePath },
          { name: t.blogCrumb, path: blogBasePath },
          { name: post.title, path: postPath },
        ])}
      />
      {/* Breadcrumbs */}
      <section className="bg-bg-base">
        <div className="mx-auto max-w-container px-4 py-3">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href={blogBasePath} className="shrink-0 transition hover:text-primary">
              {t.blogCrumb}
            </Link>
            <span
              className="mx-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              aria-hidden="true"
            />
            <span className="min-w-0 truncate">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Banner */}
      <section className="bg-bg-secondary">
        <div className="mx-auto max-w-container px-4 py-16 md:py-24">
          {/* Mobile: title/date, then author, then socials underneath. */}
          <div className="flex flex-col gap-6 md:hidden">
            <div>
              <h1 className="mb-8 max-w-2xl text-3xl font-bold leading-tight text-dark">
                {post.title}
              </h1>
              <p className="mb-4 text-sm text-gray-500">{formatBlogDate(post.date, locale)}</p>
            </div>

            <div className="flex items-center gap-5 text-left">
              <Image
                src="/images/mariana.webp"
                alt={t.authorName}
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{t.authorName}</p>
                <p className="text-sm text-gray-500">{t.authorBio}</p>
              </div>
            </div>

            <div className="flex gap-3">
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
          </div>

          {/* md+: socials beside the title, author off to the right. */}
          <div className="hidden md:flex md:items-start md:gap-16">
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
                <p className="text-sm text-gray-500">{formatBlogDate(post.date, locale)}</p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start text-left">
              <Image
                src="/images/mariana.webp"
                alt={t.authorName}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
              <p className="mt-3 font-medium">{t.authorName}</p>
              <p className="text-sm text-gray-500">{t.authorBio}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-container px-4 py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <article className="-mx-4 bg-white px-4 py-4 sm:mx-0 sm:rounded-[20px] sm:p-10 lg:col-span-2">
            {post.intro && (
              <div className="mb-10 [&>*:last-child]:mb-0">
                {post.intro.map((paragraph, i) => (
                  <p key={i} className="mb-2.5 text-base leading-6 text-dark">
                    {renderRichText(paragraph)}
                  </p>
                ))}
              </div>
            )}

            {post.sections.length > 1 && (
              <div className="mb-10 text-base">
                <p className="mb-3 font-medium">{t.toc}</p>
                <ol className="my-[18px] list-decimal pl-10 leading-7">
                  {post.sections.map((section, i) => (
                    <li key={i}>
                      <a href={`#section-${i}`} className="text-primary hover:opacity-60">
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
                            {renderRichText(paragraph)}
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
                    href={`${blogBasePath}/${newerPost.id}`}
                    className="flex flex-col gap-1 text-left transition hover:text-primary"
                  >
                    <span className="text-sm text-gray-500">{t.nextArticle}</span>
                    <span className="font-medium">{newerPost.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {olderPost && (
                  <Link
                    href={`${blogBasePath}/${olderPost.id}`}
                    className="flex flex-col gap-1 text-left transition hover:text-primary sm:items-end sm:text-right"
                  >
                    <span className="text-sm text-gray-500">{t.prevArticle}</span>
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

            <div className="rounded-2xl border border-black/5 bg-white p-6 text-center">
              <h3 className="mb-4 text-lg font-medium">{t.subscribe}</h3>
              <div className="flex justify-center gap-3">
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
