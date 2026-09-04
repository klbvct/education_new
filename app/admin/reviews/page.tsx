import Link from 'next/link'
import { getReviews } from '../../../lib/reviews'
import AdminReviewActions from '../../../components/AdminReviewActions'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const reviews = await getReviews()

  return (
    <main className="mx-auto max-w-container px-4 py-16">
      <Link href="/admin" className="mb-6 inline-block text-sm text-gray-500 hover:text-primary">
        ← Адмінка
      </Link>
      <h1 className="mb-2 text-3xl font-bold text-dark">Відгуки</h1>
      <p className="mb-8 leading-6 text-gray-500">
        Нові відгуки публікуються одразу. Тут можна редагувати або видалити небажані.
      </p>

      {reviews.length === 0 ? (
        <p className="leading-6">Відгуків ще немає.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
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
              <div className="flex gap-3">
                <Link
                  href={`/admin/reviews/${review.id}/edit`}
                  className="flex h-10 items-center rounded-full border border-black/10 px-5 text-sm text-dark transition hover:border-primary hover:text-primary"
                >
                  Редагувати
                </Link>
                <AdminReviewActions id={review.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
