import type { Metadata } from 'next'
import ContactRequestForm from '../../components/ContactRequestForm'

export const metadata: Metadata = {
  title: 'Контакти — Дизайн Освіти',
  description: 'Зв’яжіться з нами: Telegram, адреса та контактна форма.',
}

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/MarianaKalabukhova',
    icon: (props: { className?: string }) => (
      <svg viewBox="0 0 320 512" fill="currentColor" className={props.className} aria-hidden="true">
        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/mariana_klb/',
    icon: (props: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Telegram',
    href: 'https://t.me/edu_carrier_design',
    icon: (props: { className?: string }) => (
      <svg viewBox="0 0 448 512" fill="currentColor" className={props.className} aria-hidden="true">
        <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
      </svg>
    ),
  },
]

export default function ContactsPage() {
  return (
    <main className="bg-bg-base">
      <section className="mx-auto max-w-container px-4 py-16 md:px-16 lg:px-28">
        <h1 className="sr-only">Контакти</h1>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="pl-6 md:pl-10 md:pt-10">
            <h2 className="mb-6 text-2xl font-medium">Контактна інформація</h2>

            <a
              href="https://t.me/mariana_klb"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 inline-flex h-14 items-center justify-center gap-2 rounded-[32px] border border-black/10 px-6 text-base text-dark transition hover:border-primary hover:text-primary lg:h-12"
            >
              <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
              </svg>
              Написати в Telegram
            </a>

            <address className="mb-8 not-italic leading-6">
              м. Київ, вул. Тираспольська, 54
            </address>

            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 text-dark transition hover:border-primary hover:text-primary"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-[0_38px_56px_rgba(191,204,225,0.4)] md:p-10">
            <ContactRequestForm />
          </div>
        </div>
      </section>
    </main>
  )
}
