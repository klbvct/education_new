import type { Metadata } from 'next'
import ContactsPage from '../../../components/ContactsPage'
import { localizedAlternates, socialMeta } from '../../../lib/seo'

const title = 'Контакти — Дизайн Освіти'
const description = 'Зв’яжіться з нами: Telegram, адреса та контактна форма.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/contacts', uk: '/contacts', ru: '/ru/contacts' }),
  ...socialMeta({ title, description, path: '/contacts', locale: 'uk' }),
}

export default function Page() {
  return <ContactsPage locale="uk" />
}
