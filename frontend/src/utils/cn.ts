// ─────────────────────────────────────────────────────────────
//  Joins class names and skips empty ones:  cn('a', isOn && 'b') → 'a b'
// ─────────────────────────────────────────────────────────────
export const cn = (...classes: Array<string | false | null | undefined>): string => classes.filter(Boolean).join(' ')
