// ─────────────────────────────────────────────────────────────
//  ROUTE /messages and /messages/<chatId> — "[[...chat]]" means the chat id is optional.
//  Sets the tab title and shows MessagesView.
// ─────────────────────────────────────────────────────────────
import MessagesView from './MessagesView'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Messages' }

export default function MessagesPage() {
  return <MessagesView />
}
