import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn.js'

// Square button with just an icon. `badge` shows a small pink counter.
export default function IconButton({ label, badge, to, small = false, className, children, ...props }) {
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
  if (to) return <Link to={to} aria-label={label} title={label} className={classes} {...props}>{content}</Link>
  return <button type="button" aria-label={label} title={label} className={classes} {...props}>{content}</button>
}
