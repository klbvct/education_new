import type { Metadata } from 'next'
import FeedbackPage from '../../../../components/FeedbackPage'
import { localizedAlternates } from '../../../../lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Отзывы — Дизайн Образования',
  description: 'Отзывы клиентов о консультациях с Марьяной Калабуховой.',
  ...localizedAlternates({ canonical: '/ru/feedback', uk: '/feedback', ru: '/ru/feedback' }),
}

export default function Page() {
  return <FeedbackPage locale="ru" />
}
