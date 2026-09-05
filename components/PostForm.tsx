'use client'

import { useRef, useState } from 'react'
import { SITE_TITLE_SUFFIX } from '../lib/blog-posts'
import { slugify } from '../lib/slugify'

// Yoast-style SEO length ranges: below `min` is too short, above `max` is
// too long, in between is the sweet spot Google tends not to truncate.
const TITLE_SEO_RANGE = { min: 40, max: 60 }
const DESCRIPTION_SEO_RANGE = { min: 120, max: 156 }

function seoLengthHint(length: number, { min, max }: { min: number; max: number }) {
  if (length === 0) return { className: 'text-gray-400', label: `0 символів — рекомендовано ${min}–${max}` }
  if (length < min) return { className: 'text-orange-500', label: `${length} символів — закороткий, рекомендовано ${min}–${max}` }
  if (length > max) return { className: 'text-red-500', label: `${length} символів — задовгий, рекомендовано ${min}–${max}` }
  return { className: 'text-green-600', label: `${length} символів — добра довжина (${min}–${max})` }
}

type TranslationFields = { title: string; excerpt: string; body: string }

type PostFormProps = {
  mode: 'new' | 'edit'
  initial: {
    id: string
    title: string
    excerpt: string
    date: string
    body: string
  }
  initialRu?: TranslationFields | null
}

const inputClass =
  'h-12 w-full rounded-[16px] border border-black/10 bg-bg-secondary px-4 text-[16px] outline-none transition focus:border-primary focus:bg-white'

