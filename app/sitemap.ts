import type { MetadataRoute } from 'next'
import { getPosts } from '../lib/posts'
import { siteUrl } from '../lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const staticPairs: [string, string][] = [
    ['/', '/ru'],
    ['/contacts', '/ru/contacts'],
    ['/feedback', '/ru/feedback'],
    ['/blog', '/ru/blog'],
  ]
  // Sitemap-level hreflang must be reciprocal — every language version's
  // entry lists the full set of alternates (including itself), not just
  // the uk entry pointing at ru. See the per-page <link rel="alternate">
  // tags (lib/seo.ts's localizedAlternates) for the same rule already
  // applied there.
  const entries: MetadataRoute.Sitemap = staticPairs.flatMap(([uk, ru]) => {
    const languages = { uk: `${base}${uk}`, ru: `${base}${ru}` }
    return [
      { url: `${base}${uk}`, alternates: { languages } },
      { url: `${base}${ru}`, alternates: { languages } },
    ]
  })

  const [ukPosts, ruPosts] = await Promise.all([getPosts('uk'), getPosts('ru')])
  const ruPostIds = new Set(ruPosts.map((post) => post.id))

  for (const post of ukPosts) {
    const ukUrl = `${base}/blog/${post.id}`
    const ruUrl = `${base}/ru/blog/${post.id}`
    entries.push({
      url: ukUrl,
      lastModified: post.date,
      // Only a translated post gets a ru alternate — matches
      // generateMetadata in app/(site)/blog/[id]/page.tsx, which checks
      // the same thing before linking hreflang="ru".
      ...(ruPostIds.has(post.id) ? { alternates: { languages: { uk: ukUrl, ru: ruUrl } } } : {}),
    })
  }
  for (const post of ruPosts) {
    const ukUrl = `${base}/blog/${post.id}`
    const ruUrl = `${base}/ru/blog/${post.id}`
    entries.push({
      url: ruUrl,
      lastModified: post.date,
      alternates: { languages: { uk: ukUrl, ru: ruUrl } },
    })
  }

  return entries
}
