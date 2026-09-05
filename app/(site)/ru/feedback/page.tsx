import type { Metadata } from 'next'
import FeedbackPage from '../../../../components/FeedbackPage'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Отзывы — Дизайн Образования',
  description: 'Отзывы клиентов о консультациях с Марьяной Калабуховой.',
}

export default function Page() {
  return <FeedbackPage locale="ru" />
}
