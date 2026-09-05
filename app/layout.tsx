import type { Metadata } from 'next'
import './globals.css'
import HtmlLangSetter from '../components/HtmlLangSetter'
import { siteUrl } from '../lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: 'Дизайн Освіти',
  description: 'Сучасна профорієнтаційна методика',
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
