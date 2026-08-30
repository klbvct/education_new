import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export type ReviewStatus = 'pending' | 'approved'

export type Review = {
  id: string
  name: string
  rating: number | null
  text: string
  createdAt: string
  status: ReviewStatus
}

const DATA_FILE = path.join(process.cwd(), 'data', 'reviews.json')
const SEED_FILE = path.join(process.cwd(), 'data', 'reviews.seed.json')

// Serializes reads/writes within this process so concurrent requests
// can't interleave and corrupt the JSON file.
let queue: Promise<unknown> = Promise.resolve()

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const result = queue.then(fn, fn)
  queue = result.catch(() => undefined)
  return result
}

// data/reviews.json is the live, mutable store and is gitignored on
// purpose: it diverges from the repo as soon as anyone submits or a
// review gets moderated. It's bootstrapped from the committed seed
// file on first run so a fresh deploy still ships with real content,
// without a later `git pull` ever overwriting live submissions.
async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE)
  } catch {
    const seed = await fs.readFile(SEED_FILE, 'utf-8').catch(() => '[]')
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, seed, 'utf-8')
  }
}

async function readAll(): Promise<Review[]> {
  await ensureDataFile()
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw) as Review[]
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }
}

async function writeAll(reviews: Review[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(reviews, null, 2), 'utf-8')
}

export async function getApprovedReviews(): Promise<Review[]> {
  const reviews = await readAll()
  return reviews
    .filter((r) => r.status === 'approved')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getPendingReviews(): Promise<Review[]> {
  const reviews = await readAll()
  return reviews
    .filter((r) => r.status === 'pending')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export async function addReview(input: {
  name: string
  text: string
  rating?: number | null
}): Promise<Review> {
  return withLock(async () => {
    const reviews = await readAll()
    const review: Review = {
      id: randomUUID(),
      name: input.name.trim(),
      text: input.text.trim(),
      rating: input.rating ?? null,
      createdAt: new Date().toISOString(),
      status: 'pending',
    }
    reviews.push(review)
    await writeAll(reviews)
    return review
  })
}

export async function setReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<Review | null> {
  return withLock(async () => {
    const reviews = await readAll()
    const review = reviews.find((r) => r.id === id)
    if (!review) return null
    review.status = status
    await writeAll(reviews)
    return review
  })
}

export async function deleteReview(id: string): Promise<boolean> {
  return withLock(async () => {
    const reviews = await readAll()
    const next = reviews.filter((r) => r.id !== id)
    if (next.length === reviews.length) return false
    await writeAll(next)
    return true
  })
}
