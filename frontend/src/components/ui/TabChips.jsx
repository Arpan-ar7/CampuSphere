import { cn } from '../../utils/cn.js'

// Row of pill tabs. The selected one turns yellow.
// tabs: [{ id, label, count? }]
export default function TabChips({ tabs, value, onChange, label, className }) {
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
            {tab.count > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full border-2 border-ink bg-hl-pink px-1 text-[10px]">{tab.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
