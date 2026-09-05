import type { Metadata } from 'next'
import BlogListPage from '../../../components/BlogListPage'
import { localizedAlternates } from '../../../lib/seo'

export const dynamic = 'force-dynamic'

export function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string }
}): Metadata {
  const canonical =
    searchParams.page && searchParams.page !== '1' ? `/blog?page=${searchParams.page}` : '/blog'
  return {
    title: 'Блог — Дизайн Освіти',
    description: 'Статті та поради про освіту за кордоном і кар’єрне консультування.',
    ...localizedAlternates({ canonical, uk: '/blog', ru: '/ru/blog' }),
  }
}

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  return <BlogListPage locale="uk" page={searchParams.page} />
}
