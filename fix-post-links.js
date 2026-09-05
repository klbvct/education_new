// One-off: fixes inline [text](url) links inside the migrated posts'
// body content (intro/sections, both uk and ru):
//   1. WP's own in-page TOC anchors (`#1`, `#2`, ...) have no matching
//      target on this site — stripped back to plain text.
//   2. Bare `#` placeholders whose anchor text names a now-migrated
//      article get the real internal URL filled in.
//   3. Links to the live WordPress domain (often at decayed old slugs
//      with a date suffix the live site itself has since dropped) get
//      rewritten to this site's own URL — the matching migrated
//      article, or home if that content isn't migrated here.
const path = require('path')
const Database = require('better-sqlite3')

// Final URL segment (old WP slug, uk or ru) -> this project's shared post id.
// Same 7 posts as migrate-wp-redirects.js's MIGRATED map, keyed by slug only.
const SLUG_TO_ID = {
  'kudi-vstupati-pislya-11-klasu': 'kudi-vstupati-pislya-11-klasu',
  'kuda-postupat-posle-11-klassa': 'kudi-vstupati-pislya-11-klasu',
  'kudi-krashhe-vstupati-do-koledzhu-chi-universitetu-ukrayinczyam':
    'kudi-krashhe-vstupati-do-koledzhu-chi-universitetu-ukrayinczyam',
  'kuda-luchshe-postupat-v-kolledzh-ili-universitet-ukrainczam':
    'kudi-krashhe-vstupati-do-koledzhu-chi-universitetu-ukrayinczyam',
  'proforiyentacziya-dlya-doroslikh': 'proforiyentacziya-dlya-doroslikh',
  'proforientacziya-dlya-vzroslykh': 'proforiyentacziya-dlya-doroslikh',
  'kudi-postupati-pislya-9-klasu': 'kudi-postupati-pislya-9-klasu',
  'kuda-postupat-posle-9-klassa': 'kudi-postupati-pislya-9-klasu',
  'vstup-na-magistraturu': 'vstup-na-magistraturu',
  'nuzhno-li-ukrainskim-studentam-postuplenie-na-magistraturu': 'vstup-na-magistraturu',
  'test-na-proforiyentacziyu-dlya-pidlitkiv': 'test-na-proforiyentacziyu-dlya-pidlitkiv',
  'test-na-proforientacziyu-dlya-podrostkov': 'test-na-proforiyentacziyu-dlya-pidlitkiv',
  'test-na-profesiyu-dlya-pidlitka': 'test-na-profesiiu-dlia-pidlitka',
  'test-na-professiyu-dlya-podrostka': 'test-na-profesiiu-dlia-pidlitka',
}

// Anchor text (as it literally appears, lowercased/trimmed) -> post id,
// for the `#` placeholder links in test-na-profesiiu-dlia-pidlitka that
// were written before these other articles existed on this site.
const ANCHOR_TEXT_TO_ID = {
  'тест на профорієнтацію для підлітків і школярів у 2027 році': 'test-na-proforiyentacziyu-dlya-pidlitkiv',
  'тест на профориентацию для подростков и школьников в 2027 году': 'test-na-proforiyentacziyu-dlya-pidlitkiv',
  'куди краще вступати в коледж чи університет українцям у 2027 році?':
    'kudi-krashhe-vstupati-do-koledzhu-chi-universitetu-ukrayinczyam',
  'куда лучше поступать в колледж или университет украинцам в 2027 году?':
    'kudi-krashhe-vstupati-do-koledzhu-chi-universitetu-ukrayinczyam',
  'профорієнтація для дорослих у 2027 році': 'proforiyentacziya-dlya-doroslikh',
  'профориентация для взрослых в 2027 году': 'proforiyentacziya-dlya-doroslikh',
  'чи потрібен українським студентам вступ на магістратуру у 2027 році?': 'vstup-na-magistraturu',
  'нужно ли украинским студентам поступление в магистратуру в 2027 году?': 'vstup-na-magistraturu',
  'куди вступати після 11 класу у 2027 році?': 'kudi-vstupati-pislya-11-klasu',
  'куда поступать после 11 класса в 2027 году?': 'kudi-vstupati-pislya-11-klasu',
  'куди вступати після 9 класу у 2027 році?': 'kudi-postupati-pislya-9-klasu',
  'куда поступать после 9 класса в 2027 году?': 'kudi-postupati-pislya-9-klasu',
}

