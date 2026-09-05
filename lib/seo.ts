export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export const DEFAULT_OG_IMAGE = '/images/og-image.png'

// Open Graph + Twitter card metadata, shared by every page. `image`
// defaults to the brand's OG image (1200x630) but a blog article passes
// its own first inline image when it has one (see getFirstImageUrl in
// lib/blog-posts.ts) — no width/height is known for those, so they're
// only included for the default image.
export function socialMeta(opts: {
  title: string
  description: string
  path: string
  locale: 'uk' | 'ru'
  type?: 'website' | 'article'
  publishedTime?: string
  image?: string
}) {
  const { title, description, path, locale, type = 'website', publishedTime, image } = opts
  const ogImage = image ? { url: image } : { url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }
  return {
    openGraph: {
      title,
      description,
      url: path,
      siteName: locale === 'ru' ? 'Дизайн Образования' : 'Дизайн Освіти',
      locale: locale === 'ru' ? 'ru_RU' : 'uk_UA',
      type,
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [ogImage.url],
    },
  }
}

// uk is always the base/default language (x-default); ru is passed only
// when a ru version of this exact page actually exists (e.g. an
// untranslated blog post has no ru alternate).
export function localizedAlternates(opts: { canonical: string; uk: string; ru?: string }) {
  return {
    alternates: {
      canonical: opts.canonical,
      languages: {
        uk: opts.uk,
        ...(opts.ru ? { ru: opts.ru } : {}),
        'x-default': opts.uk,
      },
    },
  }
}
