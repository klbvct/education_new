import { NextResponse } from 'next/server'
import { addRedirect, getRedirects, type RedirectType } from '../../../../lib/redirects'

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = (searchParams.get('search') ?? '').trim().toLowerCase()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const pageSize = Math.max(1, Number(searchParams.get('pageSize')) || 25)

  const all = await getRedirects()
  const filtered = search
    ? all.filter(
        (r) => r.from.toLowerCase().includes(search) || r.to.toLowerCase().includes(search),
      )
    : all

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const redirects = filtered.slice(start, start + pageSize)

  return NextResponse.json({ redirects, pagination: { total, totalPages } })
}

export async function POST(request: Request) {
  let body: { from?: string; to?: string; type?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некоректний запит' }, { status: 400 })
  }

  const type: RedirectType = body.type === 'temporary' ? 'temporary' : 'permanent'

  try {
    const redirect = await addRedirect({
      from: body.from ?? '',
      to: body.to ?? '',
      type,
    })
    return NextResponse.json({ id: redirect.id }, { status: 201 })
  } catch (err) {
    const { message, status } = errorMessage(err)
    return NextResponse.json({ error: message }, { status })
  }
}
