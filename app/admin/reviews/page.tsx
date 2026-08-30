import { getPendingReviews } from '../../../lib/reviews'
import AdminReviewActions from '../../../components/AdminReviewActions'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const pending = await getPendingReviews()

  return (
    <main className="mx-auto max-w-container px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-dark">
        Модерація відгуків
      </h1>

      {pending.length === 0 ? (
        <p className="leading-6">Немає відгуків на модерації.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {pending.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-medium">
                  {review.name || 'Анонімно'}
                </span>
                <span className="text-sm text-gray-500">
                  {review.rating ? `${review.rating}/5` : '—'} ·{' '}
                  {new Date(review.createdAt).toLocaleString('uk-UA')}
                </span>
              </div>
              <p className="mb-4 leading-6">{review.text}</p>
              <AdminReviewActions id={review.id} />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
