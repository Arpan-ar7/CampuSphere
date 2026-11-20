// ─────────────────────────────────────────────────────────────
//  404 page — shown for any web address that doesn't exist.
// ─────────────────────────────────────────────────────────────
import { SearchX } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <SearchX className="mx-auto h-10 w-10" />
        <h1 className="mt-3 font-display text-3xl font-extrabold">This page isn&apos;t in the notebook</h1>
        <p className="font-hand text-2xl text-ink/60">maybe it was torn out?</p>
        <Button href="/" color="yellow" className="mt-5">Back to the feed</Button>
      </div>
    </div>
  )
}
