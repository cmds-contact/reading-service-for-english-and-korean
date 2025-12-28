import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'English-Korean Parallel Reader',
  description: 'Read English and Korean content side by side',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
