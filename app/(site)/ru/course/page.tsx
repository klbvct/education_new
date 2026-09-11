import type { Metadata } from 'next'
import CoursePage from '../../../../components/CoursePage'
import { localizedAlternates, socialMeta } from '../../../../lib/seo'

const title = 'Курс для специалистов — Дизайн Образования'
const description = 'Курс для специалистов от "Дизайн Образования": программа, стоимость и форма записи.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/ru/course', uk: '/course', ru: '/ru/course' }),
  ...socialMeta({ title, description, path: '/ru/course', locale: 'ru' }),
}

export default function Page() {
  return <CoursePage locale="ru" />
}
