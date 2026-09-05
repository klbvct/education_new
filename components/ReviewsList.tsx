'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import ReviewCard from './ReviewCard'
import type { Review } from '../lib/reviews'
import { localeFromPathname } from '../lib/locale'

const PAGE_SIZE = 6

const MORE_LABEL = {
  uk: 'Більше відгуків',
  ru: 'Больше отзывов',
}

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visibleReviews = reviews.slice(0, visibleCount)
  const hasMore = visibleCount < reviews.length

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {visibleReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
          className="mx-auto mt-8 flex h-14 items-center justify-center rounded-[32px] border border-black/10 px-8 text-base text-dark transition hover:border-primary hover:text-primary lg:h-12"
        >
          {MORE_LABEL[locale]}
        </button>
      )}
    </div>
  )
}
