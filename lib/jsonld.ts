import type { BlogPost } from './blog-posts'
import type { Locale } from './locale'
import { DEFAULT_OG_IMAGE, siteUrl } from './seo'

const BRAND_NAME: Record<Locale, string> = {
  uk: 'Дизайн Освіти',
  ru: 'Дизайн Образования',
}

const LEGAL_NAME: Record<Locale, string> = {
  uk: 'ТОВ "ОТЦ "ЄВРОПА"',
  ru: 'ООО "ОТЦ "ЕВРОПА"',
}

export const AUTHOR_NAME: Record<Locale, string> = {
  uk: "Мар'яна Калабухова",
  ru: 'Марьяна Калабухова',
}

// Same three profiles linked from Footer.tsx/ContactsPage.tsx/BlogArticlePage.tsx.
const SOCIALS = [
  'https://www.facebook.com/MarianaKalabukhova',
  'https://www.instagram.com/mariana_klb/',
  'https://t.me/edu_carrier_design',
]

const LOGO_URL = '/images/favicon_io/android-chrome-512x512.png'
const AUTHOR_IMAGE_URL = '/images/mariana.png'

export function homeUrl(locale: Locale): string {
  return `${siteUrl()}${locale === 'ru' ? '/ru' : ''}`
}

const ORG_ID = () => `${siteUrl()}/#organization`
const PERSON_ID = () => `${siteUrl()}/#mariana`

// Organization + Person, linked via @id — only valid for entities defined
// together in one page's own @graph (see homeJsonLd, rendered on the
// homepage). A separate page like a blog article can't rely on these
// @id references resolving, so blogPostingJsonLd embeds full inline
// author/publisher objects instead of pointing back at these ids.
function organizationNode(locale: Locale) {
  return {
    '@type': 'Organization',
    '@id': ORG_ID(),
    name: BRAND_NAME[locale],
    legalName: LEGAL_NAME[locale],
    url: homeUrl(locale),
    logo: `${siteUrl()}${LOGO_URL}`,
    sameAs: SOCIALS,
  }
}

function personNode(locale: Locale, bio: string) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID(),
    name: AUTHOR_NAME[locale],
    description: bio,
    image: `${siteUrl()}${AUTHOR_IMAGE_URL}`,
    url: homeUrl(locale),
    worksFor: { '@id': ORG_ID() },
    sameAs: SOCIALS,
  }
}

export function homeJsonLd(locale: Locale, authorBio: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationNode(locale), personNode(locale, authorBio)],
  }
}

export function blogPostingJsonLd(opts: {
  post: BlogPost
  locale: Locale
  path: string
  image?: string
}) {
  const { post, locale, path, image } = opts
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: locale,
    image: [`${siteUrl()}${image ?? DEFAULT_OG_IMAGE}`],
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl()}${path}` },
    author: { '@type': 'Person', name: AUTHOR_NAME[locale], url: homeUrl(locale) },
    publisher: {
      '@type': 'Organization',
      name: BRAND_NAME[locale],
      logo: { '@type': 'ImageObject', url: `${siteUrl()}${LOGO_URL}` },
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteUrl()}${item.path}`,
    })),
  }
}
