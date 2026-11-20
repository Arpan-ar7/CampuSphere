// Daily streak. A day counts when the student:
//   • uses the app actively for 5 minutes (tab visible + moved the mouse / typed in the last minute), OR
//   • does any action — call `record('post')`, `record('like')`, … from that button.
// Use `const { streak, activeSeconds, goalSeconds, record } = useStreak()` anywhere.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { api } from '../api/index.js'
import { STREAK } from '../config.js'
import { dayKey } from '../utils/time.js'
import { useToast } from './ToastContext.jsx'

const StreakContext = createContext(null)

const GOAL_SECONDS = STREAK.activeMinutes * 60
const TICK_SECONDS = 10 // how often we check if the student is active
const IDLE_AFTER_MS = 60_000 // no mouse/keyboard for a minute = idle, time stops counting

// Today's active seconds, saved per day so a refresh doesn't reset it
const memory = {}
const storageKey = () => `campusphere_active_${dayKey()}`
function readActiveSeconds() {
  try {
    return Number(localStorage.getItem(storageKey())) || 0
  } catch {
    return memory[storageKey()] || 0
  }
}
function writeActiveSeconds(value) {
  memory[storageKey()] = value
  try {
    localStorage.setItem(storageKey(), String(value))
  } catch {
    // storage blocked: memory copy is used instead
  }
}

export function StreakProvider({ children }) {
  const toast = useToast()
  const [streak, setStreak] = useState(null)
  const [activeSeconds, setActiveSeconds] = useState(readActiveSeconds)
  const countedToday = useRef(false)

  // Call this after any action. Only the first one each day talks to the server.
  const record = useCallback(
    async (type) => {
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
    api.getStreak().then((s) => {
      if (countedToday.current) return // an action already counted today; its result is newer
      setStreak(s)
      countedToday.current = s.todayCounted
      if (!s.todayCounted && readActiveSeconds() >= GOAL_SECONDS) record('active_5min')
    })
  }, [record])

  // Count active time; when it reaches 5 minutes, today counts
  useEffect(() => {
    let lastInput = Date.now()
    const markActive = () => {
      lastInput = Date.now()
    }
    const events = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart']
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
// oxlint-disable-next-line react/only-export-components
export const useStreak = () => useContext(StreakContext)
