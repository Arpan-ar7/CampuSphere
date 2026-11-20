'use client'

// ─────────────────────────────────────────────────────────────
//  Like (♥, turns pink) and Save (🔖, turns blue) buttons for posts, notes and team projects.
//  They update instantly, then confirm with the server (and undo themselves if that fails).
//  Props: kind ('posts' | 'notes' | 'collabs'), item, small. Liking/saving counts for the streak.
// ─────────────────────────────────────────────────────────────
import { useState, type ReactNode } from 'react'
import { Bookmark, Heart } from 'lucide-react'
import { api } from '@/services'
import { useStreak } from '@/context/StreakContext'
import { useToast } from '@/context/ToastContext'
import { cn } from '@/utils/cn'
import type { Likeable, ReactionKind, Saveable } from '@/types'

// kind: 'posts' | 'notes' | 'collabs'
export function LikeButton({ kind, item, small = false }: { kind: Exclude<ReactionKind, 'collabs'>; item: Likeable; small?: boolean }) {
  const { record } = useStreak()
  const [liked, setLiked] = useState(item.liked)
  const [likes, setLikes] = useState(item.likes)

  const toggle = async () => {
    const before = { liked, likes }
    setLiked(!liked)
    setLikes(likes + (liked ? -1 : 1))
    try {
      const res = await api.toggleLike(kind, item.id)
      setLiked(res.liked)
      setLikes(res.likes)
      if (res.liked) record('like')
    } catch {
      setLiked(before.liked)
      setLikes(before.likes)
    }
  }

  return (
    <ReactionPill onClick={toggle} active={liked} activeColor="bg-hl-pink" label="Like" small={small}>
      <Heart className={cn('h-4 w-4', liked && 'animate-pop')} fill={liked ? 'currentColor' : 'none'} />
      <span>{likes}</span>
    </ReactionPill>
  )
}

export function SaveButton({ kind, item, small = false, showLabel = true }: { kind: ReactionKind; item: Saveable; small?: boolean; showLabel?: boolean }) {
  const { record } = useStreak()
  const toast = useToast()
  const [saved, setSaved] = useState(item.saved)

  const toggle = async () => {
    setSaved(!saved)
    try {
      const res = await api.toggleSave(kind, item.id)
      setSaved(res.saved)
      toast(res.saved ? 'Saved to your notebook 📒' : 'Removed from your notebook', 'mint')
      if (res.saved) record('save')
    } catch {
      setSaved(saved)
    }
  }

  return (
    <ReactionPill onClick={toggle} active={saved} activeColor="bg-hl-blue" label={saved ? 'Saved' : 'Save'} small={small}>
      <Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
      {showLabel && <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>}
    </ReactionPill>
  )
}

interface ReactionPillProps {
  onClick: () => void
  active: boolean
  activeColor: string
  label: string
  small: boolean
  children: ReactNode
}

function ReactionPill({ onClick, active, activeColor, label, small, children }: ReactionPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 border-2 border-ink font-bold shadow-ink-sm transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
        small ? 'rounded-lg px-2 py-0.5 text-xs' : 'rounded-[0.65rem] px-2.5 py-1 text-[0.8rem]',
        active ? activeColor : 'bg-card',
      )}
    >
      {children}
    </button>
  )
}
