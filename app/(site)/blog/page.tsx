import type { Metadata } from 'next'
import BlogListPage from '../../../components/BlogListPage'
import { localizedAlternates, socialMeta } from '../../../lib/seo'

export const dynamic = 'force-dynamic'

const title = 'Блог — Дизайн Освіти'
const description = 'Статті та поради про освіту за кордоном і кар’єрне консультування.'

export function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string }
}): Metadata {
  const canonical =
    searchParams.page && searchParams.page !== '1' ? `/blog?page=${searchParams.page}` : '/blog'
  return {
    title,
    description,
    ...localizedAlternates({ canonical, uk: '/blog', ru: '/ru/blog' }),
    ...socialMeta({ title, description, path: canonical, locale: 'uk' }),
  }
}

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  return <BlogListPage locale="uk" page={searchParams.page} />
}
