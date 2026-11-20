// ─────────────────────────────────────────────────────────────
//  Shared helpers for every file in src/services (the frontend's calls TO the backend).
//
//  While USE_MOCK is true, the services/*.ts files answer from src/mock/data.ts.
//  When the backend is ready, create frontend/.env.local with:
//    NEXT_PUBLIC_USE_MOCK=false
//    NEXT_PUBLIC_API_URL=http://localhost:5000/api
//  (endpoints and JSON shapes are in API_CONTRACT.md and src/types)
// ─────────────────────────────────────────────────────────────
import { clearSession, getToken } from '@/utils/session'

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '')
const TIMEOUT_MS = 15_000 // give up on a request after 15 seconds

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  /** JSON body (an object), or FormData when isForm is true */
  body?: unknown
  isForm?: boolean
}

/**
 * Calls the real backend and returns the JSON as type `T`.
 *  • adds the login token
 *  • stops after 15 s instead of hanging forever
 *  • logs the user out if the backend says the token is no longer valid (401)
 *  • turns failures into short, readable messages for the UI
 *
 * Example: `request<Post[]>('/posts')`
 */
export async function request<T>(path: string, { method = 'GET', body, isForm = false }: RequestOptions = {}): Promise<T> {
  const token = getToken()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(isForm ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: isForm ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === 'AbortError'
    throw new Error(timedOut ? 'The server took too long to answer. Please try again.' : 'Could not reach the server. Check your internet connection.')
  } finally {
    clearTimeout(timer)
  }

  if (res.status === 401) {
    clearSession() // token expired or invalid → back to the login page
    throw new Error('Your session has ended. Please log in again.')
  }
  if (!res.ok) {
    const err: { message?: unknown } = await res.json().catch(() => ({}))
    // Only show the backend's message if it's a short string (never dump raw error objects)
    const message = typeof err.message === 'string' && err.message.length < 200 ? err.message : `Something went wrong (${res.status}).`
    throw new Error(message)
  }
  return (res.status === 204 ? null : await res.json()) as T
}

// ── Mock-only helpers (used while USE_MOCK is true) ─────────
/** Pretend network delay */
export const wait = (ms: number = 250): Promise<void> => new Promise((r) => setTimeout(r, ms))
/** Fake unique id, e.g. "p1795…123" */
export const uid = (prefix: string): string => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`
export const now = (): string => new Date().toISOString()
/** Sort helper: newest first by a date field, e.g. list.sort(newestFirst('createdAt')) */
export const newestFirst =
  <T>(key: keyof T) =>
  (a: T, b: T): number =>
    new Date(String(b[key])).getTime() - new Date(String(a[key])).getTime()
