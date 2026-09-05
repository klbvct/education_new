'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { localeFromPathname, type Locale } from '../lib/locale'

const NAV_ITEMS: Record<Locale, { href: string; label: string }[]> = {
  uk: [
    { href: '/', label: 'Головна' },
    { href: '/academy', label: 'Для спеціалістів' },
    { href: '/abroad', label: 'Освіта за кордоном' },
    { href: '/blog', label: 'Блог' },
    { href: '/feedback', label: 'Відгуки' },
    { href: '/contacts', label: 'Контакти' },
  ],
  ru: [
    { href: '/', label: 'Главная' },
    { href: '/academy', label: 'Для специалистов' },
    { href: '/abroad', label: 'Образование за рубежом' },
    { href: '/blog', label: 'Блог' },
    { href: '/feedback', label: 'Отзывы' },
    { href: '/contacts', label: 'Контакты' },
  ],
}

const MENU_LABELS: Record<Locale, { open: string; close: string }> = {
  uk: { open: 'Відкрити меню', close: 'Закрити меню' },
  ru: { open: 'Открыть меню', close: 'Закрыть меню' },
}

// Strips the /ru prefix to get the equivalent Ukrainian path, for the
// RU<->UA toggle link — see NAV_ITEMS.ru's own hrefs above for the
// reverse direction.
function toUkPathname(pathname: string) {
  const stripped = pathname.slice('/ru'.length)
  return stripped === '' ? '/' : stripped
}

export default function Header() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const homeHref = locale === 'ru' ? '/ru' : '/'
  const isHome = pathname === homeHref
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = NAV_ITEMS[locale]
  const toggleHref =
    locale === 'ru' ? toUkPathname(pathname) : pathname === '/' ? '/ru' : `/ru${pathname}`
  const toggleLabel = locale === 'ru' ? 'UA' : 'RU'
  const menuLabels = MENU_LABELS[locale]

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
        {isHome ? (
          <span className="flex max-w-[56%] items-center gap-2 p-2">
            <Image src="/images/logo.svg" alt="" width={24} height={21} priority />
            <span className="text-lg font-semibold text-dark md:text-2xl">Дизайн Освіти</span>
          </span>
        ) : (
          <Link
            href={homeHref}
            className="flex max-w-[56%] items-center gap-2 p-2"
            onClick={() => setIsOpen(false)}
          >
            <Image src="/images/logo.svg" alt="" width={24} height={21} priority />
            <span className="text-lg font-semibold text-dark md:text-2xl">Дизайн Освіти</span>
          </Link>
        )}

        <nav className="hidden items-center gap-10 md:flex">
          {navItems
            .filter((item) => !isHome || item.href !== homeHref)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg transition-colors hover:text-primary ${
                  pathname === item.href ? 'text-primary' : 'text-dark'
                }`}
              >
                {item.label}
              </Link>
            ))}
          <Link
            href={toggleHref}
            className="text-lg text-dark transition-colors hover:text-primary"
          >
            {toggleLabel}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? menuLabels.close : menuLabels.open}
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
          {navItems
            .filter((item) => !isHome || item.href !== homeHref)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`border-b border-black/5 py-3 text-lg transition-colors last:border-b-0 hover:text-primary ${
                  pathname === item.href ? 'text-primary' : 'text-dark'
                }`}
              >
                {item.label}
              </Link>
            ))}
          <Link
            href={toggleHref}
            onClick={() => setIsOpen(false)}
            className="border-b border-black/5 py-3 text-lg text-dark transition-colors last:border-b-0 hover:text-primary"
          >
            {toggleLabel}
          </Link>
        </nav>
      )}
    </header>
  )
}
