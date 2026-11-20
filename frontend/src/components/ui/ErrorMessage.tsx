'use client'

// ─────────────────────────────────────────────────────────────
//  Friendly "something went wrong" box used by the error pages (app/error.js, app/(main)/error.js).
//  We never show the technical error to students (it could contain private details);
//  it only goes to the browser console for developers.
// ─────────────────────────────────────────────────────────────
import { useEffect } from 'react'
import { TriangleExclamationPoint } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ErrorMessage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error) // later: send to an error-tracking service instead
  }, [error])

  return (
    <div className="grid min-h-[60vh] place-items-center p-6 text-center" role="alert">
      <div>
        <TriangleExclamationPoint className="mx-auto h-10 w-10" aria-hidden="true" />
        <h1 className="mt-3 font-display text-3xl font-extrabold">Oops, a page fell out of the notebook</h1>
        <p className="font-hand text-2xl text-ink/60">something went wrong while loading this page</p>
        <div className="mt-5 flex justify-center gap-2">
          <Button color="yellow" onClick={() => retry()}>Try again</Button>
          <Button href="/">Back to the feed</Button>
        </div>
      </div>
    </div>
  )
}
