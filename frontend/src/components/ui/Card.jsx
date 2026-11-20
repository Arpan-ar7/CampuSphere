import { BG } from '../../utils/colors.js'
import { cn } from '../../utils/cn.js'

// The basic "cut-out paper" box: ink outline + hard shadow.
export default function Card({ color = 'card', as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag className={cn('rounded-2xl border-2 border-ink shadow-ink-lg', BG[color], className)} {...props}>
      {children}
    </Tag>
  )
}
