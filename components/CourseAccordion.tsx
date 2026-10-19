'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'

export type CourseAccordionItem = {
  label?: string
  title: string
  body: ReactNode
}

// Shared by the "Програма курсу" and "Часті запитання" sections of
// CoursePage — the first item starts open, like in the Figma mockup.
export default function CourseAccordion({ items }: { items: CourseAccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="border-t border-black/10">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={item.title} className="border-b border-dark/10">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
            >
              <span className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
                {item.label && (
                  <span className="w-[110px] shrink-0 text-[16px] font-medium uppercase tracking-[0.06em] text-primary">
                    {item.label}
                  </span>
                )}
                <span className="text-[18px] font-medium leading-[1.3] text-dark">
                  {item.title}
                </span>
              </span>
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition ${
                  isOpen ? 'bg-primary' : 'border border-black/15'
                }`}
                aria-hidden="true"
              >
                <Image src={isOpen ? '/images/course/chevron-up.svg' : '/images/course/plus.svg'} width={16} height={16} alt="" />
              </span>
            </button>
            {isOpen && <div className="pb-8">{item.body}</div>}
          </div>
        )
      })}
    </div>
  )
}
