// ─────────────────────────────────────────────────────────────
//  Round avatar with the person's initials (colour is picked from their id, so it never changes).
//  Props: user, size (xs|sm|md|lg|xl), online (shows a green dot).
// ─────────────────────────────────────────────────────────────
import { BG, colorFor } from '@/utils/colors'
import { cn } from '@/utils/cn'
import type { User } from '@/types'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const SIZES: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-11 w-11 text-sm',
  xl: 'h-24 w-24 text-2xl shadow-ink-lg',
}

// Round avatar with the person's initials and a green dot when `online`.
interface AvatarProps {
  user: Pick<User, 'id' | 'name'> | null | undefined
  size?: AvatarSize
  online?: boolean
  className?: string
}

export default function Avatar({ user, size = 'md', online = false, className }: AvatarProps) {
  if (!user) return null
  const initials = user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <span className={cn('relative grid shrink-0 place-items-center rounded-full border-2 border-ink font-bold', SIZES[size], BG[colorFor(user.id)], className)}>
      {initials}
      {online && <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-hl-mint" />}
    </span>
  )
}
