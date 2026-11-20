// ─────────────────────────────────────────────────────────────
//  ROUTE /login — sets the tab title and shows LoginView.
// ─────────────────────────────────────────────────────────────
import LoginView from './LoginView'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Log in' }

export default function LoginPage() {
  return <LoginView />
}
