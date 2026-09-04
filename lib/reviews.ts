import { randomUUID } from 'crypto'
import { getDb } from './db'

export type Review = {
  id: string
  name: string
  rating: number | null
  text: string
  createdAt: string
}

type ReviewRow = {
  id: string
  name: string
  rating: number | null
  text: string
  created_at: string
}

function fromRow(row: ReviewRow): Review {
  return {
    id: row.id,
    name: row.name,
    rating: row.rating,
    text: row.text,
    createdAt: row.created_at,
  }
}

// Reviews publish immediately on submission — there is no moderation
// queue. /admin/reviews is a cleanup tool (delete anything unwanted
// after the fact), not a publish gate.
export async function getReviews(): Promise<Review[]> {
  const rows = getDb()
    .prepare('SELECT * FROM reviews ORDER BY created_at DESC')
    .all() as ReviewRow[]
  return rows.map(fromRow)
}

export async function addReview(input: {
  name: string
  text: string
  rating?: number | null
}): Promise<Review> {
  const review: Review = {
    id: randomUUID(),
    name: input.name.trim(),
    text: input.text.trim(),
    rating: input.rating ?? null,
    createdAt: new Date().toISOString(),
  }
  getDb()
    .prepare(
      'INSERT INTO reviews (id, name, rating, text, created_at) VALUES (@id, @name, @rating, @text, @createdAt)',
    )
    .run(review)
  return review
}

export async function deleteReview(id: string): Promise<boolean> {
  const result = getDb().prepare('DELETE FROM reviews WHERE id = ?').run(id)
  return result.changes > 0
}

export async function getReview(id: string): Promise<Review | undefined> {
  const row = getDb().prepare('SELECT * FROM reviews WHERE id = ?').get(id) as
    | ReviewRow
    | undefined
  return row ? fromRow(row) : undefined
}

export async function updateReview(
  id: string,
  input: { name: string; text: string; rating?: number | null },
): Promise<Review | null> {
  const existing = await getReview(id)
  if (!existing) return null
  const updated: Review = {
    ...existing,
    name: input.name.trim(),
    text: input.text.trim(),
    rating: input.rating ?? null,
  }
  getDb()
    .prepare('UPDATE reviews SET name = @name, rating = @rating, text = @text WHERE id = @id')
    .run(updated)
  return updated
}
