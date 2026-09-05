// One-off: builds redirects from the live WordPress site's URLs
// (post/page/category sitemaps) to this project's routes.
//   - the 7 already-migrated posts (+ the 1 pre-existing translated
//     post) get an exact redirect to their new /blog/<id> URL, uk+ru
//   - every other WP post URL (not yet migrated) redirects to home
//   - category archive URLs redirect to home (no category pages here)
//   - a handful of renamed static pages redirect to their new path
// See lib/redirects.ts for the schema this writes into.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const Database = require('better-sqlite3')

const SCRATCH =
  'C:\\Users\\kalab\\AppData\\Local\\Temp\\claude\\C--Users-kalab-Downloads-Dev-education-redesign\\1f625085-8701-4ce4-b5b1-5eda47732814\\scratchpad'

function locs(file) {
  const xml = fs.readFileSync(path.join(SCRATCH, file), 'utf8')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
}

// Old WP path (uk, ru) -> this project's shared post id.
const MIGRATED = {
  '/trendi-v-osviti/kudi-vstupati-pislya-11-klasu': 'kudi-vstupati-pislya-11-klasu',
  '/ru/trendy-v-obrazovanii/kuda-postupat-posle-11-klassa': 'kudi-vstupati-pislya-11-klasu',
  '/trendi-v-osviti/kudi-krashhe-vstupati-do-koledzhu-chi-universitetu-ukrayinczyam':
    'kudi-krashhe-vstupati-do-koledzhu-chi-universitetu-ukrayinczyam',
  '/ru/trendy-v-obrazovanii/kuda-luchshe-postupat-v-kolledzh-ili-universitet-ukrainczam':
    'kudi-krashhe-vstupati-do-koledzhu-chi-universitetu-ukrayinczyam',
  '/proforientacia/proforiyentacziya-dlya-doroslikh': 'proforiyentacziya-dlya-doroslikh',
  '/ru/proforientatsiya-ru/proforientacziya-dlya-vzroslykh': 'proforiyentacziya-dlya-doroslikh',
  '/batkam/kudi-postupati-pislya-9-klasu': 'kudi-postupati-pislya-9-klasu',
  '/ru/roditelyam/kuda-postupat-posle-9-klassa': 'kudi-postupati-pislya-9-klasu',
  '/batkam/vstup-na-magistraturu': 'vstup-na-magistraturu',
  '/ru/roditelyam/nuzhno-li-ukrainskim-studentam-postuplenie-na-magistraturu': 'vstup-na-magistraturu',
  '/proforientacia/test-na-proforiyentacziyu-dlya-pidlitkiv': 'test-na-proforiyentacziyu-dlya-pidlitkiv',
  '/ru/proforientatsiya-ru/test-na-proforientacziyu-dlya-podrostkov':
    'test-na-proforiyentacziyu-dlya-pidlitkiv',
  '/proforientacia/test-na-profesiyu-dlya-pidlitka': 'test-na-profesiiu-dlia-pidlitka',
  '/ru/proforientatsiya-ru/test-na-professiyu-dlya-podrostka': 'test-na-profesiiu-dlia-pidlitka',
}

// Already-resolvable in the new project as-is, or explicitly held off
// per the site owner (the /abroad-equivalent page — going to a separate
// domain, not this project) — skip these entirely.
const SKIP = new Set([
  '/',
  '/ru/contacts',
  '/ru/blog',
  '/konsultacziya-z-ekspertom-z-osviti-za-kordonom',
  '/ru/konsultacziya-po-obrazovaniyu-za-rubezhom',
])

// Renamed static pages: old WP path -> new path.
const PAGE_RENAMES = {
  '/kontakty': '/contacts',
  '/vidguky': '/feedback',
  '/blog-uk': '/blog',
  '/ru/home': '/ru',
}

function buildRedirects() {
  const redirects = []
  const seen = new Set()
  const push = (from, to) => {
    if (seen.has(from)) return // a URL can appear in more than one sitemap (blog-uk: post+page)
    seen.add(from)
    redirects.push({ from, to })
  }

  for (const p of locs('page-sitemap.xml')) {
    if (SKIP.has(p)) continue
    if (PAGE_RENAMES[p]) push(p, PAGE_RENAMES[p])
  }

  for (const p of locs('category-sitemap.xml')) {
    push(p, p.startsWith('/ru/') ? '/ru' : '/')
  }

  for (const p of locs('post-sitemap.xml')) {
    if (SKIP.has(p)) continue
    if (PAGE_RENAMES[p]) {
      push(p, PAGE_RENAMES[p])
      continue
    }
    if (MIGRATED[p]) {
      const id = MIGRATED[p]
      push(p, p.startsWith('/ru/') ? `/ru/blog/${id}` : `/blog/${id}`)
    } else {
      push(p, p.startsWith('/ru/') ? '/ru' : '/')
    }
  }

  return redirects
}

function main() {
  const redirects = buildRedirects()

  if (process.argv.includes('--dry')) {
    for (const r of redirects) console.log(r.from, '->', r.to)
    console.log('total:', redirects.length)
    return
  }

  const db = new Database(path.join(process.cwd(), 'data', 'app.db'))
  const existing = db.prepare('SELECT from_path FROM redirects WHERE from_path = ?')
  const insert = db.prepare(
    `INSERT INTO redirects (id, from_path, to_path, type, created_at) VALUES (@id, @from, @to, @type, @createdAt)`,
  )

  let created = 0
  let skipped = 0
  for (const r of redirects) {
    if (existing.get(r.from)) {
      skipped++
      continue
    }
    insert.run({
      id: crypto.randomUUID(),
      from: r.from,
      to: r.to,
      type: 'permanent',
      createdAt: new Date().toISOString(),
    })
    created++
  }

  console.log(`created ${created} redirects, skipped ${skipped} (already existed)`)
  db.close()
}

main()
