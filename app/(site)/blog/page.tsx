import type { Metadata } from 'next'
import BlogListPage from '../../../components/BlogListPage'

export const metadata: Metadata = {
  title: 'Блог — Дизайн Освіти',
  description: 'Статті та поради про освіту за кордоном і кар’єрне консультування.',
}

export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  return <BlogListPage locale="uk" page={searchParams.page} />
}
