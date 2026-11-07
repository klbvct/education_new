'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'

// A stack of report pages, like the Swiper "cards" effect on the old landing, without the library.
// Pages flip on their own while the deck is on screen; hovering pauses, arrows and swipes flip by hand.
const DELAY = 2500

export default function ReportGallery({ images, alt, prevLabel, nextLabel }: { images: string[]; alt: string; prevLabel: string; nextLabel: string }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const startX = useRef<number | null>(null)
  const count = images.length
  const go = (step: number) => setIndex((i) => (i + step + count) % count)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), DELAY)
    return () => window.clearTimeout(timer)
  }, [index, visible, paused, count])

  const onPointerDown = (e: PointerEvent) => { startX.current = e.clientX }
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
  }

  return (
    <div ref={ref} className="mx-auto w-[260px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative aspect-[210/297] touch-pan-y select-none" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { startX.current = null }}>
        {images.map((src, i) => {
          const depth = (i - index + count) % count
          const shown = depth < 3
          return (
            <div
              key={src}
              aria-hidden={depth !== 0}
              className="absolute inset-0 overflow-hidden rounded-[16px] border border-black/[.06] bg-white shadow-[0_20px_40px_rgba(191,204,225,0.45)] transition-[transform,opacity] duration-500 ease-out"
              style={{
                zIndex: count - depth,
                opacity: shown ? 1 : 0,
                transform: shown ? `translate(${depth * 14}px, ${depth * 6}px) rotate(${depth * 3}deg) scale(${1 - depth * 0.04})` : 'translate(0, 0) scale(0.9)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={depth === 0 ? `${alt} ${i + 1}/${count}` : ''} loading="lazy" draggable={false} className="block h-full w-full object-cover object-top" />
            </div>
          )
        })}
      </div>
      <div className="mt-8 flex justify-center gap-4">
        {[[-1, prevLabel, 'm15 18-6-6 6-6'], [1, nextLabel, 'm9 18 6-6-6-6']].map(([step, label, d]) => (
          <button
            key={label as string}
            type="button"
            aria-label={label as string}
            onClick={() => go(step as number)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[.08] bg-white text-dark transition hover:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={d as string} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
