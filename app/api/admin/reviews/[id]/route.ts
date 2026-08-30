import { NextResponse } from 'next/server'
import { deleteReview } from '../../../../../lib/reviews'

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
