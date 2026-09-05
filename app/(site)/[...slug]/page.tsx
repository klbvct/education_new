import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { findRedirect } from '../../../lib/redirects'

export const dynamic = 'force-dynamic'

// Next.js only reaches this route when nothing more specific under
// app/(site) matched — the right place to check the admin-managed
// redirects table (see lib/redirects.ts) without touching middleware.ts
// (Edge runtime there can't load better-sqlite3, a native addon).
export default async function CatchAllPage({ params }: { params: { slug: string[] } }) {
  const path = `/${params.slug.join('/')}`
  const found = await findRedirect(path)

  if (found) {
    if (found.type === 'temporary') redirect(found.to)
    permanentRedirect(found.to)
  }

  notFound()
}
