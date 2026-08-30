import type { Metadata } from 'next'
import { getApprovedReviews } from '../../lib/reviews'
import ReviewForm from '../../components/ReviewForm'
import ReviewCard from '../../components/ReviewCard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Відгуки — Дизайн Освіти',
  description: 'Відгуки клієнтів про консультації з Мар’яною Калабуховою.',
}

export default async function FeedbackPage() {
  const reviews = await getApprovedReviews()

  return (
    <main className="bg-bg-base">
      <section className="mx-auto max-w-container px-4 py-16">
        <h1 className="mb-12 text-3xl font-bold text-dark md:text-5xl">
          Відгуки
        </h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-[0_38px_56px_rgba(191,204,225,0.4)] md:p-10 lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-6 text-2xl font-medium">Залишити відгук</h2>
            <ReviewForm />
          </div>
        </div>
      </section>
    </main>
  )
}
