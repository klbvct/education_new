import { NextResponse } from 'next/server'
import { updatePost } from '../../../../../lib/posts'
import { parsePostBody } from '../../../../../lib/parse-post-body'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  let body: { title?: string; excerpt?: string; date?: string; body?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некоректний запит' }, { status: 400 })
  }

  const title = (body.title ?? '').trim()
  const excerpt = (body.excerpt ?? '').trim()
  const date = (body.date ?? '').trim()
  const rawBody = body.body ?? ''

  if (!title) {
    return NextResponse.json({ error: "Поле «Заголовок» обов'язкове" }, { status: 400 })
  }
  if (!excerpt) {
    return NextResponse.json({ error: "Поле «Короткий опис» обов'язкове" }, { status: 400 })
  }
  if (!date) {
    return NextResponse.json({ error: "Поле «Дата» обов'язкове" }, { status: 400 })
  }

  const { intro, sections } = parsePostBody(rawBody)
  if (sections.length === 0) {
    return NextResponse.json(
      { error: 'Текст статті має містити хоча б один розділ (## Заголовок)' },
      { status: 400 },
    )
  }

  const post = await updatePost(params.id, {
    title,
    excerpt,
    date,
    intro: intro.length ? intro : undefined,
    sections,
  })

  if (!post) {
    return NextResponse.json({ error: 'Статтю не знайдено' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
