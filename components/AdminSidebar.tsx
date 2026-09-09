'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  const isActive = (path: string) =>
    path === '/admin' ? pathname === path : pathname.startsWith(path)

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {!isOpen && (
        <button
          className="fixed right-4 top-4 z-50 rounded-lg bg-gray-900 p-2 text-white lg:hidden"
          onClick={() => setIsOpen(true)}
          aria-label="Відкрити меню"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={close} />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-[100dvh] w-64 flex-col overflow-y-auto bg-gray-900 text-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-white lg:hidden"
          onClick={close}
          aria-label="Закрити меню"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8 px-6 pt-6">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.svg" alt="" width={24} height={21} priority />
            {/* Design system's documented brand blue (matches the logo fill), not the
                `primary` token — tailwind.config.js's `primary` is `#0c68f5`, a known
                drift from the design system's `#266AF6` (see CLAUDE.md). */}
            <h2 className="text-xl font-bold text-[#266AF6]">Дизайн Освіти</h2>
          </div>
          <p className="mt-1 text-sm text-gray-400">Адміністративна панель</p>
          <Link
            href="/" 
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="mt-4 inline-block rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700"
          >
            Перейти на сайт
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          <Link
            href="/admin"
            onClick={close}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive('/admin') ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Огляд
          </Link>

          <Link
            href="/admin/posts"
            onClick={close}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive('/admin/posts') ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Статті
          </Link>

          <Link
            href="/admin/reviews"
            onClick={close}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive('/admin/reviews') ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-6l-4 4v-4z"
              />
            </svg>
            Відгуки
          </Link>

          <Link
            href="/admin/consultation-requests"
            onClick={close}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive('/admin/consultation-requests')
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Заявки
          </Link>

          <Link
            href="/admin/redirects"
            onClick={close}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive('/admin/redirects') ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
            Редиректи
          </Link>
        </nav>

        <div className="mt-auto shrink-0 border-t border-gray-700 px-4 pb-6 pt-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition hover:bg-gray-800"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Вийти
          </button>
        </div>
      </aside>
    </>
  )
}
