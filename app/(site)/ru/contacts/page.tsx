import type { Metadata } from 'next'
import ContactsPage from '../../../../components/ContactsPage'
import { localizedAlternates, socialMeta } from '../../../../lib/seo'

const title = 'Контакты — Дизайн Образования'
const description = 'Свяжитесь с нами: Telegram, адрес и контактная форма.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/ru/contacts', uk: '/contacts', ru: '/ru/contacts' }),
  ...socialMeta({ title, description, path: '/ru/contacts', locale: 'ru' }),
}

export default function Page() {
  return <ContactsPage locale="ru" />
}
