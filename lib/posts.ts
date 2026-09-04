import type { BlogPost } from './blog-posts'
import { getDb } from './db'

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
