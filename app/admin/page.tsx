import Link from 'next/link'

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-container px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-dark">Адмінка</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          href="/admin/reviews"
          className="rounded-2xl border border-black/10 bg-white p-6 transition hover:border-primary"
        >
          <h2 className="mb-2 text-xl font-medium">Відгуки</h2>
          <p className="leading-6 text-gray-500">Редагувати або видалити відгуки.</p>
        </Link>
        <Link
          href="/admin/posts"
          className="rounded-2xl border border-black/10 bg-white p-6 transition hover:border-primary"
        >
          <h2 className="mb-2 text-xl font-medium">Статті</h2>
          <p className="leading-6 text-gray-500">Додати нову статтю або відредагувати існуючу.</p>
        </Link>
      </div>
    </main>
  )
}
