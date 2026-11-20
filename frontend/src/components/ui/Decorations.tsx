// ─────────────────────────────────────────────────────────────
//  Paper decorations: <Tape/> (strip of tape) and <StickyNote/> (little note) stuck on cards.
//  Position them with className, e.g. "-top-2.5 left-8 -rotate-2".
// ─────────────────────────────────────────────────────────────
import { BG } from '@/utils/colors'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import type { SurfaceColor } from '@/types'

// A strip of yellow tape stuck on a card. Position it with className, e.g. "-top-2.5 left-8 -rotate-2".
export function Tape({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('pointer-events-none absolute h-5 w-[84px] border-x border-dashed border-ink/25 bg-hl-yellow/60', className)} />
}

// A small sticky note stuck on a card. Position it with className.
export function StickyNote({ color = 'yellow', className, children }: { color?: SurfaceColor; className?: string; children: ReactNode }) {
  return (
    <span className={cn('absolute rounded-md border-2 border-ink px-3 py-1 font-hand text-lg leading-none shadow-ink', BG[color], className)}>
      {children}
    </span>
  )
}
