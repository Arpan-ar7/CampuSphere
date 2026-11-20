// ─────────────────────────────────────────────────────────────
//  The main menu items, shared by LeftSidebar and MobileNav, plus isActiveLink()
//  which decides which menu item is highlighted for the current page.
// ─────────────────────────────────────────────────────────────
import { House, MessagesSquare, NotebookPen, UserRound, Users, type LucideIcon } from 'lucide-react'

export interface NavLink {
  href: string
  label: string
  /** Shorter label for the phone menu */
  short: string
  icon: LucideIcon
  profile?: boolean
  showUnread?: boolean
}

// One entry per menu item. `profile: true` → links to the logged-in user's own profile.
// `showUnread: true` → shows the unread-messages badge.
export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Feed', short: 'Feed', icon: House },
  { href: '/notes', label: 'Notes Library', short: 'Notes', icon: NotebookPen },
  { href: '/teams', label: 'Find Teammates', short: 'Teams', icon: Users },
  { href: '/messages', label: 'Messages', short: 'Chats', icon: MessagesSquare, showUnread: true },
  { href: '/u/', label: 'Profile', short: 'You', icon: UserRound, profile: true },
]

// Is this menu item the page we're on? ("/" only matches the feed itself)
export function isActiveLink(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}
