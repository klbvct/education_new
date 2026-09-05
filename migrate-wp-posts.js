// One-off migration script: pulls specific articles from the live
// WordPress site (education-design.com.ua) via its REST API, converts
// the Gutenberg-block HTML into this project's BlogPost shape (see
// lib/blog-posts.ts / lib/parse-post-body.ts), downloads referenced
// images into public/images/posts/, and inserts the posts directly into
// data/app.db. Run from the repo root: `node migrate-wp-posts.js`.
// Delete this file once the migration is done — it's not part of the app.

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const Database = require('better-sqlite3')

const WP_BASE = 'https://education-design.com.ua'
// Pass slugs as CLI args (node migrate-wp-posts.js slug-one slug-two) to
// migrate specific posts; falls back to this list (the first migrated
// batch) when run with no args.
const SLUGS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      'kudi-vstupati-pislya-11-klasu',
      'kudi-krashhe-vstupati-do-koledzhu-chi-universitetu-ukrayinczyam',
      'proforiyentacziya-dlya-doroslikh',
      'kudi-postupati-pislya-9-klasu',
      'vstup-na-magistraturu',
    ]

const POSTS_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'posts')

// --- HTML/entity helpers -----------------------------------------------

function decodeEntities(str) {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()
}

// Converts inline HTML (inside a paragraph/list-item/heading) into the
// project's inline syntax: **bold** and [text](url), same as
// renderRichText in components/BlogArticlePage.tsx expects.
function inlineToText(html) {
  let s = html
  s = s.replace(/<br\s*\/?>/gi, ' ')
  s = s.replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, '**$2**')
  s = s.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
  s = s.replace(/<[^>]+>/g, '')
  s = decodeEntities(s)
  return s.replace(/\s+/g, ' ').trim()
}

function extractImage(figureHtml) {
  const imgTag = (figureHtml.match(/<img[^>]*>/) || [''])[0]
  const src = (imgTag.match(/\ssrc="([^"]+)"/) || [])[1]
  const alt = (imgTag.match(/\salt="([^"]*)"/) || [])[1] || ''
  return src ? { src, alt: decodeEntities(alt) } : null
}

// Flattens the top-level Gutenberg block HTML into an ordered list of
// {type, ...} nodes. Only the tags actually seen on this site's posts
// are handled (h2/h3/p/ul/ol/figure/blockquote) — see the scan done
// before writing this script.
function extractNodes(html) {
  const BLOCK_RE =
    /<h2[^>]*>([\s\S]*?)<\/h2>|<h3[^>]*>([\s\S]*?)<\/h3>|<blockquote[^>]*>([\s\S]*?)<\/blockquote>|<figure[^>]*>([\s\S]*?)<\/figure>|<ul[^>]*>([\s\S]*?)<\/ul>|<ol[^>]*>([\s\S]*?)<\/ol>|<p[^>]*>([\s\S]*?)<\/p>/g

  const nodes = []
  let m
  while ((m = BLOCK_RE.exec(html))) {
    const [, h2, h3, quote, figure, ul, ol, p] = m
    if (h2 !== undefined) {
      nodes.push({ type: 'heading', text: inlineToText(h2) })
    } else if (h3 !== undefined) {
      nodes.push({ type: 'subheading', text: inlineToText(h3) })
    } else if (quote !== undefined) {
      const inner = [...quote.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((x) => x[1])
      const paras = inner.length ? inner : [quote]
      for (const para of paras) {
        const text = inlineToText(para)
        if (text) nodes.push({ type: 'paragraph', text })
      }
    } else if (figure !== undefined) {
      const img = extractImage(figure)
      if (img) nodes.push({ type: 'image', src: img.src, alt: img.alt })
    } else if (ul !== undefined || ol !== undefined) {
      const src = ul !== undefined ? ul : ol
      const items = [...src.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)]
        .map((x) => inlineToText(x[1]))
        .filter(Boolean)
      if (items.length) nodes.push({ type: 'list', style: ul !== undefined ? 'unordered' : 'ordered', items })
    } else if (p !== undefined) {
      const text = inlineToText(p)
      if (text) nodes.push({ type: 'paragraph', text })
    }
  }
  return nodes
}