export default function PostForm({ mode, initial, initialRu }: PostFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [id, setId] = useState(initial.id)
  const [idTouched, setIdTouched] = useState(mode === 'edit' || initial.id !== '')
  const [title, setTitle] = useState(initial.title)
  const [excerpt, setExcerpt] = useState(initial.excerpt)
  const [date, setDate] = useState(initial.date)
  const [body, setBody] = useState(initial.body)

  const [titleRu, setTitleRu] = useState(initialRu?.title ?? '')
  const [excerptRu, setExcerptRu] = useState(initialRu?.excerpt ?? '')
  const [bodyRu, setBodyRu] = useState(initialRu?.body ?? '')

  const [activeLang, setActiveLang] = useState<'uk' | 'ru'>('uk')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const showTabs = mode === 'edit'
  const activeTitle = activeLang === 'ru' ? titleRu : title
  const activeExcerpt = activeLang === 'ru' ? excerptRu : excerpt
  const activeBody = activeLang === 'ru' ? bodyRu : body
  const setActiveTitle = activeLang === 'ru' ? setTitleRu : setTitle
  const setActiveExcerpt = activeLang === 'ru' ? setExcerptRu : setExcerpt
  const setActiveBody = activeLang === 'ru' ? setBodyRu : setBody

  const titleSeo = seoLengthHint(`${activeTitle}${SITE_TITLE_SUFFIX}`.length, TITLE_SEO_RANGE)
  const excerptSeo = seoLengthHint(activeExcerpt.length, DESCRIPTION_SEO_RANGE)

  function insertAtCursor(snippet: string) {
    const el = textareaRef.current
    if (!el) {
      setActiveBody((b) => `${b}\n\n${snippet}\n\n`)
      return
    }
    const start = el.selectionStart ?? activeBody.length
    const end = el.selectionEnd ?? activeBody.length
    const next = `${activeBody.slice(0, start)}\n\n${snippet}\n\n${activeBody.slice(end)}`
    setActiveBody(next)
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + snippet.length + 4
      el.setSelectionRange(pos, pos)
    })
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/uploads', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Не вдалося завантажити файл')
        return
      }
      insertAtCursor(`![${file.name}](${data.url})`)
    } catch {
      setError('Не вдалося завантажити файл')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)
    try {
      const url = mode === 'new' ? '/api/admin/posts' : `/api/admin/posts/${initial.id}`
      const method = mode === 'new' ? 'POST' : 'PUT'
      const payload: Record<string, string> = { id, title, excerpt, date, body }
      if (mode === 'edit') {
        payload.titleRu = titleRu
        payload.excerptRu = excerptRu
        payload.bodyRu = bodyRu
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Не вдалося зберегти статтю')
        return
      }
      setSuccess(true)
    } catch {
      setError('Не вдалося з’єднатися з сервером. Перевірте з’єднання і спробуйте ще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="max-w-2xl">
        <label className="mb-2 block text-[16px] font-medium" htmlFor="id">
          URL статті (/blog/...)
        </label>
        <input
          id="id"
          value={id}
          onChange={(e) => {
            setId(e.target.value)
            setIdTouched(true)
          }}
          disabled={mode === 'edit'}
          required
          pattern="[a-z0-9-]+"
          className={`${inputClass} disabled:opacity-60`}
          placeholder="yak-obraty-profesiyu"
        />
        {mode === 'new' && (
          <p className="mt-1 text-xs text-gray-500">
            {idTouched
              ? 'Змінено вручну — більше не оновлюється із заголовка.'
              : 'Генерується автоматично із заголовка — можна змінити вручну.'}
          </p>
        )}
        {mode === 'edit' && (
          <p className="mt-1 text-xs text-gray-500">
            Спільний для обох мов — статтю RU буде видно за тією ж адресою під «/ru».
          </p>
        )}
      </div>

      <div className="max-w-2xl">
        <label className="mb-2 block text-[16px] font-medium" htmlFor="date">
          Дата
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      {showTabs && (
        <div className="flex gap-1 rounded-full bg-bg-secondary p-1" style={{ width: 'fit-content' }}>
          <button
            type="button"
            onClick={() => setActiveLang('uk')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeLang === 'uk' ? 'bg-primary text-white' : 'text-dark hover:text-primary'
            }`}
          >
            Українська
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('ru')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeLang === 'ru' ? 'bg-primary text-white' : 'text-dark hover:text-primary'
            }`}
          >
            Російська {!titleRu && <span className="opacity-70">— не перекладено</span>}
          </button>
        </div>
      )}

      <div className="max-w-2xl">
        <label className="mb-2 block text-[16px] font-medium" htmlFor="title">
          Заголовок
        </label>
        <input
          id="title"
          value={activeTitle}
          onChange={(e) => {
            const value = e.target.value
            setActiveTitle(value)
            if (mode === 'new' && activeLang === 'uk' && !idTouched) setId(slugify(value))
          }}
          required={activeLang === 'uk'}
          className={inputClass}
        />
        <p className={`mt-1 text-xs ${titleSeo.className}`}>{titleSeo.label}</p>
      </div>

      <div className="max-w-2xl">
        <label className="mb-2 block text-[16px] font-medium" htmlFor="excerpt">
          Короткий опис (для SEO — мета-опис сторінки статті)
        </label>
        <textarea
          id="excerpt"
          value={activeExcerpt}
          onChange={(e) => setActiveExcerpt(e.target.value)}
          required={activeLang === 'uk'}
          rows={2}
          className="w-full resize-none rounded-2xl border border-black/10 bg-bg-secondary px-4 py-3 text-[16px] outline-none transition focus:border-primary focus:bg-white"
        />
        <p className={`mt-1 text-xs ${excerptSeo.className}`}>{excerptSeo.label}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-stretch">
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-[16px] font-medium" htmlFor="body">
              Текст статті
            </label>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="h-9 rounded-full border border-black/10 px-4 text-sm text-dark transition hover:border-primary hover:text-primary disabled:opacity-50"
              >
                {isUploading ? 'Завантаження…' : 'Вставити фото'}
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            id="body"
            value={activeBody}
            onChange={(e) => setActiveBody(e.target.value)}
            required={activeLang === 'uk'}
            className="w-full min-h-[560px] flex-1 resize-y rounded-2xl border border-black/10 bg-bg-secondary px-4 py-3 font-mono text-sm leading-6 outline-none transition focus:border-primary focus:bg-white"
          />
        </div>

        <aside className="rounded-2xl border border-black/10 bg-bg-secondary p-5 text-sm leading-6 text-dark lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 font-medium">Як розмічати текст</p>

          <div className="mb-3">
            <p className="font-medium">Вступ</p>
            <p className="text-gray-600">
              Текст на самому початку, до першого рядка з «## », — вступні абзаци перед статтею.
            </p>
          </div>

          <div className="mb-3">
            <p className="font-medium">
              <code className="rounded bg-black/5 px-1 py-0.5">## Заголовок</code> — розділ
            </p>
            <p className="text-gray-600">
              Кожен такий рядок починає новий розділ статті (він же підзаголовок у тексті).
              Якщо розділів два або більше, над статтею автоматично з&apos;являється блок
              «Про що поговоримо» зі списком-змістом — його не треба створювати вручну.
            </p>
          </div>

          <div className="mb-3">
            <p className="font-medium">
              <code className="rounded bg-black/5 px-1 py-0.5">[toc: коротка назва]</code>
            </p>
            <p className="text-gray-600">
              Необов&apos;язковий рядок одразу під «## Заголовок». Якщо заголовок розділу
              довгий, тут можна задати коротшу назву — саме вона (а не весь заголовок)
              покажеться в списку «Про що поговоримо».
            </p>
          </div>

          <div className="mb-3">
            <p className="font-medium">
              <code className="rounded bg-black/5 px-1 py-0.5">### Підзаголовок</code>
            </p>
            <p className="text-gray-600">Менший підзаголовок усередині розділу.</p>
          </div>

          <div className="mb-3">
            <p className="font-medium">Списки</p>
            <p className="text-gray-600">
              Рядки <code className="rounded bg-black/5 px-1 py-0.5">- пункт</code> — маркований
              список; рядки{' '}
              <code className="rounded bg-black/5 px-1 py-0.5">1. пункт</code>,{' '}
              <code className="rounded bg-black/5 px-1 py-0.5">2. пункт</code> — нумерований.
            </p>
          </div>

          <div className="mb-3">
            <p className="font-medium">
              <code className="rounded bg-black/5 px-1 py-0.5">![alt](адреса)</code> — фото
            </p>
            <p className="text-gray-600">
              Простіше через кнопку «Вставити фото» вище — вона сама завантажить файл і
              вставить цей рядок у потрібне місце.
            </p>
          </div>

          <div className="mb-3">
            <p className="font-medium">
              <code className="rounded bg-black/5 px-1 py-0.5">[текст](url)</code> — посилання
            </p>
            <p className="text-gray-600">Посилання прямо всередині абзацу.</p>
          </div>

          <div className="mb-3">
            <p className="font-medium">
              <code className="rounded bg-black/5 px-1 py-0.5">**жирний текст**</code>
            </p>
            <p className="text-gray-600">Жирний текст прямо всередині абзацу.</p>
          </div>

          <div>
            <p className="font-medium">Абзаци</p>
            <p className="text-gray-600">
              Порожній рядок розділяє абзаци та інші блоки один від одного.
            </p>
          </div>
        </aside>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">
          {mode === 'new' ? 'Статтю успішно опубліковано.' : 'Зміни успішно збережено.'}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex h-14 items-center justify-center gap-2 self-start rounded-[32px] bg-primary px-8 text-base text-white transition hover:opacity-60 disabled:opacity-50 lg:h-12"
      >
        {isSubmitting ? 'Збереження…' : mode === 'new' ? 'Опублікувати' : 'Зберегти'}
      </button>
    </form>
  )
}
