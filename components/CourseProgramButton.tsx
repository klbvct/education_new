'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import CourseRequestForm from './CourseRequestForm'
import { localeFromPathname } from '../lib/locale'

const CLOSE_LABEL = {
  uk: 'Закрити',
  ru: 'Закрыть',
}

// "Отримати програму курсу" trigger under the /course program block: opens
// the same CourseRequestForm as the bottom of the page, in a popup styled
// like OrderModal (portaled to document.body for the same reason).
export default function CourseProgramButton({ label, submitLabel }: { label: string; submitLabel: string }) {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-14 w-full max-w-[320px] items-center justify-center gap-2.5 rounded-[32px] bg-[#266AF6] px-6 text-base text-white transition hover:opacity-60 lg:h-12"
      >
        {label}
        <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
        </svg>
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-dark animate-fade-in"
            onClick={close}
          >
            <div
              className="relative max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-[30px] bg-white p-6 animate-fade-up md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={close}
                aria-label={CLOSE_LABEL[locale]}
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-dark/60 transition hover:bg-[#F5F5F5] hover:text-dark"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <h2 className="mb-4 pr-8 text-2xl font-medium">{label}</h2>
              <CourseRequestForm idPrefix="course-program" submitLabel={submitLabel} />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
