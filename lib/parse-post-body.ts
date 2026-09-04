import type { BlogBlock, BlogPost, BlogSection } from './blog-posts'

// Lightweight Markdown-lite syntax for authoring/editing article bodies
// through the admin — see components/PostForm.tsx for the textarea that
// uses this, and app/admin/posts/*.
//
//   ## Заголовок розділу
//   [toc: Коротка назва]              (optional, right after the ## line)
//
//   Звичайний абзац. Посилання: [текст](url) і **жирний текст** —
//   інлайн-форматування, що вже підтримано рендером (не парситься тут,
//   зберігається в тексті блоку як є — див. renderRichText в
//   app/(site)/blog/[id]/page.tsx).
//
//   ### Підзаголовок
//
//   - пункт списку
//   - ще пункт
//
//   1. пункт нумерованого списку
//   2. інший пункт
//
//   ![Alt текст](/images/posts/xxxxx.webp)
//
// Text before the first "## " line is the post's `intro`. Blank lines
// separate blocks; consecutive "- "/"N. " lines group into one list block.

const HEADING_RE = /^##\s+(.+)$/
const TOC_RE = /^\[toc:\s*(.+)\]$/
const SUBHEADING_RE = /^###\s+(.+)$/
const UL_RE = /^-\s+(.+)$/
const OL_RE = /^\d+\.\s+(.+)$/
const IMAGE_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/

function parseBlocks(lines: string[]): BlogBlock[] {
  const blocks: BlogBlock[] = []
  let paragraphBuf: string[] = []
  let listBuf: { style: 'ordered' | 'unordered'; items: string[] } | null = null

  const flushParagraph = () => {
    if (paragraphBuf.length) {
      blocks.push({ type: 'paragraph', text: paragraphBuf.join(' ').trim() })
      paragraphBuf = []
    }
  }
  const flushList = () => {
    if (listBuf && listBuf.items.length) {
      blocks.push({ type: 'list', style: listBuf.style, items: listBuf.items })
    }
    listBuf = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (line === '') {
      flushParagraph()
      flushList()
      continue
    }

    const sub = line.match(SUBHEADING_RE)
    if (sub) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'subheading', text: sub[1].trim() })
      continue
    }

    const img = line.match(IMAGE_RE)
    if (img) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'image', src: img[2], alt: img[1] })
      continue
    }

    const ul = line.match(UL_RE)
    if (ul) {
      flushParagraph()
      if (!listBuf || listBuf.style !== 'unordered') {
        flushList()
        listBuf = { style: 'unordered', items: [] }
      }
      listBuf.items.push(ul[1].trim())
      continue
    }

    const ol = line.match(OL_RE)
    if (ol) {
      flushParagraph()
      if (!listBuf || listBuf.style !== 'ordered') {
        flushList()
        listBuf = { style: 'ordered', items: [] }
      }
      listBuf.items.push(ol[1].trim())
      continue
    }

    flushList()
    paragraphBuf.push(line)
  }
  flushParagraph()
  flushList()
  return blocks
}

function finishSection(heading: string, rawLines: string[]): BlogSection {
  const lines = [...rawLines]
  while (lines.length && lines[0].trim() === '') lines.shift()

  let tocLabel: string | undefined
  if (lines.length) {
    const tocMatch = lines[0].trim().match(TOC_RE)
    if (tocMatch) {
      tocLabel = tocMatch[1].trim()
      lines.shift()
    }
  }

  return {
    heading,
    ...(tocLabel ? { tocLabel } : {}),
    blocks: parseBlocks(lines),
  }
}

export function parsePostBody(raw: string): { intro: string[]; sections: BlogSection[] } {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')

  const sections: BlogSection[] = []
  const introLines: string[] = []
  let current: { heading: string; lines: string[] } | null = null

  for (const line of lines) {
    const h = line.trim().match(HEADING_RE)
    if (h) {
      if (current) sections.push(finishSection(current.heading, current.lines))
      current = { heading: h[1].trim(), lines: [] }
      continue
    }
    if (current) {
      current.lines.push(line)
    } else {
      introLines.push(line)
    }
  }
  if (current) sections.push(finishSection(current.heading, current.lines))

  const intro = parseBlocks(introLines)
    .filter((b): b is Extract<BlogBlock, { type: 'paragraph' }> => b.type === 'paragraph')
    .map((b) => b.text)

  return { intro, sections }
}

function blockToText(block: BlogBlock): string {
  if (block.type === 'paragraph') return block.text
  if (block.type === 'subheading') return `### ${block.text}`
  if (block.type === 'image') return `![${block.alt}](${block.src})`
  return block.items
    .map((item, i) => (block.style === 'ordered' ? `${i + 1}. ${item}` : `- ${item}`))
    .join('\n')
}

export function serializePostBody(post: Pick<BlogPost, 'intro' | 'sections'>): string {
  const chunks: string[] = []

  if (post.intro?.length) {
    chunks.push(post.intro.join('\n\n'))
  }

  for (const section of post.sections) {
    const blocks: BlogBlock[] =
      section.blocks ??
      (section.paragraphs ?? []).map((text) => ({ type: 'paragraph', text }) as BlogBlock)

    chunks.push(
      [
        `## ${section.heading}`,
        ...(section.tocLabel ? [`[toc: ${section.tocLabel}]`] : []),
        ...blocks.map(blockToText),
      ].join('\n\n'),
    )
  }

  return chunks.join('\n\n')
}
