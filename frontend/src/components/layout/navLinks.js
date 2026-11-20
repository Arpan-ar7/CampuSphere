import { House, MessagesSquare, NotebookPen, UserRound, Users } from 'lucide-react'

// Main menu, used by the left sidebar and the phone bottom bar.
// `profile: true` → links to the logged-in user's profile.
export const NAV_LINKS = [
  { to: '/', label: 'Feed', short: 'Feed', icon: House },
  { to: '/notes', label: 'Notes Library', short: 'Notes', icon: NotebookPen },
  { to: '/teams', label: 'Find Teammates', short: 'Teams', icon: Users },
  { to: '/messages', label: 'Messages', short: 'Chats', icon: MessagesSquare, showUnread: true },
  { to: '/u/', label: 'Profile', short: 'You', icon: UserRound, profile: true },
]