// Splits the flat node list into { intro, sections } matching the
// BlogPost shape. Anything before the first heading becomes intro
// (paragraph text only — the type has no room for images there), with
// any non-paragraph pre-heading nodes (e.g. a lead image) prepended
// onto the first section's own blocks instead of being dropped.
function toBlogPost({ id, title, excerpt, date, html }) {
  const nodes = extractNodes(html)

  const firstHeadingIndex = nodes.findIndex((n) => n.type === 'heading')
  const preNodes = firstHeadingIndex === -1 ? nodes : nodes.slice(0, firstHeadingIndex)
  const rest = firstHeadingIndex === -1 ? [] : nodes.slice(firstHeadingIndex)

  const intro = preNodes.filter((n) => n.type === 'paragraph').map((n) => n.text)
  const leadBlocks = preNodes.filter((n) => n.type !== 'paragraph')

  const sections = []
  let current = null
  for (const node of rest) {
    if (node.type === 'heading') {
      if (current) sections.push(current)
      current = { heading: node.text, blocks: [] }
      continue
    }
    if (!current) continue // shouldn't happen, rest starts at first heading
    current.blocks.push(node)
  }
  if (current) sections.push(current)

  if (leadBlocks.length && sections.length) {
    sections[0].blocks = [...leadBlocks, ...sections[0].blocks]
  }

  return { id, title, excerpt, date, intro, sections }
}

// --- fetching ------------------------------------------------------------

async function fetchPost(slug) {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/posts?slug=${slug}&_embed=true`)
  if (!res.ok) throw new Error(`WP API ${res.status} for slug ${slug}`)
  const data = await res.json()
  const post = data[0]
  if (!post) throw new Error(`No WP post found for slug ${slug}`)
  return post
}

const imageCache = new Map()

async function downloadImage(url) {
  if (imageCache.has(url)) return imageCache.get(url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image fetch ${res.status}: ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const ext = (path.extname(new URL(url).pathname).slice(1) || 'jpg').toLowerCase()
  const filename = `${crypto.randomUUID()}.${ext}`
  fs.mkdirSync(POSTS_IMAGES_DIR, { recursive: true })
  fs.writeFileSync(path.join(POSTS_IMAGES_DIR, filename), buffer)
  const localUrl = `/images/posts/${filename}`
  imageCache.set(url, localUrl)
  return localUrl
}

async function localizeImages(post) {
  for (const section of post.sections) {
    for (const block of section.blocks) {
      if (block.type === 'image') {
        block.src = await downloadImage(block.src)
      }
    }
  }
}

// --- main ------------------------------------------------------------

async function main() {
  const db = new Database(path.join(process.cwd(), 'data', 'app.db'))
  const insert = db.prepare(
    `INSERT INTO posts (id, title, excerpt, date, intro, sections) VALUES (@id, @title, @excerpt, @date, @intro, @sections)`,
  )
  const existing = db.prepare('SELECT id FROM posts WHERE id = ?')

  for (const slug of SLUGS) {
    const wpPost = await fetchPost(slug)
    const id = slug
    if (existing.get(id)) {
      console.log(`skip (already exists): ${id}`)
      continue
    }

    const post = toBlogPost({
      id,
      title: stripTags(wpPost.title.rendered),
      excerpt: stripTags(wpPost.excerpt.rendered).replace(/\[…\]\s*$/, '').trim(),
      date: wpPost.date.slice(0, 10),
      html: wpPost.content.rendered,
    })

    await localizeImages(post)

    insert.run({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      intro: post.intro.length ? JSON.stringify(post.intro) : null,
      sections: JSON.stringify(post.sections),
    })

    const imageCount = post.sections.reduce(
      (n, s) => n + s.blocks.filter((b) => b.type === 'image').length,
      0,
    )
    console.log(`imported: ${id} (${post.sections.length} sections, ${imageCount} images)`)
  }

  db.close()
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

module.exports = { WP_BASE, stripTags, toBlogPost, fetchPost, localizeImages }
