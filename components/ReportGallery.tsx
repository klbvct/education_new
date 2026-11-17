'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'

// A stack of report pages, like the Swiper "cards" effect on the old landing, without the library.
// Pages flip on their own while the deck is on screen; hovering pauses. No arrows: a click or tap
// on the deck flips to the next page, a swipe flips either way.
const DELAY = 900
const SWIPE = 40

export default function ReportGallery({ images, alt, nextLabel }: { images: string[]; alt: string; nextLabel: string }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const startX = useRef<number | null>(null)
  const swiped = useRef(false)
  const count = images.length
  const go = (step: number) => setIndex((i) => (i + step + count) % count)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Restarts on every index change, so a manual flip also resets the timer
  useEffect(() => {
    if (!visible || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), DELAY)
    return () => window.clearTimeout(timer)
  }, [index, visible, paused, count])

  const onPointerDown = (e: PointerEvent) => { startX.current = e.clientX; swiped.current = false }
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > SWIPE) { swiped.current = true; go(dx < 0 ? 1 : -1) }
  }
  // A swipe also ends in a click; skip that one so the swipe doesn't flip twice
  const onClick = () => { if (swiped.current) swiped.current = false; else go(1) }

  return (
    <div ref={ref} className="mx-auto w-[260px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <button
        type="button"
        aria-label={nextLabel}
        className="relative block aspect-[210/297] w-full cursor-pointer touch-pan-y select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { startX.current = null }}
        onClick={onClick}
      >
        {images.map((src, i) => {
          const depth = (i - index + count) % count
          const shown = depth < 3
          return (
            <div
              key={src}
              aria-hidden={depth !== 0}
              className="absolute inset-0 overflow-hidden rounded-[16px] border border-black/[.06] bg-white shadow-[0_16px_29px_-8px_rgba(225,231,242,0.5)] transition-[transform,opacity] duration-200 ease-out"
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
      </button>
    </div>
  )
}