const DATE_SUFFIX_RE = /-(u-\d{4}-roczi|v-\d{4}-godu|\d{4})$/

function homePath(locale) {
  return locale === 'ru' ? '/ru' : '/'
}

function blogPath(id, locale) {
  return locale === 'ru' ? `/ru/blog/${id}` : `/blog/${id}`
}

function resolveWpUrl(rawUrl, locale) {
  let pathname
  try {
    pathname = new URL(rawUrl).pathname
  } catch {
    return null
  }
  let segments = pathname.split('/').filter(Boolean)
  if (segments[0] === 'ru' || segments[0] === 'uk') segments = segments.slice(1)
  if (segments.length === 0 || segments[segments.length - 1] === 'home') {
    return homePath(locale)
  }
  const last = segments[segments.length - 1]
  if (last === 'contacts' || last === 'kontakty') {
    return locale === 'ru' ? '/ru/contacts' : '/contacts'
  }
  const cleaned = last.replace(DATE_SUFFIX_RE, '')
  const id = SLUG_TO_ID[cleaned] || SLUG_TO_ID[last]
  if (id) return blogPath(id, locale)
  return homePath(locale) // unmigrated content — matches this site's own redirect strategy
}

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

function fixText(text, locale) {
  return text.replace(LINK_RE, (match, anchor, url) => {
    if (/^#\d+$/.test(url)) return anchor // WP in-page TOC anchor, no target here
    if (url === '#') {
      const id = ANCHOR_TEXT_TO_ID[anchor.trim().toLowerCase()]
      return id ? `[${anchor}](${blogPath(id, locale)})` : match
    }
    if (/^https?:\/\/education-design\.com\.ua/i.test(url)) {
      const resolved = resolveWpUrl(url, locale)
      return resolved ? `[${anchor}](${resolved})` : match
    }
    return match
  })
}

function fixSections(sections, locale) {
  let changed = false
  for (const s of sections) {
    for (const b of s.blocks || []) {
      if (b.type === 'paragraph') {
        const fixed = fixText(b.text, locale)
        if (fixed !== b.text) {
          b.text = fixed
          changed = true
        }
      }
      if (b.type === 'list') {
        b.items = b.items.map((item) => {
          const fixed = fixText(item, locale)
          if (fixed !== item) changed = true
          return fixed
        })
      }
    }
  }
  return changed
}

function main() {
  const db = new Database(path.join(process.cwd(), 'data', 'app.db'))
  const rows = db.prepare('SELECT id, intro, sections, intro_ru, sections_ru FROM posts').all()
  const update = db.prepare(
    'UPDATE posts SET intro = @intro, sections = @sections, intro_ru = @intro_ru, sections_ru = @sections_ru WHERE id = @id',
  )

  for (const row of rows) {
    let changed = false

    const intro = row.intro ? JSON.parse(row.intro) : null
    if (intro) {
      const fixed = intro.map((t) => fixText(t, 'uk'))
      if (JSON.stringify(fixed) !== JSON.stringify(intro)) changed = true
      row.intro = fixed.length ? JSON.stringify(fixed) : null
    }

    const sections = JSON.parse(row.sections)
    if (fixSections(sections, 'uk')) changed = true
    row.sections = JSON.stringify(sections)

    if (row.intro_ru) {
      const introRu = JSON.parse(row.intro_ru)
      const fixed = introRu.map((t) => fixText(t, 'ru'))
      if (JSON.stringify(fixed) !== JSON.stringify(introRu)) changed = true
      row.intro_ru = fixed.length ? JSON.stringify(fixed) : null
    }

    if (row.sections_ru) {
      const sectionsRu = JSON.parse(row.sections_ru)
      if (fixSections(sectionsRu, 'ru')) changed = true
      row.sections_ru = JSON.stringify(sectionsRu)
    }

    if (changed) {
      update.run(row)
      console.log('fixed links in:', row.id)
    }
  }

  db.close()
}

main()
