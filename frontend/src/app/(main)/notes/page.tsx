// ─────────────────────────────────────────────────────────────
//  ROUTE /notes — sets the tab title and shows NotesView.
// ─────────────────────────────────────────────────────────────
import NotesView from './NotesView'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Notes Library' }

export default function NotesPage() {
  return <NotesView />
}
