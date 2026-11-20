// ─────────────────────────────────────────────────────────────
//  Small rounded label for tags, subjects and statuses.  <Chip color="mint">DBMS</Chip>
// ─────────────────────────────────────────────────────────────
import { BG } from '@/utils/colors'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import type { SurfaceColor } from '@/types'

interface ChipProps {
  color?: SurfaceColor
  className?: string
  children: ReactNode
}

export default function Chip({ color = 'card', className, children }: ChipProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border-2 border-ink px-2 py-px text-[0.72rem] font-bold whitespace-nowrap', BG[color], className)}>
      {children}
    </span>
  )
}
