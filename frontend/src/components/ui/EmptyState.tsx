// ─────────────────────────────────────────────────────────────
//  "Nothing here" box with an icon, a title and a handwritten hint (+ optional buttons).
// ─────────────────────────────────────────────────────────────
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import Card from '@/components/ui/Card'

// "Nothing here" box with an icon, a title and a handwritten hint
interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  hint?: string
  /** Optional buttons shown under the text */
  children?: ReactNode
}

export default function EmptyState({ icon: Icon, title, hint, children }: EmptyStateProps) {
  return (
    <Card className="p-8 text-center">
      {Icon && <Icon className="mx-auto h-8 w-8" />}
      <p className="mt-2 font-display text-lg font-bold">{title}</p>
      {hint && <p className="font-hand text-xl text-ink/60">{hint}</p>}
      {children && <div className="mt-4 flex justify-center gap-2">{children}</div>}
    </Card>
  )
}
