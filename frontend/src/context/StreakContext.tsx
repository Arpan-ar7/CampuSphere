'use client'

// ─────────────────────────────────────────────────────────────
//  Daily streak tracking. A day counts when the student:
//    • uses the app actively for 5 minutes (tab visible + moved the mouse / typed in the last minute), OR
//    • does any action — components call record('post'), record('like'), …
//  Use: const { streak, activeSeconds, goalSeconds, record } = useStreak()
// ─────────────────────────────────────────────────────────────
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { api } from '@/services'
import { STREAK } from '@/config'
import { dayKey } from '@/utils/time'
import { useToast } from '@/context/ToastContext'
import type { Streak, StreakActivity } from '@/types'

export interface StreakContextValue {
  /** null while loading */
  streak: Streak | null
  /** Active seconds today (counts up every 10 s while you use the app) */
  activeSeconds: number
  /** Seconds needed for today to count (5 minutes) */
  goalSeconds: number
  /** Call after an action, e.g. record('post'). Only the first call each day talks to the server. */
  record: (type: StreakActivity) => Promise<void>
}

const StreakContext = createContext<StreakContextValue | null>(null)

const GOAL_SECONDS = STREAK.activeMinutes * 60
const TICK_SECONDS = 10 // how often we check if the student is active
const IDLE_AFTER_MS = 60_000 // no mouse/keyboard for a minute = idle, time stops counting

// Today's active seconds, saved per day so a refresh doesn't reset it
const memory: Record<string, number> = {}
const storageKey = () => `campusphere_active_${dayKey()}`
function readActiveSeconds(): number {
  try {
    return Number(localStorage.getItem(storageKey())) || 0
  } catch {
    return memory[storageKey()] || 0
  }
}
function writeActiveSeconds(value: number): void {
  memory[storageKey()] = value
  try {
    localStorage.setItem(storageKey(), String(value))
  } catch {
    // storage blocked: memory copy is used instead
  }
}

export function StreakProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  const [streak, setStreak] = useState<Streak | null>(null)
  const [activeSeconds, setActiveSeconds] = useState(readActiveSeconds)
  const countedToday = useRef(false)

  // Call this after any action. Only the first one each day talks to the server.
  const record = useCallback(
    async (type: StreakActivity) => {
      if (countedToday.current) return
      countedToday.current = true
      try {
        const result = await api.recordActivity(type)
        setStreak(result)
        if (result.justCounted) toast(`🔥 ${result.current}-day streak! Today counts.`, 'peach')
      } catch {
        countedToday.current = false
      }
    },
    [toast],
  )

  // Load the streak. If 5 active minutes were already reached today (e.g. after a refresh), count today.
  useEffect(() => {
    api
      .getStreak()
      .then((s) => {
      if (countedToday.current) return // an action already counted today; its result is newer
      setStreak(s)
      countedToday.current = s.todayCounted
      if (!s.todayCounted && readActiveSeconds() >= GOAL_SECONDS) record('active_5min')
      })
      .catch(() => {
        // Streak is a nice extra: if it fails to load, the rest of the app keeps working
      })
  }, [record])

  // Count active time; when it reaches 5 minutes, today counts
  useEffect(() => {
    let lastInput = Date.now()
    const markActive = () => {
      lastInput = Date.now()
    }
    const events: Array<keyof WindowEventMap> = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart']
    events.forEach((e) => window.addEventListener(e, markActive, { passive: true }))

    const timer = setInterval(() => {
      const isActive = document.visibilityState === 'visible' && Date.now() - lastInput < IDLE_AFTER_MS
      if (!isActive) return
      const next = readActiveSeconds() + TICK_SECONDS
      writeActiveSeconds(next)
      setActiveSeconds(next)
      if (next >= GOAL_SECONDS) record('active_5min')
    }, TICK_SECONDS * 1000)

    return () => {
      clearInterval(timer)
      events.forEach((e) => window.removeEventListener(e, markActive))
    }
  }, [record])

  return (
    <StreakContext.Provider value={{ streak, activeSeconds, goalSeconds: GOAL_SECONDS, record }}>
      {children}
    </StreakContext.Provider>
  )
}

// Hook to read this context (lives next to its provider on purpose)
export function useStreak(): StreakContextValue {
  const value = useContext(StreakContext)
  if (!value) throw new Error('useStreak() must be used inside <StreakProvider> (it is added by AppShell).')
  return value
}
