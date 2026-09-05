import type { Metadata } from 'next'
import BlogListPage from '../../../../components/BlogListPage'
import { localizedAlternates, socialMeta } from '../../../../lib/seo'

export const dynamic = 'force-dynamic'

const title = 'Блог — Дизайн Образования'
const description = 'Статьи и советы об образовании за рубежом и карьерном консультировании.'

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
    title,
    description,
    ...localizedAlternates({ canonical, uk: '/blog', ru: '/ru/blog' }),
    ...socialMeta({ title, description, path: canonical, locale: 'ru' }),
  }
}

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  return <BlogListPage locale="ru" page={searchParams.page} />
}
