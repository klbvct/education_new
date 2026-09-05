import Link from 'next/link'
import Image from 'next/image'

const NAV_ITEMS = [
  { href: '/', label: 'Головна' },
  { href: '/academy', label: 'Для спеціалістів' },
  { href: '/abroad', label: 'Освіта за кордоном' },
  { href: '/blog', label: 'Блог' },
  { href: '/feedback', label: 'Відгуки' },
  { href: '/contacts', label: 'Контакти' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-10">
      <div className="mx-auto flex max-w-container flex-col items-center px-4">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Image src="/images/logo.svg" alt="" width={20} height={17} />
          <span className="text-xl font-semibold text-primary">Дизайн Освіти</span>
        </Link>
        <nav className="mb-10 flex flex-wrap justify-center gap-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg text-white/80 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <small className="text-sm text-white/50">
          &copy; Усі права захищені ТОВ &quot;ОТЦ &quot;ЄВРОПА&quot;
        </small>
      </div>
    </footer>
  )
}
