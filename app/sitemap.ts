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
  const entries: MetadataRoute.Sitemap = staticPairs.flatMap(([uk, ru]) => [
    { url: `${base}${uk}`, alternates: { languages: { uk: `${base}${uk}`, ru: `${base}${ru}` } } },
    { url: `${base}${ru}` },
  ])

  const [ukPosts, ruPosts] = await Promise.all([getPosts('uk'), getPosts('ru')])
  for (const post of ukPosts) {
    entries.push({ url: `${base}/blog/${post.id}`, lastModified: post.date })
  }
  for (const post of ruPosts) {
    entries.push({ url: `${base}/ru/blog/${post.id}`, lastModified: post.date })
  }

  return entries
}
