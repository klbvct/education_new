import { NextResponse } from 'next/server'
import {
  deleteConsultationRequest,
  updateConsultationRequestStatus,
} from '../../../../../lib/consultation-requests'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const ok = await deleteConsultationRequest(params.id)
  if (!ok) {
    return NextResponse.json({ error: 'Заявку не знайдено' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  let body: { status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некоректний запит' }, { status: 400 })
  }

  if (body.status !== 'new' && body.status !== 'contacted' && body.status !== 'closed') {
    return NextResponse.json({ error: 'Некоректний статус' }, { status: 400 })
  }

  const ok = await updateConsultationRequestStatus(params.id, body.status)
  if (!ok) {
    return NextResponse.json({ error: 'Заявку не знайдено' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
