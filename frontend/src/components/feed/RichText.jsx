// Shows post text with ==highlighted words== and bold #tags.
// (Plain text only, so nobody can inject HTML into a post.)
import { BG } from '../../utils/colors.js'
import { cn } from '../../utils/cn.js'

const HIGHLIGHT_COLORS = ['yellow', 'mint', 'blue', 'peach', 'lilac', 'pink']

const isHighlight = (part) => part.startsWith('==') && part.endsWith('==') && part.length > 4

export default function RichText({ text, className }) {
  const parts = text.split(/(==[^=]+==|#\w+)/g)

  return (
    <p className={cn('text-[15px] leading-relaxed break-words whitespace-pre-wrap', className)}>
      {parts.map((part, i) => {
        if (isHighlight(part)) {
          // 1st highlight yellow, 2nd mint, 3rd blue…
          const nth = parts.slice(0, i).filter(isHighlight).length
          const color = HIGHLIGHT_COLORS[nth % HIGHLIGHT_COLORS.length]
          return (
            <mark key={i} className={cn('rounded-[3px] px-[0.18em] text-ink [box-decoration-break:clone]', BG[color])}>
              {part.slice(2, -2)}
            </mark>
          )
        }
        if (part.startsWith('#') && part.length > 1) return <strong key={i}>{part}</strong>
        return part
      })}
    </p>
  )
}
