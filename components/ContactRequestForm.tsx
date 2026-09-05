'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import ConsultationForm, { ServicePicker, type ServiceId } from './ConsultationForm'
import { localeFromPathname } from '../lib/locale'

const HEADING = {
  uk: 'Замовити консультацію',
  ru: 'Заказать консультацию',
}

const SUBMIT_LABEL = {
  uk: 'Надіслати',
  ru: 'Отправить',
}

export default function ContactRequestForm() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const [service, setService] = useState<ServiceId>('design')

  return (
    <div>
      <h2 className="mb-6 text-2xl font-medium">{HEADING[locale]}</h2>

      <div className="mb-6">
        <ServicePicker value={service} onChange={setService} locale={locale} />
      </div>

      <ConsultationForm
        service={service}
        submitLabel={SUBMIT_LABEL[locale]}
        showServiceSummary={false}
      />
    </div>
  )
}
