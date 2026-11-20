'use client'

// ─────────────────────────────────────────────────────────────
//  Who is logged in. Use `const { user, login, logout } = useAuth()` anywhere.
//    user === undefined → still checking (on the server, or the very first browser paint)
//    user === null      → logged out
//    user = { … }       → logged in
//
//  The login is saved in the browser (see utils/session.js). useSyncExternalStore reads it
//  safely: the server answers "not known yet", the browser fills in the real value,
//  and every tab updates when you log in or out anywhere.
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { api } from '@/services'
import { SESSION_EVENT, clearSession, getSavedUserText, saveSession } from '@/utils/session'
import type { SignupData, User } from '@/types'

export interface AuthContextValue {
  /** undefined = still checking · null = logged out · User = logged in */
  user: User | null | undefined
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Tell React when the saved login changes
function subscribe(onChange: () => void): () => void {
  window.addEventListener('storage', onChange) // login/logout in another tab
  window.addEventListener(SESSION_EVENT, onChange) // login/logout in this tab
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(SESSION_EVENT, onChange)
  }
}
const notKnownOnServer = (): undefined => undefined

export function AuthProvider({ children }: { children: ReactNode }) {
  const saved = useSyncExternalStore<string | null | undefined>(subscribe, getSavedUserText, notKnownOnServer)

  // Turn the saved text into a user object (or null if missing / broken)
  const user = useMemo<User | null | undefined>(() => {
    if (saved === undefined) return undefined
    if (saved === null) return null
    try {
      const parsed: unknown = JSON.parse(saved)
      // Basic shape check so broken/edited storage can't crash the app
      return parsed && typeof parsed === 'object' && 'id' in parsed && 'name' in parsed && 'handle' in parsed ? (parsed as User) : null
    } catch {
      return null
    }
  }, [saved])

  const login = async (email: string, password: string) => saveSession(await api.login(email.trim(), password))
  const signup = async (data: SignupData) => saveSession(await api.signup({ ...data, name: data.name.trim(), email: data.email.trim() }))
  const logout = () => clearSession()

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
}

// Hook to read this context (lives next to its provider on purpose)
export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth() must be used inside <AuthProvider> (see app/providers.tsx).')
  return value
}

/**
 * The logged-in user, guaranteed to exist.
 * Use this in anything inside the logged-in area (AppShell only shows pages once a user is known).
 */
export function useCurrentUser(): User {
  const { user } = useAuth()
  if (!user) throw new Error('useCurrentUser() can only be used on logged-in pages (inside AppShell).')
  return user
}
