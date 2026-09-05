import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostTranslations } from '../../../../../lib/posts'
import { serializePostBody } from '../../../../../lib/parse-post-body'
import PostForm from '../../../../../components/PostForm'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const translations = await getPostTranslations(params.id)
  if (!translations) notFound()
  const { uk: post, ru } = translations

  return (
    <div>
      <Link href="/admin/posts" className="mb-6 inline-block text-sm text-gray-500 hover:text-primary">
        ← Статті
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Редагувати статтю</h1>
      <div>
        <PostForm
          mode="edit"
          initial={{
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            date: post.date,
            body: serializePostBody(post),
          }}
          initialRu={
            ru
              ? {
                  title: ru.title,
                  excerpt: ru.excerpt,
                  body: serializePostBody(ru),
                }
              : null
          }
        />
      </div>
    </div>
  )
}
