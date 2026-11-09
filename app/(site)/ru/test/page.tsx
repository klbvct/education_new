import type { Metadata } from 'next'
import TestingPage from '../../../../components/TestingPage'
import { localizedAlternates, socialMeta } from '../../../../lib/seo'

const title = 'Профильное тестирование для подростков — Дизайн Образования'
const description = 'Тест для подростков от 14 лет: сильные стороны, способности и направления обучения. Подробный отчёт и персональные рекомендации в личном кабинете.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/ru/test', uk: '/test', ru: '/ru/test' }),
  ...socialMeta({ title, description, path: '/ru/test', locale: 'ru' }),
}

export default function Page() {
  return <TestingPage locale="ru" />
}
