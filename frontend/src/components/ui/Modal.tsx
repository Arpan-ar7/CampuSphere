'use client'

// ─────────────────────────────────────────────────────────────
//  Pop-up window. Closes on Esc or when clicking outside it, and stops the page scrolling behind it.
//  Props: title, onClose, children.
// ─────────────────────────────────────────────────────────────
import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import IconButton from '@/components/ui/IconButton'

// Pop-up window. Closes on Esc or when clicking outside it.
interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[85vh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-2xl border-2 border-ink bg-card p-5 shadow-ink-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold">{title}</h2>
          <IconButton label="Close" small onClick={onClose}>
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  )
}
