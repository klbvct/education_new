import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const DB_FILE = path.join(process.cwd(), 'data', 'app.db')

type SeedReview = {
  id: string
  name: string
  rating: number | null
  text: string
  createdAt: string
}

type SeedPost = {
  id: string
  title: string
  excerpt: string
  date: string
  intro?: string[]
  sections: unknown
}

function readJson<T>(fileName: string): T[] {
  const file = path.join(process.cwd(), 'data', fileName)
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T[]
  } catch {
    return []
  }
}

// Mirrors the old ensureDataFile bootstrap-from-seed rationale: prefer the
// live JSON file (real visitor/admin data from before the SQLite switch)
// and fall back to the committed seed only if it's missing.
function readLiveOrSeed<T>(liveFile: string, seedFile: string): T[] {
  const livePath = path.join(process.cwd(), 'data', liveFile)
  if (fs.existsSync(livePath)) return readJson<T>(liveFile)
  return readJson<T>(seedFile)
}

function seed(db: Database.Database): void {
  const reviews = readLiveOrSeed<SeedReview>('reviews.json', 'reviews.seed.json')
  const posts = readLiveOrSeed<SeedPost>('posts.json', 'posts.seed.json')

  const insertReview = db.prepare(
    `INSERT INTO reviews (id, name, rating, text, created_at) VALUES (@id, @name, @rating, @text, @createdAt)`,
  )
  const insertPost = db.prepare(
    `INSERT INTO posts (id, title, excerpt, date, intro, sections) VALUES (@id, @title, @excerpt, @date, @intro, @sections)`,
  )

  db.transaction(() => {
    for (const r of reviews) {
      insertReview.run({
        id: r.id,
        name: r.name,
        rating: r.rating ?? null,
        text: r.text,
        createdAt: r.createdAt,
      })
    }
    for (const p of posts) {
      insertPost.run({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        intro: p.intro ? JSON.stringify(p.intro) : null,
        sections: JSON.stringify(p.sections),
      })
    }
  })()
}

let dbInstance: Database.Database | null = null

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance

  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true })
  const isNew = !fs.existsSync(DB_FILE)

  const db = new Database(DB_FILE)
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      rating INTEGER,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      date TEXT NOT NULL,
      intro TEXT,
      sections TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS redirects (
      id TEXT PRIMARY KEY,
      from_path TEXT NOT NULL UNIQUE,
      to_path TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'permanent',
      created_at TEXT NOT NULL
    );
  `)

  if (isNew) seed(db)

  dbInstance = db
  return db
}
