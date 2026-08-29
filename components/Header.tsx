import Link from 'next/link'
import Image from 'next/image'

const NAV_ITEMS = [
  { href: '/', label: 'Головна' },
  { href: '/academy', label: 'Для спеціалістів' },
  { href: '/abroad', label: 'Освіта за кордоном' },
  { href: '/abroad', label: 'Блог' },
  { href: '/feedback', label: 'Відгуки' },
  { href: '/contacts', label: 'Контакти' },
  { href: '#', label: 'RU' },
]

export default function Header() {
  return (
    <header className="bg-white">
      <div className="mx-auto flex max-w-container items-center justify-between px-4 py-2">
        <Link href="/" className="block max-w-[56%] p-2">
          <Image
            src="/images/logo.svg"
            alt="Education Design — Дизайн Освіти"
            width={180}
            height={48}
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
      </div>
    </header>
  )
}
