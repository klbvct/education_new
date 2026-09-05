import { getReviews } from '../lib/reviews'
import ReviewForm from './ReviewForm'
import ReviewsList from './ReviewsList'
import type { Locale } from '../lib/locale'

const STRINGS: Record<Locale, { heading: string; leaveReviewShort: string; leaveReview: string }> = {
  uk: {
    heading: 'Відгуки',
    leaveReviewShort: 'Залишити відгук',
    leaveReview: 'Залишити відгук',
  },
  ru: {
    heading: 'Отзывы',
    leaveReviewShort: 'Оставить отзыв',
    leaveReview: 'Оставить отзыв',
  },
}

export default async function FeedbackPage({ locale }: { locale: Locale }) {
  const reviews = await getReviews()
  const t = STRINGS[locale]

  return (
    <main className="bg-bg-base">
      <section className="mx-auto max-w-container px-4 py-16">
        <div className="mb-12 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-dark md:text-5xl">{t.heading}</h1>
          <a
            href="#review-form"
            className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-[32px] bg-primary px-6 text-base text-white transition hover:opacity-60 lg:hidden lg:h-12"
          >
            {t.leaveReviewShort}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ReviewsList reviews={reviews} />
          </div>

          <div
            id="review-form"
            className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-[0_38px_56px_rgba(191,204,225,0.4)] md:p-10 lg:sticky lg:top-24 lg:self-start"
          >
            <h2 className="mb-6 text-2xl font-medium">{t.leaveReview}</h2>
            <ReviewForm />
          </div>
        </div>
      </section>
    </main>
  )
}
