import type { Metadata } from 'next'
import BlogListPage from '../../../../components/BlogListPage'
import { localizedAlternates } from '../../../../lib/seo'

export const dynamic = 'force-dynamic'

export function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string }
}): Metadata {
  const canonical =
    searchParams.page && searchParams.page !== '1'
      ? `/ru/blog?page=${searchParams.page}`
      : '/ru/blog'
  return {
    title: 'Блог — Дизайн Образования',
    description: 'Статьи и советы об образовании за рубежом и карьерном консультировании.',
    ...localizedAlternates({ canonical, uk: '/blog', ru: '/ru/blog' }),
  }
}

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  return <BlogListPage locale="ru" page={searchParams.page} />
}
