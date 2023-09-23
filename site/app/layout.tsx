import { Inter } from 'next/font/google'
import './app.css'

export const metadata = {
  title: 'next-monaco',
  description: `Monaco Editor configured for Next.js. Fully featured code editing based on VS Code.`,
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
