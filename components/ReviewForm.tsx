'use client'

import { useState } from 'react'
import StarIcon from './StarIcon'

export default function ReviewForm() {
  const [rating, setRating] = useState(5)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
          ✓
        </div>
        <h3 className="text-xl font-medium">Дякуємо за відгук!</h3>
        <p className="leading-6">
          Він з&apos;явиться на сторінці після модерації.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setError(null)
        const form = e.currentTarget
        const formData = new FormData(form)
        const firstName = String(formData.get('firstName') ?? '').trim()
        const lastName = String(formData.get('lastName') ?? '').trim()
        const name = [firstName, lastName].filter(Boolean).join(' ')
        const text = String(formData.get('text') ?? '')

        if (!text.trim()) {
          setError("Будь ласка, напишіть текст відгуку")
          return
        }

        setIsSubmitting(true)
        try {
          const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, text, rating }),
          })
          if (!res.ok) throw new Error()
          setSubmitted(true)
        } catch {
          setError('Не вдалося надіслати відгук. Спробуйте ще раз.')
        } finally {
          setIsSubmitting(false)
        }
      }}
      className="flex flex-col gap-3"
    >
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="firstName">
          Ім&apos;я <span className="text-primary">*</span>
        </label>
        <input
          id="firstName"
          name="firstName"
          required
          className="h-12 w-full rounded-[32px] border border-transparent bg-bg-secondary px-6 text-base outline-none transition focus:border-primary focus:bg-white"
          placeholder="Ваше ім'я"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="lastName">
          Прізвище
        </label>
        <input
          id="lastName"
          name="lastName"
          className="h-12 w-full rounded-[32px] border border-transparent bg-bg-secondary px-6 text-base outline-none transition focus:border-primary focus:bg-white"
          placeholder="Ваше прізвище"
        />
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium">Оцінка</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} з 5`}
              aria-pressed={rating === value}
              className="p-1 text-primary transition hover:scale-110"
            >
              <StarIcon filled={value <= rating} className="h-6 w-6" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="text">
          Відгук <span className="text-primary">*</span>
        </label>
        <textarea
          id="text"
          name="text"
          required
          rows={5}
          className="w-full resize-none rounded-2xl border border-transparent bg-bg-secondary px-5 py-3 text-base outline-none transition focus:border-primary focus:bg-white"
          placeholder="Поділіться враженнями від консультації"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex h-14 items-center justify-center gap-2 rounded-[32px] bg-primary text-base text-white transition hover:opacity-60 disabled:opacity-50 lg:h-12"
      >
        {isSubmitting ? 'Надсилаємо…' : 'Залишити відгук'}
        <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
        </svg>
      </button>
    </form>
  )
}
