'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import StarIcon from './StarIcon'
import { localeFromPathname } from '../lib/locale'

const STRINGS = {
  uk: {
    thanksTitle: 'Дякуємо за відгук!',
    thanksText: 'Він уже опубліковано на сторінці.',
    firstName: "Ім'я",
    firstNamePlaceholder: "Ваше ім'я",
    lastName: 'Прізвище',
    lastNamePlaceholder: 'Ваше прізвище',
    rating: 'Оцінка',
    ratingAria: (value: number) => `${value} з 5`,
    reviewLabel: 'Відгук',
    reviewPlaceholder: 'Поділіться враженнями від консультації',
    emptyTextError: 'Будь ласка, напишіть текст відгуку',
    submitError: 'Не вдалося надіслати відгук. Спробуйте ще раз.',
    submitting: 'Надсилаємо…',
    submit: 'Залишити відгук',
  },
  ru: {
    thanksTitle: 'Спасибо за отзыв!',
    thanksText: 'Он уже опубликован на странице.',
    firstName: 'Имя',
    firstNamePlaceholder: 'Ваше имя',
    lastName: 'Фамилия',
    lastNamePlaceholder: 'Ваша фамилия',
    rating: 'Оценка',
    ratingAria: (value: number) => `${value} из 5`,
    reviewLabel: 'Отзыв',
    reviewPlaceholder: 'Поделитесь впечатлениями от консультации',
    emptyTextError: 'Пожалуйста, напишите текст отзыва',
    submitError: 'Не удалось отправить отзыв. Попробуйте ещё раз.',
    submitting: 'Отправляем…',
    submit: 'Оставить отзыв',
  },
}

export default function ReviewForm() {
  const pathname = usePathname()
  const t = STRINGS[localeFromPathname(pathname)]

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
        <h3 className="text-xl font-medium">{t.thanksTitle}</h3>
        <p className="text-base leading-6">{t.thanksText}</p>
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
          setError(t.emptyTextError)
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
          setError(t.submitError)
        } finally {
          setIsSubmitting(false)
        }
      }}
      className="flex flex-col gap-3"
    >
      <div>
        <label className="mb-2 block text-[16px] font-medium" htmlFor="firstName">
          {t.firstName} <span className="text-primary">*</span>
        </label>
        <input
          id="firstName"
          name="firstName"
          required
          className="h-12 w-full rounded-[32px] border border-transparent bg-bg-secondary px-6 text-[16px] outline-none transition focus:border-primary focus:bg-white"
          placeholder={t.firstNamePlaceholder}
        />
      </div>
      <div>
        <label className="mb-2 block text-[16px] font-medium" htmlFor="lastName">
          {t.lastName}
        </label>
        <input
          id="lastName"
          name="lastName"
          className="h-12 w-full rounded-[32px] border border-transparent bg-bg-secondary px-6 text-[16px] outline-none transition focus:border-primary focus:bg-white"
          placeholder={t.lastNamePlaceholder}
        />
      </div>

      <div>
        <span className="mb-2 block text-[16px] font-medium">{t.rating}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={t.ratingAria(value)}
              aria-pressed={rating === value}
              className="p-1 text-primary transition hover:scale-110"
            >
              <StarIcon filled={value <= rating} className="h-6 w-6" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[16px] font-medium" htmlFor="text">
          {t.reviewLabel} <span className="text-primary">*</span>
        </label>
        <textarea
          id="text"
          name="text"
          required
          rows={5}
          className="w-full resize-none rounded-2xl border border-transparent bg-bg-secondary px-5 py-3 text-[16px] outline-none transition focus:border-primary focus:bg-white"
          placeholder={t.reviewPlaceholder}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex h-14 items-center justify-center gap-2 rounded-[32px] bg-primary text-base text-white transition hover:opacity-60 disabled:opacity-50 lg:h-12"
      >
        {isSubmitting ? t.submitting : t.submit}
        <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
        </svg>
      </button>
    </form>
  )
}
