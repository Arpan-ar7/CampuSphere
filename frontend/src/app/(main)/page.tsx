// ─────────────────────────────────────────────────────────────
//  ROUTE / — the campus feed. Sets the tab title and shows FeedView.
// ─────────────────────────────────────────────────────────────
import FeedView from './FeedView'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Campus Feed' }

export default function FeedPage() {
  return <FeedView />
}
