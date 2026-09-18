import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: 'CVS 学習',
  description: 'CVS / VES / VEリーダー 受験勉強アプリ',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-4 pb-24 sm:pt-20 sm:pb-10">
          {children}
        </main>
      </body>
    </html>
  )
}
