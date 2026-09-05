import type { Metadata } from 'next'
import HomePage from '../../components/HomePage'
import { homeContentUk } from '../../content/uk/home'
import { localizedAlternates } from '../../lib/seo'

export const metadata: Metadata = {
  title: 'Дизайн Освіти — сучасна система освітнього проєктування',
  description:
    "Індивідуальна освітня траєкторія, профільне тестування та консультації з освіти, навчання і кар'єри.",
  ...localizedAlternates({ canonical: '/', uk: '/', ru: '/ru' }),
}

export default function Page() {
  return <HomePage content={homeContentUk} locale="uk" />
}
