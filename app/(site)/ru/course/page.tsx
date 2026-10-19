import type { Metadata } from 'next'
import CoursePage from '../../../../components/CoursePage'
import { localizedAlternates, socialMeta } from '../../../../lib/seo'

const title = 'Курс для специалистов по образовательному консультированию — Дизайн Образования'
const description =
  'Онлайн-курс для образовательных консультантов, психологов и педагогов: авторская методология «Дизайн Образования» вместо классической профориентации. 4 модуля, старт 26.11.2026.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/ru/course', uk: '/course', ru: '/ru/course' }),
  ...socialMeta({ title, description, path: '/ru/course', locale: 'ru' }),
}

export default function Page() {
  return <CoursePage locale="ru" />
}
