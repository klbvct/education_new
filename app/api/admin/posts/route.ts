import { NextResponse } from 'next/server'
import { addPost } from '../../../../lib/posts'
import { parsePostBody } from '../../../../lib/parse-post-body'

const SLUG_RE = /^[a-z0-9-]+$/

export async function POST(request: Request) {
  let body: { id?: string; title?: string; excerpt?: string; date?: string; body?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некоректний запит' }, { status: 400 })
  }

  const id = (body.id ?? '').trim()
  const title = (body.title ?? '').trim()
  const excerpt = (body.excerpt ?? '').trim()
  const date = (body.date ?? '').trim()
  const rawBody = body.body ?? ''

  if (!id || !SLUG_RE.test(id)) {
    return NextResponse.json(
      { error: 'URL статті: лише малі латинські букви, цифри та дефіс' },
      { status: 400 },
    )
  }
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

  try {
    const post = await addPost({
      id,
      title,
      excerpt,
      date,
      intro: intro.length ? intro : undefined,
      sections,
    })
    return NextResponse.json({ id: post.id }, { status: 201 })
  } catch (err) {
    if (err instanceof Error && err.message === 'duplicate-id') {
      return NextResponse.json(
        { error: 'Стаття з такою URL вже існує' },
        { status: 409 },
      )
    }
    throw err
  }
}
