'use client'

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
    { href: '/ru', label: 'Главная' },
    { href: '/ru/academy', label: 'Для специалистов' },
    { href: '/ru/abroad', label: 'Образование за рубежом' },
    { href: '/ru/blog', label: 'Блог' },
    { href: '/ru/feedback', label: 'Отзывы' },
    { href: '/ru/contacts', label: 'Контакты' },
  ],
}

const COPYRIGHT: Record<Locale, string> = {
  uk: '© Усі права захищені ТОВ "ОТЦ "ЄВРОПА"',
  ru: '© Все права защищены ООО "ОТЦ "ЕВРОПА"',
}

export default function Footer() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const homeHref = locale === 'ru' ? '/ru' : '/'

  return (
    <footer className="bg-[#1A1A1A] py-10">
      <div className="mx-auto flex max-w-container flex-col items-center px-4">
        <Link href={homeHref} className="mb-8 flex items-center gap-2">
          <Image src="/images/logo.svg" alt="" width={20} height={17} />
          <span className="text-xl font-semibold text-primary">Дизайн Освіти</span>
        </Link>
        <nav className="mb-10 flex flex-wrap justify-center gap-10">
          {NAV_ITEMS[locale].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg text-white/80 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <small className="text-sm text-white/50">{COPYRIGHT[locale]}</small>
      </div>
    </footer>
  )
}
