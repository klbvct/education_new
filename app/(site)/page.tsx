import type { Metadata } from 'next'
import HomePage from '../../components/HomePage'
import { homeContentUk } from '../../content/uk/home'
import { localizedAlternates, socialMeta } from '../../lib/seo'

const title = 'Дизайн Освіти — сучасна система освітнього проєктування'
const description =
  "Індивідуальна освітня траєкторія, профільне тестування та консультації з освіти, навчання і кар'єри."

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/', uk: '/', ru: '/ru' }),
  ...socialMeta({ title, description, path: '/', locale: 'uk' }),
}

export default function Page() {
  return <HomePage content={homeContentUk} locale="uk" />
}
