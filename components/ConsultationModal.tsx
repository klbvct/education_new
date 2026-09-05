'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ServicePicker, type ServiceId } from './ConsultationForm'
import OrderModal from './OrderModal'
import { localeFromPathname } from '../lib/locale'

const STRINGS = {
  uk: {
    heading: 'Замовити консультацію',
    subheading: 'Оберіть послугу',
    submit: 'Надіслати заявку',
  },
  ru: {
    heading: 'Заказать консультацию',
    subheading: 'Выберите услугу',
    submit: 'Отправить заявку',
  },
}

export default function ConsultationModal() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const t = STRINGS[locale]
  const [isOpen, setIsOpen] = useState(false)
  const [service, setService] = useState<ServiceId>('design')

  return (
    <>
      <h2 className="mb-2 text-2xl font-medium">{t.heading}</h2>
      <p className="mb-6 leading-6">{t.subheading}</p>

      <div className="mb-14">
        <ServicePicker value={service} onChange={setService} locale={locale} />
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-[32px] bg-primary text-base text-white transition hover:opacity-60 lg:h-12"
      >
        {t.submit}
        <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
        </svg>
      </button>

      <OrderModal isOpen={isOpen} onClose={() => setIsOpen(false)} service={service} />
    </>
  )
}
