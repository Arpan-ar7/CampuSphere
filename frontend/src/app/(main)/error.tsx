'use client' // Error pages must run in the browser

// ─────────────────────────────────────────────────────────────
//  Error page for logged-in pages (Feed, Notes, Teams, Messages, Profile).
//  It sits inside (main)/layout.js, so the top bar and menus keep working.
// ─────────────────────────────────────────────────────────────
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function MainErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorMessage error={error} retry={retry} />
}
