import type { Metadata } from 'next'
import TestingPage from '../../../components/TestingPage'
import { localizedAlternates, socialMeta } from '../../../lib/seo'

const title = 'Профільне тестування для підлітків — Дизайн Освіти'
const description = 'Тест для підлітків від 14 років: сильні сторони, здібності й напрями навчання. Детальний звіт і персональні рекомендації в особистому кабінеті.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/test', uk: '/test', ru: '/ru/test' }),
  ...socialMeta({ title, description, path: '/test', locale: 'uk' }),
}

export default function Page() {
  return <TestingPage locale="uk" />
}
