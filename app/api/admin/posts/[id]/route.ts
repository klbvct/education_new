import { NextResponse } from 'next/server'
import { deletePost, updatePost, updatePostRu } from '../../../../../lib/posts'
import { parsePostBody } from '../../../../../lib/parse-post-body'
import type { BlogSection } from '../../../../../lib/blog-posts'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const ok = await deletePost(params.id)
  if (!ok) {
    return NextResponse.json({ error: 'Статтю не знайдено' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  let body: {
    title?: string
    excerpt?: string
    date?: string
    body?: string
    titleRu?: string
    excerptRu?: string
    bodyRu?: string
  }
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

  const titleRu = (body.titleRu ?? '').trim()
  const excerptRu = (body.excerptRu ?? '').trim()
  const rawBodyRu = (body.bodyRu ?? '').trim()
  const ruFieldsFilled = [titleRu, excerptRu, rawBodyRu].filter(Boolean).length
  if (ruFieldsFilled > 0 && ruFieldsFilled < 3) {
    return NextResponse.json(
      { error: 'Для російської версії потрібно заповнити заголовок, короткий опис і текст статті' },
      { status: 400 },
    )
  }

  let ruSections: BlogSection[] = []
  let ruIntro: string[] = []
  if (ruFieldsFilled === 3) {
    const parsedRu = parsePostBody(rawBodyRu)
    ruSections = parsedRu.sections
    ruIntro = parsedRu.intro
    if (ruSections.length === 0) {
      return NextResponse.json(
        { error: 'Текст статті (RU) має містити хоча б один розділ (## Заголовок)' },
        { status: 400 },
      )
    }
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

  if (ruFieldsFilled === 3) {
    await updatePostRu(params.id, {
      title: titleRu,
      excerpt: excerptRu,
      intro: ruIntro.length ? ruIntro : undefined,
      sections: ruSections,
    })
  }

  return NextResponse.json({ ok: true })
}
