'use client'

// ─────────────────────────────────────────────────────────────
//  Little pop-up messages in the corner.
//  Use: const toast = useToast(); toast('Saved!', 'mint')   (colour is optional)
// ─────────────────────────────────────────────────────────────
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CircleCheck } from 'lucide-react'
import { BG } from '@/utils/colors'
import { cn } from '@/utils/cn'
import type { HighlightColor } from '@/types'

/** Show a pop-up message, e.g. toast('Saved!', 'mint'). Use 'pink' for errors. */
export type ToastFn = (message: string, color?: HighlightColor) => void

interface ToastItem {
  id: string
  message: string
  color: HighlightColor
}

const ToastContext = createContext<ToastFn>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback<ToastFn>((message, color = 'yellow') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((list) => [...list, { id, message, color }])
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 2800)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed right-3 bottom-24 z-[60] flex w-[min(20rem,calc(100vw-1.5rem))] flex-col gap-2 lg:bottom-6" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={cn('flex animate-fade-up items-start gap-2 rounded-2xl border-2 border-ink p-3 shadow-ink-lg', BG[t.color])}>
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />
            <p className="text-sm leading-snug font-medium">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Hook to read this context (lives next to its provider on purpose)
export const useToast = (): ToastFn => useContext(ToastContext)
