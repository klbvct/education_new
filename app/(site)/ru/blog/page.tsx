import type { Metadata } from 'next'
import BlogListPage from '../../../../components/BlogListPage'

export const metadata: Metadata = {
  title: 'Блог — Дизайн Освіти',
  description: 'Статьи и советы об образовании за рубежом и карьерном консультировании.',
}

export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  return <BlogListPage locale="ru" page={searchParams.page} />
}
