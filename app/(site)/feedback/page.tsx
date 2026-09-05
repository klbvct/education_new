import type { Metadata } from 'next'
import FeedbackPage from '../../../components/FeedbackPage'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Відгуки — Дизайн Освіти',
  description: 'Відгуки клієнтів про консультації з Мар’яною Калабуховою.',
}

export default function Page() {
  return <FeedbackPage locale="uk" />
}
