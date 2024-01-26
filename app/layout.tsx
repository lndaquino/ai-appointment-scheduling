import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { AppContextProvider } from '@/contexts/AppContext'

const poppins = Poppins({
  subsets: ['latin'],
  weight: '400',
})

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
      <body className={poppins.className}>
        <AppContextProvider>{children}</AppContextProvider>
        <Analytics />
      </body>
    </html>
  )
}
