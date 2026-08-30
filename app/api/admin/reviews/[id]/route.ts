import { NextResponse } from 'next/server'
import { deleteReview, setReviewStatus } from '../../../../../lib/reviews'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { status } = (await request.json()) as { status?: 'approved' | 'pending' }
  if (status !== 'approved' && status !== 'pending') {
    return NextResponse.json({ error: 'Некоректний статус' }, { status: 400 })
  }

  const review = await setReviewStatus(params.id, status)
  if (!review) {
    return NextResponse.json({ error: 'Відгук не знайдено' }, { status: 404 })
  }
  return NextResponse.json(review)
}

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
