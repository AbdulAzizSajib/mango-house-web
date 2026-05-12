import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const shadhinata = localFont({
  src: [
    { path: '../public/font/Shadhinata_Unicode.ttf', weight: '400', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'রাজশাহী ম্যাঙ্গো — বাগান থেকে সরাসরি তাজা আম',
  description: 'বাংলাদেশের সেরা বাগান থেকে হাতে বাছাই করা, রাসায়নিকমুক্ত তাজা আম। ক্যাশ অন ডেলিভারি, ২৪-৪৮ ঘণ্টায় সারা দেশে।',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn" className={`${shadhinata.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
