'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Не вдалося увійти')
        return
      }
      const from = searchParams.get('from')
      router.push(from && from.startsWith('/admin') ? from : '/admin')
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold text-dark">Вхід в адмінку</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-8"
        >
          <div>
            <label className="mb-2 block text-[16px] font-medium" htmlFor="username">
              Логін
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="h-12 w-full rounded-[32px] border border-black/10 bg-bg-secondary px-6 text-[16px] outline-none transition focus:border-primary focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-[16px] font-medium" htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 w-full rounded-[32px] border border-black/10 bg-bg-secondary px-6 text-[16px] outline-none transition focus:border-primary focus:bg-white"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-14 items-center justify-center rounded-[32px] bg-primary text-base text-white transition hover:opacity-60 disabled:opacity-50 lg:h-12"
          >
            {isSubmitting ? 'Вхід…' : 'Увійти'}
          </button>
        </form>
      </div>
    </main>
  )
}
