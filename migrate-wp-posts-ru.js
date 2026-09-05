// Companion to migrate-wp-posts.js: fills in the _ru translation columns
// of already-migrated posts from the matching Russian-category post on
// the live WordPress site (the site keeps uk/ru as separate posts under
// mirrored categories, not a translation plugin, so each pair had to be
// matched by hand — see the mapping below).
const path = require('path')
const Database = require('better-sqlite3')
const { toBlogPost, fetchPost, localizeImages, stripTags } = require('./migrate-wp-posts')

// uk post id -> matching ru post's WP slug
const RU_SLUGS = {
  'kudi-vstupati-pislya-11-klasu': 'kuda-postupat-posle-11-klassa',
  'kudi-krashhe-vstupati-do-koledzhu-chi-universitetu-ukrayinczyam':
    'kuda-luchshe-postupat-v-kolledzh-ili-universitet-ukrainczam',
  'proforiyentacziya-dlya-doroslikh': 'proforientacziya-dlya-vzroslykh',
  'kudi-postupati-pislya-9-klasu': 'kuda-postupat-posle-9-klassa',
  'vstup-na-magistraturu': 'nuzhno-li-ukrainskim-studentam-postuplenie-na-magistraturu',
  'test-na-proforiyentacziyu-dlya-pidlitkiv': 'test-na-proforientacziyu-dlya-podrostkov',
}

async function main() {
  const db = new Database(path.join(process.cwd(), 'data', 'app.db'))
  const update = db.prepare(
    `UPDATE posts SET title_ru = @title, excerpt_ru = @excerpt, intro_ru = @intro, sections_ru = @sections WHERE id = @id`,
  )
  const existing = db.prepare('SELECT title_ru FROM posts WHERE id = ?')

  for (const [id, ruSlug] of Object.entries(RU_SLUGS)) {
    const row = existing.get(id)
    if (!row) {
      console.log(`skip (no uk post): ${id}`)
      continue
    }
    if (row.title_ru) {
      console.log(`skip (already translated): ${id}`)
      continue
    }

    const wpPost = await fetchPost(ruSlug)
    const post = toBlogPost({
      id,
      title: stripTags(wpPost.title.rendered),
      excerpt: stripTags(wpPost.excerpt.rendered).replace(/\[…\]\s*$/, '').trim(),
      date: wpPost.date.slice(0, 10),
      html: wpPost.content.rendered,
    })

    await localizeImages(post)

    update.run({
      id,
      title: post.title,
      excerpt: post.excerpt,
      intro: post.intro.length ? JSON.stringify(post.intro) : null,
      sections: JSON.stringify(post.sections),
    })

    const imageCount = post.sections.reduce(
      (n, s) => n + s.blocks.filter((b) => b.type === 'image').length,
      0,
    )
    console.log(`translated: ${id} <- ${ruSlug} (${post.sections.length} sections, ${imageCount} images)`)
  }

  db.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
