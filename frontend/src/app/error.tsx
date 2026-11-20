'use client' // Error pages must run in the browser

// ─────────────────────────────────────────────────────────────
//  Error page for pages OUTSIDE the logged-in area (e.g. /login).
//  Next.js shows this if the page crashes; `retry` (Next 16) re-renders it.
// ─────────────────────────────────────────────────────────────
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorMessage error={error} retry={retry} />
}
