'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { localeFromPathname, type Locale } from '../lib/locale'

// "Освіта за кордоном" points at a separate live site, not a route in
// this project — see CLAUDE.md.
const NAV_ITEMS: Record<Locale, { href: string; label: string }[]> = {
  uk: [
    { href: '/course', label: 'Курс' },
    { href: '/', label: 'Головна' },
    { href: 'https://studyway.com.ua', label: 'Освіта за кордоном' },
    { href: '/blog', label: 'Блог' },
    { href: '/feedback', label: 'Відгуки' },
    { href: '/contacts', label: 'Контакти' },
  ],
  ru: [
    { href: '/ru/course', label: 'Курс' },
    { href: '/ru', label: 'Главная' },
    { href: 'https://studyway.com.ua/ru/', label: 'Образование за рубежом' },
    { href: '/ru/blog', label: 'Блог' },
    { href: '/ru/feedback', label: 'Отзывы' },
    { href: '/ru/contacts', label: 'Контакты' },
  ],
}

// Specialists get academy access only by taking the course, so the header
// sends them straight to the academy's login page (an account icon), not
// to its public landing page.
const ACADEMY_LOGIN_HREF = 'https://academy.education-design.com.ua/login'
const ACADEMY_LOGIN_LABEL: Record<Locale, string> = {
  uk: 'Вхід для фахівців',
  ru: 'Вход для специалистов',
}

const BRAND_NAME: Record<Locale, string> = {
  uk: 'Дизайн Освіти',
  ru: 'Дизайн Образования',
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
          <span className="flex max-w-[75%] items-center gap-2 p-2 md:max-w-[56%]">
            <Image src="/images/logo.svg" alt="" width={24} height={21} priority />
            <span className="whitespace-nowrap text-lg font-semibold text-dark md:text-2xl">{BRAND_NAME[locale]}</span>
          </span>
        ) : (
          <Link
            href={homeHref}
            className="flex max-w-[75%] items-center gap-2 p-2 md:max-w-[56%]"
            onClick={() => setIsOpen(false)}
          >
            <Image src="/images/logo.svg" alt="" width={24} height={21} priority />
            <span className="whitespace-nowrap text-lg font-semibold text-dark md:text-2xl">{BRAND_NAME[locale]}</span>
          </Link>
        )}

        <div className="flex items-center gap-1 md:gap-10">
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

          <a
            href={ACADEMY_LOGIN_HREF}
            aria-label={ACADEMY_LOGIN_LABEL[locale]}
            title={ACADEMY_LOGIN_LABEL[locale]}
            className="flex h-10 w-10 items-center justify-center rounded-full text-dark transition-colors hover:text-primary"
          >
            {/* "fi-rr-user" from Flaticon's Uicons (Regular Rounded) — same icon
                family as the /course hero arrow. */}
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path transform="translate(6 0)" d="M6 12C7.18669 12 8.34673 11.6481 9.33342 10.9888C10.3201 10.3295 11.0892 9.39246 11.5433 8.2961C11.9974 7.19975 12.1162 5.99335 11.8847 4.82946C11.6532 3.66558 11.0818 2.59648 10.2426 1.75736C9.40353 0.918247 8.33443 0.346802 7.17054 0.115291C6.00666 -0.11622 4.80026 0.00259972 3.7039 0.456726C2.60754 0.910851 1.67047 1.67989 1.01118 2.66658C0.351894 3.65328 0 4.81331 0 6C0.00158843 7.59081 0.63424 9.11602 1.75911 10.2409C2.88399 11.3658 4.40919 11.9984 6 12ZM6 2C6.79113 2 7.56448 2.2346 8.22228 2.67412C8.88008 3.11365 9.39277 3.73836 9.69552 4.46927C9.99827 5.20017 10.0775 6.00444 9.92314 6.78036C9.7688 7.55629 9.38784 8.26902 8.82843 8.82843C8.26902 9.38784 7.55629 9.7688 6.78036 9.92314C6.00444 10.0775 5.20017 9.99827 4.46927 9.69552C3.73836 9.39277 3.11365 8.88008 2.67412 8.22228C2.2346 7.56449 2 6.79113 2 6C2 4.93914 2.42143 3.92172 3.17157 3.17158C3.92172 2.42143 4.93913 2 6 2V2Z" />
              <path transform="translate(3 14)" d="M9 0C6.61386 0.00264685 4.32622 0.951708 2.63896 2.63896C0.951708 4.32622 0.00264685 6.61386 0 9C0 9.26522 0.105357 9.51957 0.292893 9.70711C0.48043 9.89464 0.734784 10 1 10C1.26522 10 1.51957 9.89464 1.70711 9.70711C1.89464 9.51957 2 9.26522 2 9C2 7.14348 2.7375 5.36301 4.05025 4.05025C5.36301 2.7375 7.14348 2 9 2C10.8565 2 12.637 2.7375 13.9497 4.05025C15.2625 5.36301 16 7.14348 16 9C16 9.26522 16.1054 9.51957 16.2929 9.70711C16.4804 9.89464 16.7348 10 17 10C17.2652 10 17.5196 9.89464 17.7071 9.70711C17.8946 9.51957 18 9.26522 18 9C17.9974 6.61386 17.0483 4.32622 15.361 2.63896C13.6738 0.951708 11.3861 0.00264685 9 0V0Z" />
            </svg>
          </a>

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
