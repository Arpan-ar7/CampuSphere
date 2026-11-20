'use client'

// ─────────────────────────────────────────────────────────────
//  Unread chat messages count, shown as a badge in the menus.
//  Use: const { unreadMessages, refreshUnread } = useUnread()  (the chat page refreshes it after opening a chat)
// ─────────────────────────────────────────────────────────────
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { api } from '@/services'

export interface UnreadContextValue {
  unreadMessages: number
  /** Re-count unread messages (e.g. after opening a chat) */
  refreshUnread: () => void
}

const UnreadContext = createContext<UnreadContextValue>({ unreadMessages: 0, refreshUnread: () => {} })

export function UnreadProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [unreadMessages, setUnreadMessages] = useState(0)

  const refreshUnread = useCallback(() => {
    api
      .getConversations()
      .then((list) => setUnreadMessages(list.reduce((sum, c) => sum + c.unread, 0)))
      .catch(() => setUnreadMessages(0))
  }, [])

  // Re-count whenever the page changes
  useEffect(() => {
    refreshUnread()
  }, [pathname, refreshUnread])

  return <UnreadContext.Provider value={{ unreadMessages, refreshUnread }}>{children}</UnreadContext.Provider>
}

// Hook to read this context (lives next to its provider on purpose)
export const useUnread = (): UnreadContextValue => useContext(UnreadContext)
