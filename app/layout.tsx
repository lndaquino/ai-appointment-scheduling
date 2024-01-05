import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Appointment scheduling',
  description: 'AI powered appointments scheduling',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}