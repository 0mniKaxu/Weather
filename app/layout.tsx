import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { WeatherProvider } from '@/contexts/WeatherContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-montserrat' })

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'A beautiful weather application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} font-sans bg-black`}>
        <WeatherProvider>
          {children}
        </WeatherProvider>
      </body>
    </html>
  )
}
