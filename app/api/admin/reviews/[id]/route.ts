import { NextResponse } from 'next/server'
import { deleteReview, updateReview } from '../../../../../lib/reviews'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const ok = await deleteReview(params.id)
  if (!ok) {
    return NextResponse.json({ error: 'Відгук не знайдено' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
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

  const review = await updateReview(params.id, { name, text, rating })
  if (!review) {
    return NextResponse.json({ error: 'Відгук не знайдено' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
