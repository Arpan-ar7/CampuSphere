'use client'

// ─────────────────────────────────────────────────────────────
//  App-wide state shared by every page:
//    ToastProvider → little pop-up messages (useToast)
//    AuthProvider  → who is logged in (useAuth)
//  Used by: app/layout.js
// ─────────────────────────────────────────────────────────────
import type { ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  )
}
