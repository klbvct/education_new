import type { Metadata } from 'next'
import FeedbackPage from '../../../components/FeedbackPage'
import { localizedAlternates, socialMeta } from '../../../lib/seo'

export const dynamic = 'force-dynamic'

const title = 'Відгуки — Дизайн Освіти'
const description = 'Відгуки клієнтів про консультації з Мар’яною Калабуховою.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/feedback', uk: '/feedback', ru: '/ru/feedback' }),
  ...socialMeta({ title, description, path: '/feedback', locale: 'uk' }),
}

export default function Page() {
  return <FeedbackPage locale="uk" />
}
