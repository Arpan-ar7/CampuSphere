// Little pop-up messages in the corner. Use `const toast = useToast(); toast('Saved!', 'mint')`.
import { createContext, useCallback, useContext, useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { BG } from '../utils/colors.js'
import { cn } from '../utils/cn.js'

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, color = 'yellow') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((list) => [...list, { id, message, color }])
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 2800)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed right-3 bottom-24 z-[60] flex w-[min(20rem,calc(100vw-1.5rem))] flex-col gap-2 lg:bottom-6" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={cn('flex animate-fade-up items-start gap-2 rounded-2xl border-2 border-ink p-3 shadow-ink-lg', BG[t.color] || BG.yellow)}>
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />
            <p className="text-sm leading-snug font-medium">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Hook to read this context (lives next to its provider on purpose)
// oxlint-disable-next-line react/only-export-components
export const useToast = () => useContext(ToastContext)
