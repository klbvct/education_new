import type { Metadata } from 'next'
import ContactsPage from '../../../components/ContactsPage'

export const metadata: Metadata = {
  title: 'Контакти — Дизайн Освіти',
  description: 'Зв’яжіться з нами: Telegram, адреса та контактна форма.',
}

export default function Page() {
  return <ContactsPage locale="uk" />
}
