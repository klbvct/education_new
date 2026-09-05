import type { Metadata } from 'next'
import ContactsPage from '../../../../components/ContactsPage'

export const metadata: Metadata = {
  title: 'Контакты — Дизайн Освіти',
  description: 'Свяжитесь с нами: Telegram, адрес и контактная форма.',
}

export default function Page() {
  return <ContactsPage locale="ru" />
}
