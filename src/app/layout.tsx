import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mehrvila',
  description: 'A social network for sharing places with fellow travelers',
}

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-white text-[#262626]">
        <NextTopLoader color="#3b82f6" showSpinner={false} height={2} />
        <div className="min-h-full mx-auto flex flex-col max-w-md border-x border-[#dbdbdb] bg-white">
          {children}
        </div>
      </body>
    </html>
  )
}
