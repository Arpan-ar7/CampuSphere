import { Link } from 'react-router-dom'
import { BG } from '../../utils/colors.js'
import { cn } from '../../utils/cn.js'

const SIZES = {
  sm: 'gap-1.5 rounded-[0.65rem] px-2.5 py-1 text-[0.8rem] shadow-ink-sm active:translate-x-[2px] active:translate-y-[2px]',
  md: 'gap-2 rounded-[0.85rem] px-3.5 py-2 text-sm shadow-ink active:translate-x-[3px] active:translate-y-[3px]',
  xl: 'gap-2 rounded-2xl px-5 py-2.5 text-base shadow-ink-lg active:translate-x-[4px] active:translate-y-[4px]',
}

// Chunky outlined button that "presses down" when clicked.
// color: yellow | pink | mint | blue | peach | lilac | ink | card
// Pass `to="/path"` to make it a link.
export default function Button({ color = 'card', size = 'md', to, className, children, ...props }) {
  const classes = cn(
    'inline-flex cursor-pointer items-center justify-center border-2 border-ink leading-tight font-bold transition active:shadow-none',
    'disabled:pointer-events-none disabled:opacity-50',
    BG[color],
    SIZES[size],
    className,
  )
  if (to) return <Link to={to} className={classes} {...props}>{children}</Link>
  return <button className={classes} {...props}>{children}</button>
}
