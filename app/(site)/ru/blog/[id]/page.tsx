import type { Metadata } from 'next'
import { SITE_TITLE_SUFFIX } from '../../../../../lib/blog-posts'
import { getPost } from '../../../../../lib/posts'
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
    title: `${post.title}${SITE_TITLE_SUFFIX}`,
    description: post.excerpt,
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  return <BlogArticlePage id={params.id} locale="ru" />
}
