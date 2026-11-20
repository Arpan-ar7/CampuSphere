// ─────────────────────────────────────────────────────────────
//  Text box with a magnifying-glass icon.
//  Used by: TopBar (site search), Notes, Teams, Messages, AttachNoteModal.
//  Any normal <input> props work (value, onChange, placeholder…).
// ─────────────────────────────────────────────────────────────
import { Search } from 'lucide-react'
import { LIMITS } from '@/config'
import { cn } from '@/utils/cn'
import type { InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/FormFields'

export default function SearchBox({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink/50" aria-hidden="true" />
      <Input type="search" maxLength={LIMITS.search} className="pl-9" {...props} />
    </div>
  )
}
