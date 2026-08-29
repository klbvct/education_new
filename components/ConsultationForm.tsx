'use client'

import { useState } from 'react'

const MESSENGERS = ['Telegram', 'WhatsApp', 'Viber'] as const

export const SERVICES = [
  { id: 'design', title: 'Дизайн Освіти', price: '7 200' },
  { id: 'consultation', title: 'Консультація', price: '5 500' },
] as const

type Messenger = (typeof MESSENGERS)[number]
export type ServiceId = (typeof SERVICES)[number]['id']

const inputClass =
  'h-12 w-full rounded-[32px] border border-transparent bg-bg-secondary px-6 text-base outline-none transition focus:border-primary focus:bg-white'

export function ServicePicker({
  value,
  onChange,
}: {
  value: ServiceId
  onChange: (id: ServiceId) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {SERVICES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onChange(s.id)}
          aria-pressed={value === s.id}
          className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
            value === s.id
              ? 'border-primary bg-primary/5'
              : 'border-black/10 hover:border-primary/40'
          }`}
        >
          <span className="text-sm font-medium">{s.title}</span>
          <span className="font-semibold text-primary">{s.price} грн</span>
        </button>
      ))}
    </div>
  )
}

export default function ConsultationForm({ service }: { service: ServiceId }) {
  const [messenger, setMessenger] = useState<Messenger>('Telegram')
  const [submitted, setSubmitted] = useState(false)
  const selectedService = SERVICES.find((s) => s.id === service)!

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
          ✓
        </div>
        <h3 className="text-xl font-medium">Заявку надіслано</h3>
        <p className="leading-6">Ми зв&apos;яжемось з вами найближчим часом на обраний месенджер.</p>
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
      <div className="">
        <span className="text-sm font-medium mr-2">{selectedService.title}</span>
        <span className="font-semibold text-primary">
          {selectedService.price} грн
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="firstName">
            Ім&apos;я <span className="text-primary">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            className={inputClass}
            placeholder="Ваше ім'я"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="lastName">
            Прізвище <span className="text-primary">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            className={inputClass}
            placeholder="Ваше прізвище"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="email">
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
          <label className="mb-2 block text-sm font-medium" htmlFor="phone">
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
        <span className="mb-2 block text-sm font-medium">
          Зручний месенджер <span className="text-primary">*</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {MESSENGERS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMessenger(m)}
              aria-pressed={messenger === m}
              className={`h-10 rounded-full px-5 text-sm transition ${
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
        <label className="mb-2 block text-sm font-medium" htmlFor="message">
          Повідомлення{' '}
          <span className="font-normal text-gray-500">(необов&apos;язково)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={2}
          className="w-full resize-none rounded-2xl border border-transparent bg-bg-secondary px-5 py-3 text-base outline-none transition focus:border-primary focus:bg-white"
          placeholder="Коротко опишіть свій запит"
        />
      </div>

      <button
        type="submit"
        className="mt-2 flex h-14 items-center justify-center rounded-[32px] bg-primary text-base text-white transition hover:opacity-60 lg:h-12"
      >
        Замовити
      </button>
    </form>
  )
}
