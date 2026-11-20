// ─────────────────────────────────────────────────────────────
//  App-wide settings. Change these in ONE place and the whole app follows.
//  Nothing here is secret: everything in the frontend is visible to users.
// ─────────────────────────────────────────────────────────────
import campusPhoto from '@/assets/campus.webp'

export const APP_NAME = 'CampuSphere'

export const UNIVERSITY = {
  name: 'Marwadi University',
  shortName: 'Marwadi U.',
  emailHint: 'you@marwadiuniversity.ac.in',
}

// Daily streak: a day counts when the student does ANY of these.
export const STREAK: { activeMinutes: number; actions: string[] } = {
  activeMinutes: 5, // ...uses the app for at least this many minutes
  // ...or does one of these actions (shown in the streak pop-up)
  actions: ['post or reply', 'send a message', 'upload or open a note', 'like or save something', 'apply to a team'],
}

// Background photo(s) in src/assets. Import more and add them here; they swap every minute.
export const CAMPUS_PHOTOS = [campusPhoto]

// Longest text people can type in each box (stops huge or abusive input).
// The backend must check the same limits too — the browser can be bypassed.
export const LIMITS = {
  name: 80,
  email: 254,
  password: 128,
  department: 60,
  search: 100,
  post: 500,
  comment: 300,
  message: 2000,
  noteTitle: 120,
  noteSummary: 200,
  projectTitle: 100,
  projectDescription: 600,
  skills: 200,
  applyNote: 300,
  rejectMessage: 300,
}

// Which files can be uploaded as notes, and how big.
export const UPLOAD: { maxSizeMB: number; accept: string; allowedTypes: string[] } = {
  maxSizeMB: 20,
  accept: '.pdf,.doc,.docx,.png,.jpg,.jpeg,.webp',
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'image/webp',
  ],
}
