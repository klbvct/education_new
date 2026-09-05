import type { Metadata } from 'next'
import HomePage from '../../../components/HomePage'
import { homeContentRu } from '../../../content/ru/home'
import { localizedAlternates, socialMeta } from '../../../lib/seo'

const title = 'Дизайн Образования — современная система образовательного проектирования'
const description =
  'Индивидуальная образовательная траектория, профильное тестирование и консультации по образованию, обучению и карьере.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/ru', uk: '/', ru: '/ru' }),
  ...socialMeta({ title, description, path: '/ru', locale: 'ru' }),
}

export default function Page() {
  return <HomePage content={homeContentRu} locale="ru" />
}
