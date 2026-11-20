// ─────────────────────────────────────────────────────────────
//  The saved login (token + user) in the browser's localStorage.
//  Only these functions touch it, so it's easy to swap later
//  (e.g. to httpOnly cookies set by the backend, which is safer; see notes/08-security.md).
// ─────────────────────────────────────────────────────────────
import type { Session } from '@/types'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

/** Fired whenever the login changes, so AuthContext can update the screen */
export const SESSION_EVENT = 'campusphere-session-change'

function announce(): void {
  window.dispatchEvent(new Event(SESSION_EVENT))
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null // storage blocked (private mode etc.)
  }
}

/** Raw saved user text (AuthContext turns it into an object) */
export function getSavedUserText(): string | null {
  try {
    return localStorage.getItem(USER_KEY)
  } catch {
    return null
  }
}

export function saveSession({ token, user }: Session): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  announce()
}

export function clearSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } finally {
    announce()
  }
}
