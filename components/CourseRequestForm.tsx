'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { localeFromPathname, type Locale } from '../lib/locale'
import { pushPurchaseEvent } from '../lib/analytics'

const MESSENGERS = ['Telegram', 'WhatsApp', 'Viber'] as const
type Messenger = (typeof MESSENGERS)[number]

// 350 € converted to UAH — the site reports all purchases in UAH.
const COURSE_PRICE = 17850
const SERVICE_LABEL: Record<Locale, string> = {
  uk: 'Курс',
  ru: 'Курс',
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
    city: string
    cityPlaceholder: string
    organization: string
    organizationPlaceholder: string
    submit: string
    submitting: string
    submitError: string
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
    city: 'Місто',
    cityPlaceholder: 'Ваше місто',
    organization: 'Спеціаліст / Організація',
    organizationPlaceholder: 'Спеціаліст / Школа',
    submit: 'Записатися на курс',
    submitting: 'Надсилаємо…',
    submitError: 'Не вдалося надіслати заявку. Спробуйте ще раз.',
    submittedTitle: 'Заявку на курс надіслано',
    submittedText: "Ми зв'яжемось з вами найближчим часом на обраний месенджер.",
  },
  ru: {
    firstName: 'Имя',
    firstNamePlaceholder: 'Ваше имя',
    lastName: 'Фамилия',
    lastNamePlaceholder: 'Ваша фамилия',
    messenger: 'Удобный мессенджер',
    city: 'Город',
    cityPlaceholder: 'Ваш город',
    organization: 'Специалист / Организация',
    organizationPlaceholder: 'Специалист / Школа',
    submit: 'Записаться на курс',
    submitting: 'Отправляем…',
    submitError: 'Не удалось отправить заявку. Попробуйте ещё раз.',
    submittedTitle: 'Заявка на курс отправлена',
    submittedText: 'Мы свяжемся с вами в ближайшее время в выбранный мессенджер.',
  },
}

export default function CourseRequestForm() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const t = STRINGS[locale]
  const serviceLabel = SERVICE_LABEL[locale]

  const [messenger, setMessenger] = useState<Messenger>('Telegram')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        // The consultation-requests API has no dedicated columns for these,
        // so they travel in the free-text message (shown in the admin email).
        const message = [
          `${t.city}: ${String(formData.get('city') ?? '').trim()}`,
          `${t.organization}: ${String(formData.get('organization') ?? '').trim()}`,
        ].join('\n')

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
              message,
              serviceLabel,
              locale,
              requestType: 'course',
            }),
          })
          if (!res.ok) throw new Error()
          const data: { id?: string } = await res.json()
          if (data.id) {
            pushPurchaseEvent({
              transactionId: data.id,
              items: [{ itemId: 'course', itemName: serviceLabel, price: COURSE_PRICE }],
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
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[16px] font-medium" htmlFor="course-firstName">
            {t.firstName} <span className="text-primary">*</span>
          </label>
          <input
            id="course-firstName"
            name="firstName"
            required
            className={inputClass}
            placeholder={t.firstNamePlaceholder}
          />
        </div>
        <div>
          <label className="mb-2 block text-[16px] font-medium" htmlFor="course-lastName">
            {t.lastName} <span className="text-primary">*</span>
          </label>
          <input
            id="course-lastName"
            name="lastName"
            required
            className={inputClass}
            placeholder={t.lastNamePlaceholder}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[16px] font-medium" htmlFor="course-email">
            Email <span className="text-primary">*</span>
          </label>
          <input
            id="course-email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-[16px] font-medium" htmlFor="course-phone">
            Телефон <span className="text-primary">*</span>
          </label>
          <input
            id="course-phone"
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[16px] font-medium" htmlFor="course-city">
            {t.city} <span className="text-primary">*</span>
          </label>
          <input id="course-city" name="city" required className={inputClass} placeholder={t.cityPlaceholder} />
        </div>
        <div>
          <label className="mb-2 block text-[16px] font-medium" htmlFor="course-organization">
            {t.organization} <span className="text-primary">*</span>
          </label>
          <input
            id="course-organization"
            name="organization"
            required
            className={inputClass}
            placeholder={t.organizationPlaceholder}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-14 items-center justify-center gap-3 rounded-[32px] bg-primary text-[17px] text-white transition hover:opacity-60 disabled:opacity-50"
      >
        {isSubmitting ? t.submitting : t.submit}
        <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
        </svg>
      </button>
    </form>
  )
}
