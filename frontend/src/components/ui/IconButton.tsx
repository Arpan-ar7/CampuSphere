// ─────────────────────────────────────────────────────────────
//  Square button with just an icon (bell, messages, close…).
//  Props: label (for screen readers + tooltip), badge (pink counter), href, small.
// ─────────────────────────────────────────────────────────────
import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Screen-reader text + tooltip (required, because there is no visible text) */
  label: string
  badge?: number
  href?: string
  small?: boolean
  children: ReactNode
}

export default function IconButton({ label, badge = 0, href, small = false, className, children, ...props }: IconButtonProps) {
  const classes = cn(
    'relative grid shrink-0 cursor-pointer place-items-center border-2 border-ink bg-card shadow-ink-sm transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    small ? 'h-8 w-8 rounded-lg' : 'h-10 w-10 rounded-[0.8rem]',
    className,
  )
  const content = (
    <>
      {children}
      {badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 grid h-4 min-w-4 place-items-center rounded-full border-2 border-ink bg-hl-pink px-0.5 text-[9px] font-bold">
          {badge}
        </span>
      )}
    </>
  )
  if (href) return <Link href={href} aria-label={label} title={label} className={classes}>{content}</Link>
  return <button type="button" aria-label={label} title={label} className={classes} {...props}>{content}</button>
}
