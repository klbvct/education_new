'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { localeFromPathname, type Locale } from '../lib/locale'
import { pushLeadEvent } from '../lib/analytics'

const MESSENGERS = ['Telegram', 'WhatsApp', 'Viber'] as const

export const SERVICES = [
  { id: 'design', price: '7 200' },
  { id: 'consultation', price: '5 500' },
] as const

type Messenger = (typeof MESSENGERS)[number]
export type ServiceId = (typeof SERVICES)[number]['id']

function parsePrice(price: string): number {
  return Number(price.replace(/\D/g, ''))
}

const SERVICE_TITLES: Record<Locale, Record<ServiceId, string>> = {
  uk: { design: 'Дизайн Освіти', consultation: 'Консультація' },
  ru: { design: 'Дизайн Образования', consultation: 'Консультация' },
}

// Design system field: 48px, pill radius, Surface #F5F5F5 with a near-invisible border, 16px text, Gray placeholder
const inputClass =
  'h-12 w-full rounded-[32px] border border-black/[0.04] bg-[#F5F5F5] px-6 text-base outline-none transition placeholder:text-[#757474] focus:border-primary focus:bg-white'

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
    submitting: string
    submitError: string
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
    submitting: 'Надсилаємо…',
    submitError: 'Не вдалося надіслати заявку. Спробуйте ще раз.',
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
    submitting: 'Отправляем…',
    submitError: 'Не удалось отправить заявку. Попробуйте ещё раз.',
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
          // Design system: both tiles are Surface #F5F5F5; the selected one differs only by
          // the blue border as its status marker; prices stay black (blue is only for action/status)
          className={`flex flex-col items-start rounded-2xl border-2 p-3 text-left text-black transition sm:p-4 ${
            value === s.id
              ? 'border-primary bg-[#F5F5F5]'
              : 'border-black/[0.04] bg-[#F5F5F5] hover:border-black'
          }`}
        >
          <span className="text-[18px] font-medium">{SERVICE_TITLES[locale][s.id]}</span>
          <span>{s.price} грн</span>
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
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      onSubmit={async (e) => {
        e.preventDefault()
        setError(null)
        const formData = new FormData(e.currentTarget)
        const firstName = String(formData.get('firstName') ?? '')
        const lastName = String(formData.get('lastName') ?? '')
        const email = String(formData.get('email') ?? '')
        const phone = String(formData.get('phone') ?? '')
        const serviceLabel = selectedService
          ? `${SERVICE_TITLES[locale][selectedService.id]} (${selectedService.price} грн)`
          : undefined

        setIsSubmitting(true)
        try {
          const res = await fetch('/api/consultation-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              phone,
              messenger,
              message: formData.get('message'),
              serviceLabel,
              locale,
            }),
          })
          if (!res.ok) throw new Error()
          const data: { id?: string } = await res.json()
          if (selectedService && data.id) {
            pushLeadEvent({
              value: parsePrice(selectedService.price),
              leadSource: selectedService.id,
              userData: { firstName, lastName, email, phone },
            })
          }
          setSubmitted(true)
        } catch {
          setError(t.submitError)
        } finally {
          setIsSubmitting(false)
        }
      }}
      className="flex flex-col gap-3"
    >
      {showServiceSummary && selectedService && (
        <div>
          <span className="mr-2 text-[18px] font-medium">
            {SERVICE_TITLES[locale][selectedService.id]}
          </span>
          <span>
            {selectedService.price} грн
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-[14px] font-medium" htmlFor="firstName">
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
          <label className="mb-2 block text-[14px] font-medium" htmlFor="lastName">
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
          <label className="mb-2 block text-[14px] font-medium" htmlFor="email">
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
          <label className="mb-2 block text-[14px] font-medium" htmlFor="phone">
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
        <span className="mb-2 block text-[14px] font-medium">
          {t.messenger} <span className="text-primary">*</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {MESSENGERS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMessenger(m)}
              aria-pressed={messenger === m}
              // Design system tabs: 40px, 20px radius, 15px; active = accent, inactive = Surface + black
              className={`h-10 rounded-[20px] px-4 text-[15px] transition ${
                messenger === m
                  ? 'bg-primary text-white'
                  : 'bg-[#F5F5F5] text-black hover:opacity-60'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[14px] font-medium" htmlFor="message">
          {t.message} <span className="font-normal text-[#757474]">{t.messageOptional}</span>
        </label>
        <textarea
          id="message"
          name="message"
          className="h-12 w-full resize-none rounded-2xl border border-black/[0.04] bg-[#F5F5F5] px-5 py-3 text-base outline-none transition placeholder:text-[#757474] focus:border-primary focus:bg-white sm:h-20"
          placeholder={t.messagePlaceholder}
        />
      </div>

      {error && <p className="text-[13px] text-[#E5484D]">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex h-14 items-center justify-center gap-2 rounded-[32px] bg-primary text-base text-white transition hover:opacity-60 disabled:opacity-50 lg:h-12"
      >
        {isSubmitting ? t.submitting : resolvedSubmitLabel}
        <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
        </svg>
      </button>
    </form>
  )
}
