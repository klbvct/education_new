import type { Metadata } from 'next'
import CoursePage from '../../../components/CoursePage'
import { localizedAlternates, socialMeta } from '../../../lib/seo'

const title = 'Курс для фахівців з освітнього консультування — Дизайн Освіти'
const description =
  'Онлайн-курс для освітніх консультантів, психологів і педагогів: авторська методологія «Дизайн Освіти» замість класичної профорієнтації. 4 модулі, старт 26.11.2026.'

export const metadata: Metadata = {
  title,
  description,
  ...localizedAlternates({ canonical: '/course', uk: '/course', ru: '/ru/course' }),
  ...socialMeta({ title, description, path: '/course', locale: 'uk' }),
}

export default function Page() {
  return <CoursePage locale="uk" />
}
