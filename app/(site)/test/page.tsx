import type { Metadata } from 'next'
import TestingPage from '../../../components/TestingPage'
import { localizedAlternates, socialMeta } from '../../../lib/seo'

const title = 'Профорієнтаційне тестування — Дизайн Освіти'
const description = 'Пройдіть тест самостійно й отримайте повний звіт із персональними рекомендаціями у власному кабінеті.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/test', uk: '/test', ru: '/ru/test' }),
  ...socialMeta({ title, description, path: '/test', locale: 'uk' }),
}

export default function Page() {
  return <TestingPage locale="uk" />
}
