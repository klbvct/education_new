import { randomUUID } from 'crypto'
import { getDb } from './db'

export type RedirectType = 'permanent' | 'temporary'

export type Redirect = {
  id: string
  from: string
  to: string
  type: RedirectType
  createdAt: string
}

type RedirectRow = {
  id: string
  from_path: string
  to_path: string
  type: string
  created_at: string
}

function fromRow(row: RedirectRow): Redirect {
  return {
    id: row.id,
    from: row.from_path,
    to: row.to_path,
    type: row.type === 'temporary' ? 'temporary' : 'permanent',
    createdAt: row.created_at,
  }
}

const RESERVED_PREFIXES = ['/admin', '/api', '/login', '/_next']

// Trims and normalizes a path: must start with "/" (unless it's an
// absolute http(s):// URL, only valid for `to`), no trailing slash except
// root. Returns null if the input can't be normalized into a usable path.
function normalizePath(input: string): string | null {
  const trimmed = input.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (!trimmed.startsWith('/')) return null
  if (trimmed.length > 1 && trimmed.endsWith('/')) return trimmed.slice(0, -1)
  return trimmed
}

function validate(input: { from: string; to: string }): { from: string; to: string } {
  const from = normalizePath(input.from)
  const to = normalizePath(input.to)

  if (!from || /^https?:\/\//i.test(from)) {
    throw new Error('invalid-from')
  }
  if (!to) {
    throw new Error('invalid-to')
  }
  if (RESERVED_PREFIXES.some((prefix) => from === prefix || from.startsWith(`${prefix}/`))) {
    throw new Error('reserved-from')
  }

  return { from, to }
}

export async function getRedirects(): Promise<Redirect[]> {
  const rows = getDb()
    .prepare('SELECT * FROM redirects ORDER BY created_at DESC')
    .all() as RedirectRow[]
  return rows.map(fromRow)
}

export async function findRedirect(path: string): Promise<Redirect | undefined> {
  const row = getDb().prepare('SELECT * FROM redirects WHERE from_path = ?').get(path) as
    | RedirectRow
    | undefined
  return row ? fromRow(row) : undefined
}

export async function addRedirect(input: {
  from: string
  to: string
  type: RedirectType
}): Promise<Redirect> {
  const { from, to } = validate(input)
  const redirect: Redirect = {
    id: randomUUID(),
    from,
    to,
    type: input.type === 'temporary' ? 'temporary' : 'permanent',
    createdAt: new Date().toISOString(),
  }
  try {
    getDb()
      .prepare(
        'INSERT INTO redirects (id, from_path, to_path, type, created_at) VALUES (@id, @from, @to, @type, @createdAt)',
      )
      .run(redirect)
  } catch (err) {
    if (err instanceof Error && err.message.includes('UNIQUE')) {
      throw new Error('duplicate-from')
    }
    throw err
  }
  return redirect
}

export async function updateRedirect(
  id: string,
  input: { from: string; to: string; type: RedirectType },
): Promise<Redirect | null> {
  const { from, to } = validate(input)
  const existing = getDb().prepare('SELECT * FROM redirects WHERE id = ?').get(id) as
    | RedirectRow
    | undefined
  if (!existing) return null

  const updated: Redirect = {
    id,
    from,
    to,
    type: input.type === 'temporary' ? 'temporary' : 'permanent',
    createdAt: existing.created_at,
  }
  try {
    getDb()
      .prepare('UPDATE redirects SET from_path = @from, to_path = @to, type = @type WHERE id = @id')
      .run(updated)
  } catch (err) {
    if (err instanceof Error && err.message.includes('UNIQUE')) {
      throw new Error('duplicate-from')
    }
    throw err
  }
  return updated
}

export async function deleteRedirect(id: string): Promise<boolean> {
  const result = getDb().prepare('DELETE FROM redirects WHERE id = ?').run(id)
  return result.changes > 0
}
