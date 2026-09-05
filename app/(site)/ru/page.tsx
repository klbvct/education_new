import type { Metadata } from 'next'
import HomePage from '../../../components/HomePage'
import { homeContentRu } from '../../../content/ru/home'

export const metadata: Metadata = {
  title: 'Дизайн Освіти — современная система образовательного проектирования',
  description:
    'Индивидуальная образовательная траектория, профильное тестирование и консультации по образованию, обучению и карьере.',
}

export default function Page() {
  return <HomePage content={homeContentRu} locale="ru" />
}
