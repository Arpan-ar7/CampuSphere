// ─────────────────────────────────────────────────────────────
//  Form building blocks with the shared notebook look:
//    <Input/>, <Textarea/>, <Select/> — normal HTML props work
//    <Field label="…">…</Field> — puts a label above a field
// ─────────────────────────────────────────────────────────────
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

// Shared look for every text box, text area and dropdown
const fieldClass =
  'w-full rounded-[0.85rem] border-2 border-ink bg-card px-3.5 py-2 text-sm text-ink shadow-ink outline-none placeholder:text-ink/45 focus:ring-[3px] focus:ring-hl-blue/60'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: React.Ref<HTMLTextAreaElement> }) {
  return <textarea className={cn(fieldClass, 'resize-none', className)} {...props} />
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClass, className)} {...props}>
      {children}
    </select>
  )
}

// Label above a field
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      {children}
    </label>
  )
}
