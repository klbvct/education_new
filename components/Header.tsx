'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV_ITEMS = [
  { href: '/', label: 'Головна' },
  { href: '/academy', label: 'Для спеціалістів' },
  { href: '/abroad', label: 'Освіта за кордоном' },
  { href: '/blog', label: 'Блог' },
  { href: '/feedback', label: 'Відгуки' },
  { href: '/contacts', label: 'Контакти' },
  { href: '#', label: 'RU' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-shadow ${
        isScrolled ? 'shadow-[0_1px_12px_rgba(0,0,0,0.08)]' : ''
      }`}
    >
      <div
        className={`mx-auto flex max-w-container items-center justify-between px-4 transition-[padding] duration-300 ${
          isScrolled ? 'py-1' : 'py-2'
        }`}
      >
        <Link href="/" className="block max-w-[56%] p-2" onClick={() => setIsOpen(false)}>
          <Image
            src="/images/logo.svg"
            alt="Education Design — Дизайн Освіти"
            width={isScrolled ? 131 : 180}
            height={isScrolled ? 35 : 48}
            className="transition-all duration-300"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg text-dark transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center text-dark md:hidden"
        >
          {isOpen ? (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <nav className="flex flex-col border-t border-black/5 bg-bg-secondary px-4 py-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-black/5 py-3 text-lg text-dark transition-colors last:border-b-0 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
