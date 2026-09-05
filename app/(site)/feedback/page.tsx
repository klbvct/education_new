import type { Metadata } from 'next'
import FeedbackPage from '../../../components/FeedbackPage'
import { localizedAlternates } from '../../../lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Відгуки — Дизайн Освіти',
  description: 'Відгуки клієнтів про консультації з Мар’яною Калабуховою.',
  ...localizedAlternates({ canonical: '/feedback', uk: '/feedback', ru: '/ru/feedback' }),
}

export default function Page() {
  return <FeedbackPage locale="uk" />
}
