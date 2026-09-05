import type { Metadata } from 'next'
import { siteTitleSuffix } from '../../../../../lib/blog-posts'
import { getPost } from '../../../../../lib/posts'
import { localizedAlternates } from '../../../../../lib/seo'
import BlogArticlePage from '../../../../../components/BlogArticlePage'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const post = await getPost(params.id, 'ru')
  if (!post) return {}
  return {
    title: `${post.title}${siteTitleSuffix('ru')}`,
    description: post.excerpt,
    ...localizedAlternates({
      canonical: `/ru/blog/${params.id}`,
      uk: `/blog/${params.id}`,
      ru: `/ru/blog/${params.id}`,
    }),
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  return <BlogArticlePage id={params.id} locale="ru" />
}
