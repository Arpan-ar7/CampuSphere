// ─────────────────────────────────────────────────────────────
//  Full-screen "opening your notebook…" loader. Shown while the saved login is being read,
//  and as the placeholder the server sends before the browser takes over.
// ─────────────────────────────────────────────────────────────
import { NotebookPen } from 'lucide-react'

export default function FullPageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper bg-[linear-gradient(var(--color-gridline)_1px,transparent_1px),linear-gradient(90deg,var(--color-gridline)_1px,transparent_1px)] bg-[size:28px_28px]">
      <div className="flex flex-col items-center gap-3" role="status">
        <span className="grid h-14 w-14 animate-bounce place-items-center rounded-2xl border-2 border-ink bg-hl-yellow shadow-ink-lg">
          <NotebookPen className="h-7 w-7" />
        </span>
        <p className="font-hand text-2xl text-ink/70">opening your notebook…</p>
      </div>
    </div>
  )
}
