import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getReview } from '../../../../../lib/reviews'
import ReviewEditForm from '../../../../../components/ReviewEditForm'

export const dynamic = 'force-dynamic'

export default async function EditReviewPage({ params }: { params: { id: string } }) {
  const review = await getReview(params.id)
  if (!review) notFound()

  return (
    <div>
      <Link
        href="/admin/reviews"
        className="mb-6 inline-block text-sm text-gray-500 hover:text-primary"
      >
        ← Відгуки
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Редагувати відгук</h1>
      <div className="max-w-xl">
        <ReviewEditForm review={review} />
      </div>
    </div>
  )
}
