import type { Metadata } from 'next'
import { Inter, Tajawal } from 'next/font/google'
import { LanguageProvider } from '@/contexts/LanguageContext'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const tajawal = Tajawal({ 
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal',
  display: 'swap',
  weight: ['400', '500', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Pharma Ethique - Réactifs & Équipements de laboratoires',
  description: 'Pharma Ethique est une entreprise spécialisée en diagnostic de laboratoire offrant un accompagnement unique dans le domaine des diagnostics médicaux.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" dir="ltr">
      <body className={`${inter.variable} ${tajawal.variable} font-sans`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}

