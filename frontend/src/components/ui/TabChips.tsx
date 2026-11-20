'use client'

// ─────────────────────────────────────────────────────────────
//  Row of pill-shaped tabs; the selected one turns yellow.
//  Props: tabs [{ id, label, count? }], value (selected id), onChange(id), label (for screen readers).
// ─────────────────────────────────────────────────────────────
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface Tab<T extends string = string> {
  id: T
  label: ReactNode
  /** Pink badge number (hidden when 0) */
  count?: number
}

interface TabChipsProps<T extends string> {
  tabs: Tab<T>[]
  value: T
  onChange: (id: T) => void
  /** Read by screen readers */
  label: string
  className?: string
}

export default function TabChips<T extends string>({ tabs, value, onChange, label, className }: TabChipsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className={cn('flex flex-wrap gap-2', className)}>
      {tabs.map((tab) => {
        const selected = tab.id === value
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 text-[0.82rem] font-bold shadow-ink-sm transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
              selected ? 'bg-hl-yellow' : 'bg-card hover:bg-hl-yellow/40',
            )}
          >
            {tab.label}
            {(tab.count ?? 0) > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full border-2 border-ink bg-hl-pink px-1 text-[10px]">{tab.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
