// ─────────────────────────────────────────────────────────────
//  ROOT LAYOUT — wraps every page of the app.
//  Sets the <html> tag, loads the fonts (next/font), the site title template
//  ("Notes Library · CampuSphere") and the app-wide providers (login + pop-ups).
// ─────────────────────────────────────────────────────────────
import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Caveat, DM_Sans } from 'next/font/google'
import { APP_NAME } from '@/config'
import Providers from './providers'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', style: ['normal', 'italic'] })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' })

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: 'The campus notebook where students share notes, post updates, chat and find teammates.',
}

export const viewport: Viewport = {
  themeColor: '#fbf7ee',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${bricolage.variable} ${caveat.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
