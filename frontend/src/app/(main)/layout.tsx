// ─────────────────────────────────────────────────────────────
//  Layout for every LOGGED-IN page (the "(main)" folder name is not part of the URL).
//  Wraps them in AppShell: top bar, sidebars, phone menu, and the "must be logged in" check.
// ─────────────────────────────────────────────────────────────
import type { ReactNode } from 'react'
import AppShell from '@/components/layout/AppShell'

export default function MainLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
