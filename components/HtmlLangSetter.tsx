'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { localeFromPathname } from '../lib/locale'

export default function HtmlLangSetter() {
  const pathname = usePathname()
  useEffect(() => {
    document.documentElement.lang = localeFromPathname(pathname)
  }, [pathname])
  return null
}
