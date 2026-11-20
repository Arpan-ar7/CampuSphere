// ─────────────────────────────────────────────────────────────
//  Daily streak: how many days in a row the student used CampuSphere.
//  GET /streak, POST /streak/activity { type }.
//  Mock mode keeps the active days in localStorage so it survives a refresh.
// ─────────────────────────────────────────────────────────────
import { USE_MOCK, request, wait } from '@/services/client'
import type { Streak, StreakActivity, StreakDay } from '@/types'
import { dayKey, daysAgo } from '@/utils/time'

const STORAGE_KEY = 'campusphere_streak_days'

function loadDays(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (Array.isArray(saved)) return saved.filter((d): d is string => typeof d === 'string')
  } catch {
    // ignore broken storage
  }
  // First run: pretend the student was active the last 11 days, plus an older 15-day run
  const seeded = [
    ...Array.from({ length: 11 }, (_, i) => dayKey(daysAgo(i + 1))),
    ...Array.from({ length: 15 }, (_, i) => dayKey(daysAgo(i + 20))),
  ]
  saveDays(seeded)
  return seeded
}

function saveDays(days: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(days))
  } catch {
    // storage blocked; streak just won't persist
  }
}

// Turns a list of active days into the numbers the UI shows
function summarize(days: string[]): Streak {
  const set = new Set(days)
  const today = dayKey()
  const todayCounted = set.has(today)

  // Current streak: consecutive days ending today (or yesterday, if today isn't done yet)
  let current = 0
  for (let i = todayCounted ? 0 : 1; set.has(dayKey(daysAgo(i))); i++) current++

  // Best streak: longest run of consecutive days ever
  let best = 0
  let run = 0
  let prev: string | null = null
  for (const d of [...set].sort()) {
    const expected = prev && dayKey(new Date(new Date(prev + 'T00:00:00').getTime() + 86_400_000))
    run = d === expected ? run + 1 : 1
    best = Math.max(best, run)
    prev = d
  }

  // Last 7 days for the little calendar
  const week: StreakDay[] = Array.from({ length: 7 }, (_, i) => {
    const date = daysAgo(6 - i)
    return {
      date: dayKey(date),
      label: date.toLocaleDateString(undefined, { weekday: 'narrow' }),
      active: set.has(dayKey(date)),
      isToday: i === 6,
    }
  })

  return { current, best: Math.max(best, current), todayCounted, week }
}

export async function getStreak(): Promise<Streak> {
  if (!USE_MOCK) return request<Streak>('/streak')
  await wait(100)
  return summarize(loadDays())
}

// type: which action happened (see StreakActivity in src/types)
// Returns the streak plus `justCounted: true` the first time today counts.
export async function recordActivity(type: StreakActivity): Promise<Streak> {
  if (!USE_MOCK) return request<Streak>('/streak/activity', { method: 'POST', body: { type } })
  const days = loadDays()
  const today = dayKey()
  const justCounted = !days.includes(today)
  if (justCounted) {
    days.push(today)
    saveDays(days)
  }
  return { ...summarize(days), justCounted, countedBy: type }
}
