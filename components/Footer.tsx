import Link from 'next/link'
import Image from 'next/image'

const NAV_ITEMS = [
  { href: '/', label: 'Головна' },
  { href: '/abroad', label: 'За кордоном' },
  { href: '/feedback', label: 'Відгуки' },
  { href: '/contacts', label: 'Контакти' },
]

export default function Footer() {
  return (
    <footer className="bg-bg-secondary py-10">
      <div className="mx-auto flex max-w-container flex-col items-center px-4">
        <Link href="/" className="mb-8 block w-48">
          <Image
            src="/images/logo.svg"
            alt="Логотип Дизайн Освіти"
            width={180}
            height={48}
          />
        </Link>
        <nav className="mb-10 flex flex-wrap justify-center gap-10">
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
        <small className="text-sm text-dark">
          &copy; Усі права захищені ТОВ &quot;ОТЦ &quot;Європа&quot;
        </small>
      </div>
    </footer>
  )
}
