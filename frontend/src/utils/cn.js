// Joins class names and skips empty ones: cn('a', isOn && 'b') → 'a b'
export const cn = (...classes) => classes.filter(Boolean).join(' ')
