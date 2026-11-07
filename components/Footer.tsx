'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { localeFromPathname, type Locale } from '../lib/locale'
import { SOCIALS } from './Socials'

// Layout follows the academy footer (brand, contacts, help) plus the site menu.
// Legal details are the ones the payment provider expects to see on the site.
// "Освіта за кордоном" points at a separate live site, not a route in
// this project — see CLAUDE.md. Labels and hrefs mirror Header.tsx's NAV_ITEMS.
const NAV_ITEMS: Record<Locale, { href: string; label: string }[]> = {
  uk: [
    { href: '/', label: 'Головна' },
    { href: '/course', label: 'Курс' },
    { href: '/test', label: 'Тестування' },
    { href: 'https://studyway.com.ua', label: 'Освіта за кордоном' },
    { href: '/blog', label: 'Блог' },
    { href: '/feedback', label: 'Відгуки' },
    { href: '/contacts', label: 'Контакти' },
  ],
  ru: [
    { href: '/ru', label: 'Главная' },
    { href: '/ru/course', label: 'Курс' },
    { href: '/ru/test', label: 'Тестирование' },
    { href: 'https://studyway.com.ua/ru/', label: 'Образование за рубежом' },
    { href: '/ru/blog', label: 'Блог' },
    { href: '/ru/feedback', label: 'Отзывы' },
    { href: '/ru/contacts', label: 'Контакты' },
  ],
}

const PHONE = '+380663223011'
const EMAIL = 'admin@education-design.com.ua'
const OFFER_URL = 'https://academy.education-design.com.ua/oferta'

const STRINGS: Record<
  Locale,
  { brand: string; tagline: string; menu: string; contacts: string; company: string; code: string; address: string[]; help: string; offer: string }
> = {
  uk: {
    brand: 'Дизайн Освіти',
    tagline: 'Сучасна система освітнього проєктування',
    menu: 'Меню',
    contacts: 'Контакти',
    company: "ФОП Калабухова Мар'яна Василівна",
    code: 'РНОКПП: 3068920321',
    address: ['Україна, м. Київ,', 'вул. Тираспольська, 54'],
    help: 'Допомога',
    offer: 'Договір оферти',
  },
  ru: {
    brand: 'Дизайн Образования',
    tagline: 'Современная система образовательного проектирования',
    menu: 'Меню',
    contacts: 'Контакты',
    company: 'ФЛП Калабухова Марьяна Васильевна',
    code: 'РНУКПН: 3068920321',
    address: ['Украина, г. Киев,', 'ул. Тираспольская, 54'],
    help: 'Помощь',
    offer: 'Договор оферты',
  },
}

const HEADING = 'mb-4 text-base font-medium text-white'
const LINK = 'transition hover:text-white'

export default function Footer() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const t = STRINGS[locale]
  const homeHref = locale === 'ru' ? '/ru' : '/'

  return (
    <footer className="bg-[#1A1A1A] pt-12 pb-8 text-[15px] leading-6 text-white/60">
      <div className="mx-auto max-w-container px-4">
        <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1fr]">
          <div>
            <Link href={homeHref} className="mb-4 inline-flex items-center gap-2">
              <Image src="/images/logo.svg" alt="" width={20} height={17} />
              <span className="text-xl font-medium text-white">{t.brand}</span>
            </Link>
            <p className="mb-6 max-w-[260px]">{t.tagline}</p>
            <div className="flex gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:opacity-60"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label={t.menu}>
            <h2 className={HEADING}>{t.menu}</h2>
            <ul className="space-y-2">
              {NAV_ITEMS[locale].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={LINK}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={HEADING}>{t.contacts}</h2>
            <ul className="space-y-2">
              <li className="text-white">{t.company}</li>
              <li>{t.code}</li>
              <li>{t.address[0]}<br />{t.address[1]}</li>
              <li><a href={`tel:${PHONE}`} className={LINK}>{PHONE}</a></li>
              <li><a href={`mailto:${EMAIL}`} className={LINK}>{EMAIL}</a></li>
            </ul>
          </div>

          <div>
            <h2 className={HEADING}>{t.help}</h2>
            <ul className="space-y-2">
              <li><a href={OFFER_URL} className={LINK}>{t.offer}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-[13px]">
          © {new Date().getFullYear()} {t.brand}. {t.company}
        </div>
      </div>
    </footer>
  )
}
