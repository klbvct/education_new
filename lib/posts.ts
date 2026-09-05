import { promises as fs } from 'fs'
import path from 'path'
import type { BlogPost, BlogSection } from './blog-posts'
import { getDb } from './db'
import type { Locale } from './locale'

// Only files under here are ever unlinked — a defensive check against
// deleting anything outside the uploads directory (see
// app/api/admin/uploads/route.ts, the only writer of files here).
const POSTS_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'posts')

function collectImageUrls(sections: BlogSection[]): string[] {
  const urls: string[] = []
  for (const section of sections) {
    for (const block of section.blocks ?? []) {
      if (block.type === 'image') urls.push(block.src)
    }
  }
  return urls
}

// Best-effort cleanup — a missing/already-deleted file, or an image src
// that isn't one of our own uploads (external URL, hand-typed path),
// is silently skipped rather than failing the post deletion itself.
async function deleteUploadedImages(urls: string[]): Promise<void> {
  for (const url of urls) {
    if (!url.startsWith('/images/posts/')) continue
    const resolved = path.resolve(path.join(process.cwd(), 'public', url))
    if (!resolved.startsWith(POSTS_IMAGES_DIR)) continue
    await fs.unlink(resolved).catch(() => {})
  }
}

type PostRow = {
  id: string
  title: string
  excerpt: string
  date: string
  intro: string | null
  sections: string
  title_ru: string | null
  excerpt_ru: string | null
  intro_ru: string | null
  sections_ru: string | null
}

// For locale 'ru', a post only "exists" once it has been translated
// (title_ru set) — see app/(site)/ru/blog/page.tsx and [id]/page.tsx,
// which rely on this to list/404 accordingly.
function fromRow(row: PostRow, locale: Locale): BlogPost | undefined {
  if (locale === 'ru') {
    if (!row.title_ru || !row.sections_ru) return undefined
    return {
      id: row.id,
      title: row.title_ru,
      excerpt: row.excerpt_ru ?? '',
      date: row.date,
      intro: row.intro_ru ? JSON.parse(row.intro_ru) : undefined,
      sections: JSON.parse(row.sections_ru),
    }
  }
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    date: row.date,
    intro: row.intro ? JSON.parse(row.intro) : undefined,
    sections: JSON.parse(row.sections),
  }
}

function toParams(post: BlogPost) {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    intro: post.intro ? JSON.stringify(post.intro) : null,
    sections: JSON.stringify(post.sections),
  }
}

export async function getPosts(locale: Locale = 'uk'): Promise<BlogPost[]> {
  const rows = getDb().prepare('SELECT * FROM posts ORDER BY date DESC').all() as PostRow[]
  return rows
    .map((row) => fromRow(row, locale))
    .filter((post): post is BlogPost => post !== undefined)
}

export async function getPost(id: string, locale: Locale = 'uk'): Promise<BlogPost | undefined> {
  const row = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(id) as
    | PostRow
    | undefined
  return row ? fromRow(row, locale) : undefined
}

// Both language versions of a post at once — used by the admin edit page
// to populate the Українська/Російська tabs (see components/PostForm.tsx).
export async function getPostTranslations(
  id: string,
): Promise<{ uk: BlogPost; ru: BlogPost | null } | undefined> {
  const row = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(id) as
    | PostRow
    | undefined
  if (!row) return undefined
  const uk = fromRow(row, 'uk')
  if (!uk) return undefined
  return { uk, ru: fromRow(row, 'ru') ?? null }
}

export async function addPost(
  input: Omit<BlogPost, 'id'> & { id: string },
): Promise<BlogPost> {
  const existing = await getPost(input.id)
  if (existing) throw new Error('duplicate-id')
  const post: BlogPost = { ...input }
  getDb()
    .prepare(
      'INSERT INTO posts (id, title, excerpt, date, intro, sections) VALUES (@id, @title, @excerpt, @date, @intro, @sections)',
    )
    .run(toParams(post))
  return post
}

export async function deletePost(id: string): Promise<boolean> {
  const row = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(id) as
    | PostRow
    | undefined
  const result = getDb().prepare('DELETE FROM posts WHERE id = ?').run(id)
  if (result.changes > 0 && row) {
    const uk = fromRow(row, 'uk')
    const ru = fromRow(row, 'ru')
    await deleteUploadedImages([
      ...(uk ? collectImageUrls(uk.sections) : []),
      ...(ru ? collectImageUrls(ru.sections) : []),
    ])
  }
  return result.changes > 0
}

export async function updatePost(
  id: string,
  input: Omit<BlogPost, 'id'>,
): Promise<BlogPost | null> {
  const existing = await getPost(id)
  if (!existing) return null
  const updated: BlogPost = { ...input, id }
  getDb()
    .prepare(
      'UPDATE posts SET title = @title, excerpt = @excerpt, date = @date, intro = @intro, sections = @sections WHERE id = @id',
    )
    .run(toParams(updated))
  return updated
}

// Sets/replaces just the Russian translation of a post — the UK
// fields (and id, date) are untouched. The post must already exist in
// Ukrainian (there's always a UK base version).
export async function updatePostRu(
  id: string,
  input: Omit<BlogPost, 'id' | 'date'>,
): Promise<BlogPost | null> {
  const existing = await getPost(id)
  if (!existing) return null
  const params = {
    id,
    title_ru: input.title,
    excerpt_ru: input.excerpt,
    intro_ru: input.intro ? JSON.stringify(input.intro) : null,
    sections_ru: JSON.stringify(input.sections),
  }
  getDb()
    .prepare(
      'UPDATE posts SET title_ru = @title_ru, excerpt_ru = @excerpt_ru, intro_ru = @intro_ru, sections_ru = @sections_ru WHERE id = @id',
    )
    .run(params)
  return { ...input, id, date: existing.date }
}
