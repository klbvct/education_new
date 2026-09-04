import { promises as fs } from 'fs'
import path from 'path'
import type { BlogPost } from './blog-posts'

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json')
const SEED_FILE = path.join(process.cwd(), 'data', 'posts.seed.json')

// Serializes reads/writes within this process so concurrent requests
// can't interleave and corrupt the JSON file.
let queue: Promise<unknown> = Promise.resolve()

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const result = queue.then(fn, fn)
  queue = result.catch(() => undefined)
  return result
}

// data/posts.json is the live, mutable store and is gitignored on
// purpose — same split as data/reviews.json: it's bootstrapped from the
// committed seed file on first run so a fresh deploy still ships with
// the existing 18 articles, without a later `git pull` ever overwriting
// posts added or edited through the admin.
async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE)
  } catch {
    const seed = await fs.readFile(SEED_FILE, 'utf-8').catch(() => '[]')
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, seed, 'utf-8')
  }
}

async function readAll(): Promise<BlogPost[]> {
  await ensureDataFile()
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw) as BlogPost[]
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }
}

async function writeAll(posts: BlogPost[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8')
}

export async function getPosts(): Promise<BlogPost[]> {
  const posts = await readAll()
  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPost(id: string): Promise<BlogPost | undefined> {
  const posts = await readAll()
  return posts.find((p) => p.id === id)
}

export async function addPost(
  input: Omit<BlogPost, 'id'> & { id: string },
): Promise<BlogPost> {
  return withLock(async () => {
    const posts = await readAll()
    if (posts.some((p) => p.id === input.id)) {
      throw new Error('duplicate-id')
    }
    const post: BlogPost = { ...input }
    posts.push(post)
    await writeAll(posts)
    return post
  })
}

export async function updatePost(
  id: string,
  input: Omit<BlogPost, 'id'>,
): Promise<BlogPost | null> {
  return withLock(async () => {
    const posts = await readAll()
    const index = posts.findIndex((p) => p.id === id)
    if (index === -1) return null
    const updated: BlogPost = { ...input, id }
    posts[index] = updated
    await writeAll(posts)
    return updated
  })
}
