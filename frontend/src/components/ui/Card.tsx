// ─────────────────────────────────────────────────────────────
//  The basic "cut-out paper" box: ink outline + hard shadow.
//  Props: color (see utils/colors.ts), as (which HTML tag, default div), className.
// ─────────────────────────────────────────────────────────────
import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { BG } from '@/utils/colors'
import { cn } from '@/utils/cn'
import type { SurfaceColor } from '@/types'

interface CardProps extends HTMLAttributes<HTMLElement> {
  color?: SurfaceColor
  /** Which HTML tag to use, e.g. "article" or "nav" (default "div") */
  as?: ElementType
  children: ReactNode
}

export default function Card({ color = 'card', as: Tag = 'div', className, children, ...props }: CardProps) {
  return (
    <Tag className={cn('rounded-2xl border-2 border-ink shadow-ink-lg', BG[color], className)} {...props}>
      {children}
    </Tag>
  )
}
