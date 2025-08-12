import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_OAUTH_CONFIG } from '../config/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LIEF Care Management',
  description: 'Professional care management system for managers and care workers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CONFIG.clientId}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
