import { BG } from '../../utils/colors.js'
import { cn } from '../../utils/cn.js'

// Small rounded label for tags, subjects, statuses.
export default function Chip({ color = 'card', className, children }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border-2 border-ink px-2 py-px text-[0.72rem] font-bold whitespace-nowrap', BG[color], className)}>
      {children}
    </span>
  )
}
