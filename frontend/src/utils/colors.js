// Highlighter colours as full Tailwind class names.
// (Tailwind only finds classes written out in full, so they all live here.)
export const BG = {
  yellow: 'bg-hl-yellow',
  pink: 'bg-hl-pink',
  mint: 'bg-hl-mint',
  blue: 'bg-hl-blue',
  peach: 'bg-hl-peach',
  lilac: 'bg-hl-lilac',
  card: 'bg-card',
  paper: 'bg-paper',
  ink: 'bg-ink text-paper',
}

export const COLORS = ['yellow', 'pink', 'mint', 'blue', 'peach', 'lilac']

// Same key → always the same colour (so a person keeps their avatar colour)
export function colorFor(key = '') {
  const hash = [...String(key)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return COLORS[hash % COLORS.length]
}

// Each subject gets its own "notebook divider" colour
const SUBJECT_COLORS = {
  DBMS: 'yellow',
  'Operating Systems': 'blue',
  'Data Structures': 'mint',
  Maths: 'lilac',
  'Digital Electronics': 'peach',
  Thermodynamics: 'pink',
}
export const subjectColor = (subject) => SUBJECT_COLORS[subject] || colorFor(subject)

// Team project categories
export const CATEGORY_COLORS = {
  Competition: 'peach',
  Research: 'blue',
  Hackathon: 'pink',
  'Side project': 'mint',
}
