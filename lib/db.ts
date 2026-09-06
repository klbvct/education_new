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
  titleRu?: string
  excerptRu?: string
  introRu?: string[]
  sectionsRu?: unknown
}

type SeedRedirect = {
  id: string
  from: string
  to: string
  type: 'permanent' | 'temporary'
  createdAt: string
}

type SeedConsultationRequest = {
  id: string
  createdAt: string
  firstName: string
  lastName: string
  email: string
  phone: string
  messenger: string
  message: string
  serviceLabel: string | null
  locale: string
  status: string
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
  const redirects = readJson<SeedRedirect>('redirects.seed.json')
  const consultationRequests = readJson<SeedConsultationRequest>(
    'consultation-requests.seed.json',
  )

  const insertReview = db.prepare(
    `INSERT INTO reviews (id, name, rating, text, created_at) VALUES (@id, @name, @rating, @text, @createdAt)`,
  )
  const insertPost = db.prepare(
    `INSERT INTO posts (id, title, excerpt, date, intro, sections, title_ru, excerpt_ru, intro_ru, sections_ru)
     VALUES (@id, @title, @excerpt, @date, @intro, @sections, @title_ru, @excerpt_ru, @intro_ru, @sections_ru)`,
  )
  const insertRedirect = db.prepare(
    `INSERT INTO redirects (id, from_path, to_path, type, created_at) VALUES (@id, @from, @to, @type, @createdAt)`,
  )
  const insertConsultationRequest = db.prepare(
    `INSERT INTO consultation_requests (id, created_at, first_name, last_name, email, phone, messenger, message, service_label, locale, status)
     VALUES (@id, @createdAt, @firstName, @lastName, @email, @phone, @messenger, @message, @serviceLabel, @locale, @status)`,
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
        title_ru: p.titleRu ?? null,
        excerpt_ru: p.excerptRu ?? null,
        intro_ru: p.introRu ? JSON.stringify(p.introRu) : null,
        sections_ru: p.sectionsRu ? JSON.stringify(p.sectionsRu) : null,
      })
    }
    for (const r of redirects) {
      insertRedirect.run(r)
    }
    for (const c of consultationRequests) {
      insertConsultationRequest.run({ ...c, message: c.message ?? '', serviceLabel: c.serviceLabel ?? null })
    }
  })()
}

// SQLite has no "ADD COLUMN IF NOT EXISTS" — needed so an existing
// data/app.db (created before the RU translation columns existed) gets
// them added on next start, without wiping/recreating the table.
const POST_RU_COLUMNS = ['title_ru', 'excerpt_ru', 'intro_ru', 'sections_ru']

function migratePostsRuColumns(db: Database.Database): void {
  const existing = new Set(
    (db.prepare('PRAGMA table_info(posts)').all() as { name: string }[]).map((c) => c.name),
  )
  for (const column of POST_RU_COLUMNS) {
    if (!existing.has(column)) {
      db.exec(`ALTER TABLE posts ADD COLUMN ${column} TEXT`)
    }
  }
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
      sections TEXT NOT NULL,
      title_ru TEXT,
      excerpt_ru TEXT,
      intro_ru TEXT,
      sections_ru TEXT
    );
    CREATE TABLE IF NOT EXISTS redirects (
      id TEXT PRIMARY KEY,
      from_path TEXT NOT NULL UNIQUE,
      to_path TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'permanent',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS consultation_requests (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      messenger TEXT NOT NULL,
      message TEXT NOT NULL DEFAULT '',
      service_label TEXT,
      locale TEXT NOT NULL DEFAULT 'uk',
      status TEXT NOT NULL DEFAULT 'new'
    );
  `)

  migratePostsRuColumns(db)
  if (isNew) seed(db)

  dbInstance = db
  return db
}
