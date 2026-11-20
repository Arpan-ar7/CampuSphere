import { BG } from '../../utils/colors.js'
import { cn } from '../../utils/cn.js'

// A strip of yellow tape stuck on a card. Position it with className, e.g. "-top-2.5 left-8 -rotate-2".
export function Tape({ className }) {
  return <span aria-hidden="true" className={cn('pointer-events-none absolute h-5 w-[84px] border-x border-dashed border-ink/25 bg-hl-yellow/60', className)} />
}

// A small sticky note stuck on a card. Position it with className.
export function StickyNote({ color = 'yellow', className, children }) {
  return (
    <span className={cn('absolute rounded-md border-2 border-ink px-3 py-1 font-hand text-lg leading-none shadow-ink', BG[color], className)}>
      {children}
    </span>
  )
}
