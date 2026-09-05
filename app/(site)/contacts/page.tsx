import type { Metadata } from 'next'
import ContactsPage from '../../../components/ContactsPage'
import { localizedAlternates } from '../../../lib/seo'

export const metadata: Metadata = {
  title: 'Контакти — Дизайн Освіти',
  description: 'Зв’яжіться з нами: Telegram, адреса та контактна форма.',
  ...localizedAlternates({ canonical: '/contacts', uk: '/contacts', ru: '/ru/contacts' }),
}

export default function Page() {
  return <ContactsPage locale="uk" />
}
