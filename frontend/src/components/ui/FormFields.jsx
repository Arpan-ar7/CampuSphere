import { cn } from '../../utils/cn.js'

// Shared look for every text box, text area and dropdown
const fieldClass =
  'w-full rounded-[0.85rem] border-2 border-ink bg-card px-3.5 py-2 text-sm text-ink shadow-ink outline-none placeholder:text-ink/45 focus:ring-[3px] focus:ring-hl-blue/60'

export function Input({ className, ...props }) {
  return <input className={cn(fieldClass, className)} {...props} />
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn(fieldClass, 'resize-none', className)} {...props} />
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(fieldClass, className)} {...props}>
      {children}
    </select>
  )
}

// Label above a field
export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      {children}
    </label>
  )
}
