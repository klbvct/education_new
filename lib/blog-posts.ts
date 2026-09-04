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

export function formatBlogDate(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
