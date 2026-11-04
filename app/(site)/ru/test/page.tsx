import type { Metadata } from 'next'
import TestingPage from '../../../../components/TestingPage'
import { localizedAlternates, socialMeta } from '../../../../lib/seo'

const title = 'Профориентационное тестирование — Дизайн Образования'
const description = 'Пройдите тест самостоятельно и получите полный отчёт с персональными рекомендациями в собственном кабинете.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/ru/test', uk: '/test', ru: '/ru/test' }),
  ...socialMeta({ title, description, path: '/ru/test', locale: 'ru' }),
}

export default function Page() {
  return <TestingPage locale="ru" />
}
