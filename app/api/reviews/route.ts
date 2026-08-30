import { NextResponse } from 'next/server'
import { addReview } from '../../../lib/reviews'
import { sendAdminNotification } from '../../../lib/mailer'

export async function POST(request: Request) {
  let body: { name?: string; text?: string; rating?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некоректний запит' }, { status: 400 })
  }

  const name = (body.name ?? '').trim()
  const text = (body.text ?? '').trim()
  const rating =
    typeof body.rating === 'number' && body.rating >= 1 && body.rating <= 5
      ? body.rating
      : null

  if (!text) {
    return NextResponse.json(
      { error: "Поле «Відгук» обов'язкове" },
      { status: 400 },
    )
  }
  if (text.length > 4000) {
    return NextResponse.json(
      { error: 'Текст відгуку занадто довгий' },
      { status: 400 },
    )
  }

  const review = await addReview({ name, text, rating })

  await sendAdminNotification({
    subject: 'Новий відгук опубліковано — Дизайн Освіти',
    text: [
      `Ім'я: ${name || 'Анонімно'}`,
      rating ? `Оцінка: ${rating}/5` : null,
      '',
      text,
      '',
      'Відгук уже видно на сторінці /feedback.',
      'Видалити за потреби: /admin/reviews',
    ]
      .filter((line) => line !== null)
      .join('\n'),
  })

  return NextResponse.json({ id: review.id }, { status: 201 })
}
