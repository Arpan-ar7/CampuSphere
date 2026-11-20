// Streak number, this week's calendar and today's progress.
// Used inside the sidebar card and the pop-up.
import { Check, Flame } from 'lucide-react'
import { STREAK } from '../../config.js'
import { useStreak } from '../../context/StreakContext.jsx'
import { cn } from '../../utils/cn.js'
import Chip from '../ui/Chip.jsx'

export default function StreakDetails({ showRules = false }) {
  const { streak, activeSeconds, goalSeconds } = useStreak()
  if (!streak) return <p className="font-hand text-xl text-ink/60">loading your streak…</p>

  const minutes = Math.min(Math.floor(activeSeconds / 60), STREAK.activeMinutes)
  const progress = Math.min(activeSeconds / goalSeconds, 1)

  return (
    <div>
      {/* Big number */}
      <div className="flex items-end gap-2">
        <span className="font-display text-5xl leading-none font-extrabold">{streak.current}</span>
        <span className="pb-1 leading-tight font-bold">
          {streak.current === 1 ? 'day' : 'days'}
          <br />in a row
        </span>
        <span className="ml-auto pb-1 font-hand text-lg text-ink/60">best: {streak.best}</span>
      </div>

      {/* This week */}
      <ol className="mt-4 grid grid-cols-7 gap-1.5" aria-label="Last 7 days">
        {streak.week.map((day) => (
          <li key={day.date} className="flex flex-col items-center gap-1">
            <span
              title={day.active ? `${day.date}: active` : `${day.date}: not active`}
              className={cn(
                'grid h-8 w-8 place-items-center rounded-lg border-2 border-ink',
                day.active ? 'bg-hl-peach shadow-ink-sm' : 'bg-card',
                day.isToday && !day.active && 'border-dashed',
              )}
            >
              {day.active && <Flame className="h-4 w-4" fill="currentColor" />}
            </span>
            <span className={cn('text-[10px] font-bold', day.isToday ? 'text-ink' : 'text-ink/50')}>{day.isToday ? 'Today' : day.label}</span>
          </li>
        ))}
      </ol>

      {/* Today */}
      <div className="mt-4">
        {streak.todayCounted ? (
          <Chip color="mint"><Check className="h-3.5 w-3.5" strokeWidth={3} /> Today counts, see you tomorrow!</Chip>
        ) : (
          <>
            <div className="flex justify-between text-xs font-bold">
              <span>Today</span>
              <span>{minutes} / {STREAK.activeMinutes} min</span>
            </div>
            <div className="mt-1 h-3 overflow-hidden rounded-full border-2 border-ink bg-card">
              <div className="h-full bg-hl-peach transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
            <p className="mt-1.5 font-hand text-lg leading-tight text-ink/70">or post, reply, like, or open a note to count today</p>
          </>
        )}
      </div>

      {showRules && (
        <div className="mt-5 rounded-xl border-2 border-ink bg-paper p-3">
          <p className="text-sm font-bold">A day counts when you:</p>
          <ul className="mt-1.5 space-y-1 text-sm">
            <li>• use CampuSphere for {STREAK.activeMinutes} minutes, or</li>
            {STREAK.actions.map((a) => <li key={a}>• {a}</li>)}
          </ul>
          <p className="mt-2 text-xs text-ink/60">Miss a day and the streak starts again from 1.</p>
        </div>
      )}
    </div>
  )
}
