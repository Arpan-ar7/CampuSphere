// ─────────────────────────────────────────────────────────────
//  Every in-app link is built here, so:
//   • a link's format lives in one place (easy to change later), and
//   • values from the backend (ids, handles) are encoded, so a weird
//     value can never break the URL or sneak in extra parts.
// ─────────────────────────────────────────────────────────────

const enc = encodeURIComponent

export const profileHref = (handle: string, tab?: string): string => `/u/${enc(handle)}${tab ? `?tab=${enc(tab)}` : ''}`
export const chatHref = (conversationId: string): string => `/messages/${enc(conversationId)}`
export type TeamsTab = 'explore' | 'mine' | 'applied'
export const teamsHref = (tab?: TeamsTab): string => `/teams${tab ? `?tab=${enc(tab)}` : ''}`

// "?focus=…" links scroll to one item on its page (see hooks/useFocusFromUrl.js)
export const postHref = (id: string): string => `/?focus=${enc(`post-${id}`)}`
export const noteHref = (id: string): string => `/notes?focus=${enc(`note-${id}`)}`
export const projectHref = (id: string): string => `/teams?focus=${enc(`project-${id}`)}`

/**
 * Only allow links that stay inside this app (start with one "/").
 * Use this for any link that comes from the backend (e.g. notifications).
 * Blocks "javascript:…" links and "//evil.com" style links that leave the site.
 */
export function safeInternalHref(href: unknown, fallback: string = '/'): string {
  if (typeof href !== 'string') return fallback
  const isInternal = href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/\\')
  return isInternal ? href : fallback
}

/**
 * Only allow normal web addresses (http / https) to open in a new tab.
 * Returns null for anything else, e.g. "javascript:…" or "data:…".
 */
export function safeExternalUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : null
  } catch {
    return null
  }
}
