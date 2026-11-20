// ─────────────────────────────────────────────────────────────
//  Text with a slightly tilted highlighter-pen stroke behind it (used by PageTitle and Login).
// ─────────────────────────────────────────────────────────────
import { BG } from '@/utils/colors'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import type { SurfaceColor } from '@/types'

export default function Highlight({ color = 'yellow', children }: { color?: SurfaceColor; children: ReactNode }) {
  return (
    <span className="relative isolate inline-block">
      <span className={cn('absolute inset-x-[-4px] bottom-[0.08em] -z-10 h-[0.45em] -rotate-1 rounded-sm', BG[color])} />
      {children}
    </span>
  )
}
