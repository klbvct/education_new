import type { Metadata } from 'next'
import CoursePage from '../../../components/CoursePage'
import { localizedAlternates, socialMeta } from '../../../lib/seo'

const title = 'Курс для спеціалістів — Дизайн Освіти'
const description = 'Курс для спеціалістів від "Дизайн Освіти": програма, вартість і форма запису.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/course', uk: '/course', ru: '/ru/course' }),
  ...socialMeta({ title, description, path: '/course', locale: 'uk' }),
}

export default function Page() {
  return <CoursePage locale="uk" />
}
