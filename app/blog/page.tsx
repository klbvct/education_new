import type { Metadata } from 'next'
import BlogPagination from '../../components/BlogPagination'

export const metadata: Metadata = {
  title: 'Блог — Дизайн Освіти',
  description: 'Статті та поради про освіту за кордоном і кар’єрне консультування.',
}

type BlogPost = {
  id: string
  title: string
  excerpt: string
  date: string
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Як обрати країну для навчання: покроковий гід',
    excerpt:
      'Розповідаємо, на що звернути увагу під час вибору країни та університету — від вартості життя до визнання диплома в Україні.',
    date: '2026-08-20',
  },
  {
    id: 'post-2',
    title: '5 навичок, які варто розвивати ще під час навчання',
    excerpt:
      'Які soft і hard skills найчастіше запитують роботодавці та як почати прокачувати їх, не чекаючи диплома.',
    date: '2026-08-12',
  },
  {
    id: 'post-3',
    title: 'Як підтримати дитину у виборі майбутньої професії',
    excerpt:
      'Практичні поради для батьків: як говорити про кар’єру без тиску та допомогти дитині прийняти власне рішення.',
    date: '2026-07-30',
  },
  {
    id: 'post-4',
    title: 'Типові помилки під час підготовки документів для вступу',
    excerpt:
      'Розбираємо, чому вступники найчастіше отримують відмову і як цього уникнути ще на етапі підготовки.',
    date: '2026-07-18',
  },
  {
    id: 'post-5',
    title: 'Стипендії та гранти: де шукати та як подаватися',
    excerpt:
      'Огляд програм фінансової підтримки для українських студентів і покрокова інструкція подачі заявки.',
    date: '2026-07-05',
  },
  {
    id: 'post-6',
    title: 'Мотиваційний лист: як написати так, щоб запам’ятали',
    excerpt:
      'Структура сильного мотиваційного листа та приклади фраз, яких краще уникати у заявці на навчання.',
    date: '2026-06-22',
  },
  {
    id: 'post-7',
    title: 'IELTS чи TOEFL: який іспит обрати',
    excerpt:
      'Порівнюємо формати іспитів, вимоги університетів і терміни підготовки, щоб обрати оптимальний варіант.',
    date: '2026-06-10',
  },
  {
    id: 'post-8',
    title: 'Як не перегоріти під час підготовки до вступу',
    excerpt:
      'Поради щодо планування часу та підтримки ресурсного стану на довгому шляху до вступу.',
    date: '2026-05-28',
  },
  {
    id: 'post-9',
    title: 'Освітні виставки 2026: варто йти чи ні',
    excerpt:
      'Що можна отримати від відвідування освітніх виставок і як підготуватися, щоб час не був змарнований.',
    date: '2026-05-15',
  },
  {
    id: 'post-10',
    title: 'Різниця між бакалавратом і магістратурою за кордоном',
    excerpt:
      'Пояснюємо відмінності у вимогах до вступу, тривалості навчання та вартості на кожному з рівнів освіти.',
    date: '2026-05-02',
  },
  {
    id: 'post-11',
    title: 'Як розповісти про свій досвід у резюме без прикрас',
    excerpt:
      'Формулювання досягнень так, щоб вони звучали переконливо, але залишалися чесними.',
    date: '2026-04-20',
  },
  {
    id: 'post-12',
    title: '5 запитань, які варто поставити консультанту з освіти',
    excerpt:
      'Як перевірити компетентність консультанта ще на першій зустрічі та зрозуміти, чи підходить він вам.',
    date: '2026-04-08',
  },
  {
    id: 'post-13',
    title: 'Чому варто почати підготовку до вступу за рік',
    excerpt:
      'Розкладаємо процес підготовки на етапи та показуємо, чому пізній старт часто коштує дорожче.',
    date: '2026-03-26',
  },
  {
    id: 'post-14',
    title: 'Академічна доброчесність: що варто знати студенту',
    excerpt:
      'Основні правила, яких дотримуються університети за кордоном, і як їх не порушити ненавмисно.',
    date: '2026-03-14',
  },
  {
    id: 'post-15',
    title: 'Стажування під час навчання: де шукати та як податися',
    excerpt:
      'Ресурси для пошуку стажувань і поради щодо оформлення заявки, яка виділятиметься серед інших.',
    date: '2026-03-02',
  },
  {
    id: 'post-16',
    title: 'Онлайн чи офлайн навчання: що обрати у 2026',
    excerpt:
      'Зважуємо переваги й обмеження обох форматів залежно від цілей та можливостей студента.',
    date: '2026-02-18',
  },
  {
    id: 'post-17',
    title: 'Як адаптуватися в новій країні у перші місяці навчання',
    excerpt:
      'Практичні кроки для швидшої адаптації: від побуту до нових соціальних зв’язків.',
    date: '2026-02-05',
  },
]

const PAGE_SIZE = 8

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function AccentCard({ post }: { post: BlogPost }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-3xl bg-primary p-6 text-white">
      <h2 className="text-xl font-medium leading-tight">{post.title}</h2>
      <span className="mt-auto text-sm text-white/70">
        {formatDate(post.date)}
      </span>
    </article>
  )
}

function RegularCard({ post }: { post: BlogPost }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-3xl border border-black/5 bg-white p-6 shadow-[0_38px_56px_rgba(191,204,225,0.2)]">
      <h2 className="text-xl font-medium leading-tight">{post.title}</h2>
      <p className="leading-6 text-gray-500">{post.excerpt}</p>
      <span className="mt-auto text-sm text-gray-500">
        {formatDate(post.date)}
      </span>
    </article>
  )
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const totalPages = Math.max(1, Math.ceil(BLOG_POSTS.length / PAGE_SIZE))
  const currentPage = Math.min(
    Math.max(Number(searchParams.page) || 1, 1),
    totalPages,
  )
  const start = (currentPage - 1) * PAGE_SIZE
  const posts = BLOG_POSTS.slice(start, start + PAGE_SIZE)

  return (
    <main className="bg-bg-base">
      <section className="mx-auto max-w-container px-4 py-16">
        <h1 className="mb-12 text-3xl font-bold text-dark md:text-5xl">Блог</h1>

        {/* Below lg: plain single/2-column grid — the first post is still the accent tile, just without the row-span. */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
          {posts.map((post, i) =>
            i === 0 ? (
              <AccentCard key={post.id} post={post} />
            ) : (
              <RegularCard key={post.id} post={post} />
            ),
          )}
        </div>

        {/* lg+: the first post of every page is a tall accent tile spanning 2 rows in column 1. */}
        <div className="hidden gap-6 lg:grid lg:grid-cols-3">
          {posts.map((post, i) =>
            i === 0 ? (
              <div key={post.id} style={{ gridColumn: 1, gridRow: '1 / span 2' }}>
                <AccentCard post={post} />
              </div>
            ) : (
              <div key={post.id}>
                <RegularCard post={post} />
              </div>
            ),
          )}
        </div>

        <BlogPagination currentPage={currentPage} totalPages={totalPages} />
      </section>
    </main>
  )
}
