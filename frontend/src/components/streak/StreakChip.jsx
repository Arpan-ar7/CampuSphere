// 🔥 12 — the streak button in the top bar. Click it to see the details.
import { useState } from 'react'
import { Flame } from 'lucide-react'
import { useStreak } from '../../context/StreakContext.jsx'
import { cn } from '../../utils/cn.js'
import Modal from '../ui/Modal.jsx'
import StreakDetails from './StreakDetails.jsx'

export default function StreakChip() {
  const { streak } = useStreak()
  const [open, setOpen] = useState(false)
  if (!streak) return null

  const done = streak.todayCounted
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={done ? `${streak.current}-day streak, today counts` : 'Use CampuSphere today to keep your streak'}
        className={cn(
          'inline-flex cursor-pointer items-center gap-1 rounded-full border-2 border-ink px-2.5 py-1 text-sm font-bold shadow-ink-sm transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
          done ? 'bg-hl-peach' : 'border-dashed bg-card',
        )}
      >
        <Flame className="h-4 w-4" fill={done ? 'currentColor' : 'none'} /> {streak.current}
      </button>
      {open && (
        <Modal title="Your daily streak" onClose={() => setOpen(false)}>
          <StreakDetails showRules />
        </Modal>
      )}
    </>
  )
}
