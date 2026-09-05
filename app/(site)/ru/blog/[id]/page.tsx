import type { Metadata } from 'next'
import { getFirstImageUrl, siteTitleSuffix } from '../../../../../lib/blog-posts'
import { getPost } from '../../../../../lib/posts'
import { localizedAlternates, socialMeta } from '../../../../../lib/seo'
import BlogArticlePage from '../../../../../components/BlogArticlePage'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const post = await getPost(params.id, 'ru')
  if (!post) return {}
  const title = `${post.title}${siteTitleSuffix('ru')}`
  const description = post.excerpt
  return {
    title,
    description,
    ...localizedAlternates({
      canonical: `/ru/blog/${params.id}`,
      uk: `/blog/${params.id}`,
      ru: `/ru/blog/${params.id}`,
    }),
    ...socialMeta({
      title,
      description,
      path: `/ru/blog/${params.id}`,
      locale: 'ru',
      type: 'article',
      publishedTime: post.date,
      image: getFirstImageUrl(post.sections),
    }),
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  return <BlogArticlePage id={params.id} locale="ru" />
}
