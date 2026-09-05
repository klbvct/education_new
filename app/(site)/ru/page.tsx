import type { Metadata } from 'next'
import HomePage from '../../../components/HomePage'
import { homeContentRu } from '../../../content/ru/home'
import { localizedAlternates } from '../../../lib/seo'

export const metadata: Metadata = {
  title: 'Дизайн Образования — современная система образовательного проектирования',
  description:
    'Индивидуальная образовательная траектория, профильное тестирование и консультации по образованию, обучению и карьере.',
  ...localizedAlternates({ canonical: '/ru', uk: '/', ru: '/ru' }),
}

export default function Page() {
  return <HomePage content={homeContentRu} locale="ru" />
}
