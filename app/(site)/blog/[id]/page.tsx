import type { Metadata } from 'next'
import { getFirstImageUrl, siteTitleSuffix } from '../../../../lib/blog-posts'
import { getPost } from '../../../../lib/posts'
import { localizedAlternates, socialMeta } from '../../../../lib/seo'
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
  const title = `${post.title}${siteTitleSuffix('uk')}`
  const description = post.excerpt
  return {
    title,
    description,
    ...localizedAlternates({
      canonical: `/blog/${params.id}`,
      uk: `/blog/${params.id}`,
      ru: ruPost ? `/ru/blog/${params.id}` : undefined,
    }),
    ...socialMeta({
      title,
      description,
      path: `/blog/${params.id}`,
      locale: 'uk',
      type: 'article',
      publishedTime: post.date,
      image: getFirstImageUrl(post.sections),
    }),
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  return <BlogArticlePage id={params.id} locale="uk" />
}
