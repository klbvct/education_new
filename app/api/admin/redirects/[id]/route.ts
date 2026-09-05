import { NextResponse } from 'next/server'
import { deleteRedirect, updateRedirect, type RedirectType } from '../../../../../lib/redirects'

function errorMessage(err: unknown): { message: string; status: number } {
  if (err instanceof Error) {
    if (err.message === 'invalid-from') {
      return { message: 'URL «Звідки» має починатися з «/»', status: 400 }
    }
    if (err.message === 'invalid-to') {
      return { message: 'URL «Куди» обов’язковий', status: 400 }
    }
    if (err.message === 'reserved-from') {
      return {
        message: 'Не можна робити редирект з /admin, /api, /login чи /_next',
        status: 400,
      }
    }
    if (err.message === 'duplicate-from') {
      return { message: 'Редирект з цього URL уже існує', status: 409 }
    }
  }
  return { message: 'Не вдалося зберегти редирект', status: 500 }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  let body: { from?: string; to?: string; type?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некоректний запит' }, { status: 400 })
  }

  const type: RedirectType = body.type === 'temporary' ? 'temporary' : 'permanent'

  try {
    const redirect = await updateRedirect(params.id, {
      from: body.from ?? '',
      to: body.to ?? '',
      type,
    })
    if (!redirect) {
      return NextResponse.json({ error: 'Редирект не знайдено' }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    const { message, status } = errorMessage(err)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const ok = await deleteRedirect(params.id)
  if (!ok) {
    return NextResponse.json({ error: 'Редирект не знайдено' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
