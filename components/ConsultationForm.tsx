'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { localeFromPathname, type Locale } from '../lib/locale'

const MESSENGERS = ['Telegram', 'WhatsApp', 'Viber'] as const

export const SERVICES = [
  { id: 'design', price: '7 200' },
  { id: 'consultation', price: '5 500' },
] as const

type Messenger = (typeof MESSENGERS)[number]
export type ServiceId = (typeof SERVICES)[number]['id']

const SERVICE_TITLES: Record<Locale, Record<ServiceId, string>> = {
  uk: { design: 'Дизайн Освіти', consultation: 'Консультація' },
  ru: { design: 'Дизайн Освіти', consultation: 'Консультация' },
}

const inputClass =
  'h-12 w-full rounded-[32px] border border-transparent bg-bg-secondary px-6 text-[16px] outline-none transition focus:border-primary focus:bg-white'

const STRINGS: Record<
  Locale,
  {
    firstName: string
    firstNamePlaceholder: string
    lastName: string
    lastNamePlaceholder: string
    messenger: string
    message: string
    messageOptional: string
    messagePlaceholder: string
    submittedTitle: string
    submittedText: string
  }
> = {
  uk: {
    firstName: "Ім'я",
    firstNamePlaceholder: "Ваше ім'я",
    lastName: 'Прізвище',
    lastNamePlaceholder: 'Ваше прізвище',
    messenger: 'Зручний месенджер',
    message: 'Повідомлення',
    messageOptional: "(необов'язково)",
    messagePlaceholder: 'Коротко опишіть свій запит',
    submittedTitle: 'Заявку надіслано',
    submittedText: "Ми зв'яжемось з вами найближчим часом на обраний месенджер.",
  },
  ru: {
    firstName: 'Имя',
    firstNamePlaceholder: 'Ваше имя',
    lastName: 'Фамилия',
    lastNamePlaceholder: 'Ваша фамилия',
    messenger: 'Удобный мессенджер',
    message: 'Сообщение',
    messageOptional: '(необязательно)',
    messagePlaceholder: 'Коротко опишите свой запрос',
    submittedTitle: 'Заявка отправлена',
    submittedText: 'Мы свяжемся с вами в ближайшее время в выбранный мессенджер.',
  },
}

export function ServicePicker({
  value,
  onChange,
  locale = 'uk',
}: {
  value: ServiceId
  onChange: (id: ServiceId) => void
  locale?: Locale
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SERVICES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onChange(s.id)}
          aria-pressed={value === s.id}
          className={`flex flex-col items-start rounded-2xl border p-3 text-left transition sm:p-4 ${
            value === s.id
              ? 'border-primary bg-primary/5'
              : 'border-black/10 hover:border-primary/40'
          }`}
        >
          <span className="text-[16px] font-medium">{SERVICE_TITLES[locale][s.id]}</span>
          <span className="font-semibold text-primary">{s.price} грн</span>
        </button>
      ))}
    </div>
  )
}

export default function ConsultationForm({
  service,
  submitLabel,
  showServiceSummary = true,
}: {
  service?: ServiceId
  submitLabel?: string
  showServiceSummary?: boolean
}) {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const t = STRINGS[locale]
  const resolvedSubmitLabel = submitLabel ?? (locale === 'ru' ? 'Заказать' : 'Замовити')

  const [messenger, setMessenger] = useState<Messenger>('Telegram')
  const [submitted, setSubmitted] = useState(false)
  const selectedService = service ? SERVICES.find((s) => s.id === service) : undefined

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
          ✓
        </div>
        <h3 className="text-xl font-medium">{t.submittedTitle}</h3>
        <p className="text-base leading-6">{t.submittedText}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
      className="flex flex-col gap-3"
    >
      {showServiceSummary && selectedService && (
        <div>
          <span className="mr-2 text-[16px] font-medium">
            {SERVICE_TITLES[locale][selectedService.id]}
          </span>
          <span className="font-semibold text-primary">
            {selectedService.price} грн
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-[16px] font-medium" htmlFor="firstName">
            {t.firstName} <span className="text-primary">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            className={inputClass}
            placeholder={t.firstNamePlaceholder}
          />
        </div>
        <div>
          <label className="mb-2 block text-[16px] font-medium" htmlFor="lastName">
            {t.lastName} <span className="text-primary">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            className={inputClass}
            placeholder={t.lastNamePlaceholder}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[16px] font-medium" htmlFor="email">
            Email <span className="text-primary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-[16px] font-medium" htmlFor="phone">
            Телефон <span className="text-primary">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className={inputClass}
            placeholder="+380"
          />
        </div>
      </div>

      <div>
        <span className="mb-2 block text-[16px] font-medium">
          {t.messenger} <span className="text-primary">*</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {MESSENGERS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMessenger(m)}
              aria-pressed={messenger === m}
              className={`h-10 rounded-full px-5 text-[16px] transition ${
                messenger === m
                  ? 'bg-primary text-white'
                  : 'bg-bg-secondary text-dark hover:bg-primary/10'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[16px] font-medium" htmlFor="message">
          {t.message} <span className="font-normal text-gray-500">{t.messageOptional}</span>
        </label>
        <textarea
          id="message"
          name="message"
          className="h-12 w-full resize-none rounded-2xl border border-transparent bg-bg-secondary px-5 py-3 text-[16px] outline-none transition focus:border-primary focus:bg-white sm:h-20"
          placeholder={t.messagePlaceholder}
        />
      </div>

      <button
        type="submit"
        className="mt-2 flex h-14 items-center justify-center gap-2 rounded-[32px] bg-primary text-base text-white transition hover:opacity-60 lg:h-12"
      >
        {resolvedSubmitLabel}
        <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
        </svg>
      </button>
    </form>
  )
}
