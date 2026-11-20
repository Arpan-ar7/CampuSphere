// ─────────────────────────────────────────────────────────────
//  ROUTE /teams — sets the tab title and shows TeamsView.
// ─────────────────────────────────────────────────────────────
import TeamsView from './TeamsView'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Find Teammates' }

export default function TeamsPage() {
  return <TeamsView />
}
