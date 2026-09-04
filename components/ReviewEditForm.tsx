'use client'

import { useState } from 'react'
import type { Review } from '../lib/reviews'

export default function ReviewEditForm({ review }: { review: Review }) {
  const [name, setName] = useState(review.name)
  const [rating, setRating] = useState(review.rating ?? 5)
  const [text, setText] = useState(review.text)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text, rating }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Не вдалося зберегти відгук')
        return
      }
      setSuccess(true)
    } catch {
      setError('Не вдалося з’єднатися з сервером. Перевірте з’єднання і спробуйте ще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-2 block text-[16px] font-medium" htmlFor="name">
          Ім&apos;я
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 w-full rounded-[32px] border border-black/10 bg-bg-secondary px-6 text-[16px] outline-none transition focus:border-primary focus:bg-white"
        />
      </div>

      <div>
        <span className="mb-2 block text-[16px] font-medium">Оцінка</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} з 5`}
              className={`h-10 w-10 rounded-full border text-sm transition ${
                value <= rating
                  ? 'border-primary bg-primary text-white'
                  : 'border-black/10 text-dark hover:border-primary/40'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[16px] font-medium" htmlFor="text">
          Відгук
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={6}
          className="w-full resize-none rounded-2xl border border-black/10 bg-bg-secondary px-5 py-3 text-[16px] outline-none transition focus:border-primary focus:bg-white"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Відгук успішно збережено.</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex h-14 items-center justify-center gap-2 self-start rounded-[32px] bg-primary px-8 text-base text-white transition hover:opacity-60 disabled:opacity-50 lg:h-12"
      >
        {isSubmitting ? 'Збереження…' : 'Зберегти'}
      </button>
    </form>
  )
}
