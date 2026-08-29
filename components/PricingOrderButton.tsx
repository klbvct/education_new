'use client'

import { useState } from 'react'
import type { ServiceId } from './ConsultationForm'
import OrderModal from './OrderModal'

export default function PricingOrderButton({
  service,
  label,
  className,
}: {
  service: ServiceId
  label: string
  className: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        {label}
      </button>
      <OrderModal isOpen={isOpen} onClose={() => setIsOpen(false)} service={service} />
    </>
  )
}
