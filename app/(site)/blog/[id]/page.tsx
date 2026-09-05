import type { Metadata } from 'next'
import { siteTitleSuffix } from '../../../../lib/blog-posts'
import { getPost } from '../../../../lib/posts'
import { localizedAlternates } from '../../../../lib/seo'
import BlogArticlePage from '../../../../components/BlogArticlePage'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const post = await getPost(params.id)
  if (!post) return {}
  const ruPost = await getPost(params.id, 'ru')
  return {
    title: `${post.title}${siteTitleSuffix('uk')}`,
    description: post.excerpt,
    ...localizedAlternates({
      canonical: `/blog/${params.id}`,
      uk: `/blog/${params.id}`,
      ru: ruPost ? `/ru/blog/${params.id}` : undefined,
    }),
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  return <BlogArticlePage id={params.id} locale="uk" />
}
