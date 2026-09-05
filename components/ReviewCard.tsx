'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import StarIcon from './StarIcon'
import type { Review } from '../lib/reviews'
import { localeFromPathname } from '../lib/locale'

const PREVIEW_LENGTH = 250

const STRINGS = {
  uk: { anonymous: 'Анонімно', collapse: 'Згорнути', expand: 'Повністю', dateLocale: 'uk-UA' },
  ru: { anonymous: 'Аноним', collapse: 'Свернуть', expand: 'Полностью', dateLocale: 'ru-RU' },
}

export default function ReviewCard({ review }: { review: Review }) {
  const pathname = usePathname()
  const t = STRINGS[localeFromPathname(pathname)]
  const [expanded, setExpanded] = useState(false)
  const isLong = review.text.length > PREVIEW_LENGTH
  const shownText =
    expanded || !isLong
      ? review.text
      : `${review.text.slice(0, PREVIEW_LENGTH).trimEnd()}…`

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-black/5 bg-white p-6 shadow-[0_38px_56px_rgba(191,204,225,0.2)]">
      <div className="flex items-start justify-between gap-3">
        <span className="text-base font-medium">{review.name || t.anonymous}</span>
        {review.rating && (
          <div className="flex shrink-0 text-primary">
            {[1, 2, 3, 4, 5].map((value) => (
              <StarIcon
                key={value}
                filled={value <= review.rating!}
                className="h-4 w-4"
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-base leading-6">
        {shownText}
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="ml-1 font-medium text-primary transition hover:opacity-60"
          >
            {expanded ? t.collapse : t.expand}
          </button>
        )}
      </p>

      <span className="mt-auto text-sm text-gray-500">
        {new Date(review.createdAt).toLocaleDateString(t.dateLocale)}
      </span>
    </div>
  )
}
