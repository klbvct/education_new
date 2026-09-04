import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Дизайн Освіти',
  description: 'Сучасна профорієнтаційна методика',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className="font-sans">{children}</body>
    </html>
  )
}
