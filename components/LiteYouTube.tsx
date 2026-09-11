'use client'

import { useState } from 'react'

// Loads a real YouTube <iframe> (~1.7MB of player JS) only after a click,
// instead of eagerly on page load. Before this, the embed alone accounted
// for the majority of the homepage's unused-JavaScript and LCP delay in
// PageSpeed Insights. The static thumbnail is a few KB by comparison.
export default function LiteYouTube({ videoId, title }: { videoId: string; title: string }) {
  const [play, setPlay] = useState(false)

  if (play) {
    return (
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      aria-label={title}
      className="group relative block h-full w-full"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube-hosted thumbnail, not a local asset next/image can optimize */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90">
          <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-primary">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  )
}
