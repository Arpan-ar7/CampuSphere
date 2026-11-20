'use client' // Error pages must run in the browser

// ─────────────────────────────────────────────────────────────
//  Last-resort error page: only used if the ROOT layout itself crashes.
//  It replaces the whole document, so it has its own <html>/<body> and simple inline styles
//  (our Tailwind styles and fonts aren't loaded here).
// ─────────────────────────────────────────────────────────────
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#fbf7ee', color: '#1d1b16', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <title>Something went wrong · CampuSphere</title>
        <div>
          <h1 style={{ fontSize: 28 }}>CampuSphere hit a problem</h1>
          <p>Please try again in a moment.</p>
          <button
            onClick={() => retry()}
            style={{ marginTop: 16, padding: '10px 18px', border: '2px solid #1d1b16', borderRadius: 12, background: '#ffd84d', fontWeight: 700, cursor: 'pointer', boxShadow: '3px 3px 0 #1d1b16' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
