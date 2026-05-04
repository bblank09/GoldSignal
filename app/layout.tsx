import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'GoldSignal — Gold Market Intelligence',
  description: 'Real-time gold market intelligence dashboard for Thai retail investors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  )
}
