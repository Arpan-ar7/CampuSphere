// ─────────────────────────────────────────────────────────────
//  Time helpers: timeAgo() → "5m ago", dayKey() → "2026-11-20", daysAgo(n).
// ─────────────────────────────────────────────────────────────

/** "just now", "5m ago", "3h ago", "2d ago", then a date like "12 Nov" */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return ''
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

/** Local calendar day as "YYYY-MM-DD" (used by the streak) */
export function dayKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** The date `n` days before `from` (default: today) */
export function daysAgo(n: number, from: Date = new Date()): Date {
  const d = new Date(from)
  d.setDate(d.getDate() - n)
  return d
}
