// App-wide settings. Change these in one place.

export const APP_NAME = 'CampuSphere'

export const UNIVERSITY = {
  name: 'Marwadi University',
  shortName: 'Marwadi U.',
  emailHint: 'you@marwadiuniversity.ac.in',
}

// Daily streak: a day counts when the student does ANY of these.
export const STREAK = {
  activeMinutes: 5, // ...uses the app for at least this many minutes
  // ...or does one of these actions (shown in the streak pop-up)
  actions: ['post or reply', 'send a message', 'upload or open a note', 'like or save something', 'apply to a team'],
}

// Background photo(s) in /public. Add more and they swap every minute.
export const CAMPUS_PHOTOS = ['/campus.webp']
