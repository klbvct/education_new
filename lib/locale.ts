export type Locale = 'uk' | 'ru'

// Ukrainian is unprefixed/default; Russian lives under /ru. No i18n
// library — just this one helper shared by client components that need
// to know which language to render (see Header.tsx for the canonical
// usage via usePathname()).
export function localeFromPathname(pathname: string): Locale {
  return pathname === '/ru' || pathname.startsWith('/ru/') ? 'ru' : 'uk'
}
