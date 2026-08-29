'use client'

import { useState } from 'react'
import ConsultationForm, { ServicePicker, type ServiceId } from './ConsultationForm'

export default function ContactRequestForm() {
  const [service, setService] = useState<ServiceId>('design')

  return (
    <div>
      <h2 className="mb-6 text-2xl font-medium">Замовити консультацію</h2>

      <div className="mb-6">
        <ServicePicker value={service} onChange={setService} />
      </div>

      <ConsultationForm
        service={service}
        submitLabel="Надіслати"
        showServiceSummary={false}
      />
    </div>
  )
}
