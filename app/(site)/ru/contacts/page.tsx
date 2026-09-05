import type { Metadata } from 'next'
import ContactsPage from '../../../../components/ContactsPage'
import { localizedAlternates } from '../../../../lib/seo'

export const metadata: Metadata = {
  title: 'Контакты — Дизайн Образования',
  description: 'Свяжитесь с нами: Telegram, адрес и контактная форма.',
  ...localizedAlternates({ canonical: '/ru/contacts', uk: '/contacts', ru: '/ru/contacts' }),
}

export default function Page() {
  return <ContactsPage locale="ru" />
}
