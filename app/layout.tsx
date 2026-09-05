import type { Metadata } from 'next'
import './globals.css'
import HtmlLangSetter from '../components/HtmlLangSetter'
import { DEFAULT_OG_IMAGE, siteUrl } from '../lib/seo'

// Fallback social preview for any page that doesn't set its own
// openGraph/twitter (e.g. /admin, /login) — every public page overrides
// this via lib/seo.ts's socialMeta().
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: 'Дизайн Освіти',
  description: 'Сучасна профорієнтаційна методика',
  openGraph: {
    siteName: 'Дизайн Освіти',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_IMAGE],
  },
  manifest: '/images/favicon_io/site.webmanifest',
  icons: {
    icon: [
      { url: '/images/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon_io/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/favicon_io/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/images/favicon_io/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className="font-sans">
        <HtmlLangSetter />
        {children}
      </body>
    </html>
  )
}
