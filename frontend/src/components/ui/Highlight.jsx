import { BG } from '../../utils/colors.js'
import { cn } from '../../utils/cn.js'

// Text with a slightly tilted highlighter-pen stroke behind it
export default function Highlight({ color = 'yellow', children }) {
  return (
    <span className="relative isolate inline-block">
      <span className={cn('absolute inset-x-[-4px] bottom-[0.08em] -z-10 h-[0.45em] -rotate-1 rounded-sm', BG[color])} />
      {children}
    </span>
  )
}
