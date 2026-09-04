import Link from 'next/link'
import PostForm from '../../../../components/PostForm'

export default function NewPostPage() {
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <Link href="/admin/posts" className="mb-6 inline-block text-sm text-gray-500 hover:text-primary">
        ← Статті
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Нова стаття</h1>
      <div className="max-w-3xl">
        <PostForm
          mode="new"
          initial={{ id: `post-${Date.now()}`, title: '', excerpt: '', date: today, body: '' }}
        />
      </div>
    </div>
  )
}
