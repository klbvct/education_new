'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ConsultationForm, { type ServiceId } from './ConsultationForm'

export default function OrderModal({
  isOpen,
  onClose,
  service,
}: {
  isOpen: boolean
  onClose: () => void
  service: ServiceId
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-dark animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-[30px] bg-white p-6 animate-fade-up md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-dark/60 transition hover:bg-bg-secondary hover:text-dark"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h2 className="mb-4 pr-8 text-xl font-medium">Замовити консультацію</h2>
        <ConsultationForm service={service} />
      </div>
    </div>,
    document.body,
  )
}
