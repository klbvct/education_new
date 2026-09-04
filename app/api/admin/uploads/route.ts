import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null)
  const file = formData?.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Файл не знайдено' }, { status: 400 })
  }

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return NextResponse.json(
      { error: 'Підтримуються лише JPG, PNG, WEBP або GIF' },
      { status: 400 },
    )
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'Файл занадто великий (максимум 5MB)' },
      { status: 400 },
    )
  }

  const filename = `${randomUUID()}.${ext}`
  const dir = path.join(process.cwd(), 'public', 'images', 'posts')
  await fs.mkdir(dir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(path.join(dir, filename), buffer)

  return NextResponse.json({ url: `/images/posts/${filename}` }, { status: 201 })
}
