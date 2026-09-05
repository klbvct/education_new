import type { Metadata } from 'next'
import FeedbackPage from '../../../../components/FeedbackPage'
import { localizedAlternates, socialMeta } from '../../../../lib/seo'

export const dynamic = 'force-dynamic'

const title = 'Отзывы — Дизайн Образования'
const description = 'Отзывы клиентов о консультациях с Марьяной Калабуховой.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/ru/feedback', uk: '/feedback', ru: '/ru/feedback' }),
  ...socialMeta({ title, description, path: '/ru/feedback', locale: 'ru' }),
}

export default function Page() {
  return <FeedbackPage locale="ru" />
}
