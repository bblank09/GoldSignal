import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GoldSignal — Gold Market Intelligence',
  description: 'Real-time gold market intelligence dashboard for Thai retail investors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
