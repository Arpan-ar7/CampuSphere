// ─────────────────────────────────────────────────────────────
//  Chunky outlined button that "presses down" when clicked.
//  Props: color (yellow|pink|mint|blue|peach|lilac|ink|card), size (sm|md|xl),
//         href (makes it a link), plus any normal <button> props.
// ─────────────────────────────────────────────────────────────
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { BG } from '@/utils/colors'
import { cn } from '@/utils/cn'
import type { SurfaceColor } from '@/types'

export type ButtonSize = 'sm' | 'md' | 'xl'

const SIZES: Record<ButtonSize, string> = {
  sm: 'gap-1.5 rounded-[0.65rem] px-2.5 py-1 text-[0.8rem] shadow-ink-sm active:translate-x-[2px] active:translate-y-[2px]',
  md: 'gap-2 rounded-[0.85rem] px-3.5 py-2 text-sm shadow-ink active:translate-x-[3px] active:translate-y-[3px]',
  xl: 'gap-2 rounded-2xl px-5 py-2.5 text-base shadow-ink-lg active:translate-x-[4px] active:translate-y-[4px]',
}

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  color?: SurfaceColor
  size?: ButtonSize
  /** Give a path to render a link (<a>) that looks like a button */
  href?: string
  children: ReactNode
}

export default function Button({ color = 'card', size = 'md', href, className, children, ...props }: ButtonProps) {
  const classes = cn(
    'inline-flex cursor-pointer items-center justify-center border-2 border-ink leading-tight font-bold transition active:shadow-none',
    'disabled:pointer-events-none disabled:opacity-50',
    BG[color],
    SIZES[size],
    className,
  )
  if (href) {
    // Only pass link-safe attributes (title, aria-*) on to the <a>
    const linkProps: AnchorHTMLAttributes<HTMLAnchorElement> = { title: props.title, 'aria-label': props['aria-label'] }
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
