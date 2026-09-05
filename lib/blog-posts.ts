export type BlogListBlock = {
  type: 'list'
  style: 'ordered' | 'unordered'
  items: string[]
}

export type BlogImageBlock = {
  type: 'image'
  src: string
  alt: string
}

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'subheading'; text: string }
  | BlogListBlock
  | BlogImageBlock

export type BlogSection = {
  heading: string
  // Shown in the "Про що поговоримо" table of contents instead of `heading`
  // when a shorter label reads better there than the full section title.
  tocLabel?: string
  // Most posts only need plain paragraphs. `blocks` is an escape hatch for
  // richer content (subheadings, lists) — see post-18 for an example.
  paragraphs?: string[]
  blocks?: BlogBlock[]
}

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  date: string
  // Lead-in paragraphs rendered before the "Про що поговоримо" table of
  // contents, ahead of any section — see post-18 for an example.
  intro?: string[]
  sections: BlogSection[]
}

// Appended to post.title for the <title> tag — see generateMetadata in
// app/(site)/blog/[id]/page.tsx and app/(site)/ru/blog/[id]/page.tsx.
// Shared so the admin's SEO length hint (components/PostForm.tsx) counts
// the actual rendered title length. The brand name itself translates
// ("Дизайн Освіти" -> "Дизайн Образования"), not just transliterates.
export function siteTitleSuffix(locale: 'uk' | 'ru' = 'uk'): string {
  return locale === 'ru' ? ' — Дизайн Образования' : ' — Дизайн Освіти'
}

export function formatBlogDate(iso: string, locale: 'uk' | 'ru' = 'uk') {
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Strips the inline markup renderRichText understands (see
// app/(site)/blog/[id]/page.tsx) down to plain text — for contexts like
// blog-listing cards that show a plain-text snippet, not rendered markup.
function stripInlineMarkup(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}

// Plain-text snippet pulled from the article body itself (first intro
// paragraph, or else the first paragraph of the first section) — distinct
// from `excerpt`, which is an admin-authored summary used for SEO meta
// description and is not derived from the body.
export function getBodyExcerpt(post: Pick<BlogPost, 'intro' | 'sections'>): string {
  if (post.intro?.length) return stripInlineMarkup(post.intro[0])

  for (const section of post.sections) {
    const blocks: BlogBlock[] =
      section.blocks ??
      (section.paragraphs ?? []).map((text) => ({ type: 'paragraph', text }) as BlogBlock)
    const firstParagraph = blocks.find(
      (b): b is Extract<BlogBlock, { type: 'paragraph' }> => b.type === 'paragraph',
    )
    if (firstParagraph) return stripInlineMarkup(firstParagraph.text)
  }

  return ''
}
