import { promises as fs } from 'fs'
import path from 'path'
import type { BlogPost } from './blog-posts'
import { getDb } from './db'

// Only files under here are ever unlinked — a defensive check against
// deleting anything outside the uploads directory (see
// app/api/admin/uploads/route.ts, the only writer of files here).
const POSTS_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'posts')

function collectImageUrls(post: Pick<BlogPost, 'sections'>): string[] {
  const urls: string[] = []
  for (const section of post.sections) {
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
}

function fromRow(row: PostRow): BlogPost {
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

export async function getPosts(): Promise<BlogPost[]> {
  const rows = getDb().prepare('SELECT * FROM posts ORDER BY date DESC').all() as PostRow[]
  return rows.map(fromRow)
}

export async function getPost(id: string): Promise<BlogPost | undefined> {
  const row = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(id) as
    | PostRow
    | undefined
  return row ? fromRow(row) : undefined
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
  const post = await getPost(id)
  const result = getDb().prepare('DELETE FROM posts WHERE id = ?').run(id)
  if (result.changes > 0 && post) {
    await deleteUploadedImages(collectImageUrls(post))
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
