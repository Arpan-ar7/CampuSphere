// Sticky bar at the top: logo, search, streak, notifications, messages, profile.
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import Avatar from '../ui/Avatar.jsx'
import IconButton from '../ui/IconButton.jsx'
import SearchBox from '../ui/SearchBox.jsx'
import StreakChip from '../streak/StreakChip.jsx'
import Logo from './Logo.jsx'
import NotificationsMenu from './NotificationsMenu.jsx'

// Search goes to the feed with ?q=… so the feed can filter posts
function SearchForm({ initial, className }) {
  const [value, setValue] = useState(initial)
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    navigate(value.trim() ? `/?q=${encodeURIComponent(value.trim())}` : '/')
  }

  return (
    <form onSubmit={submit} role="search" className={className}>
      <SearchBox value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search posts, notes, people…" aria-label="Search CampuSphere" />
    </form>
  )
}

export default function TopBar({ unreadMessages }) {
  const { user } = useAuth()
  // `key={q}` resets the search box when the search changes (e.g. "clear search")
  const [params] = useSearchParams()
  const q = params.get('q') || ''

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-3 py-2.5 sm:px-5 lg:px-8">
        <Logo />

        <div className="ml-auto flex items-center gap-2">
          <SearchForm key={`d-${q}`} initial={q} className="hidden w-56 md:block lg:w-72" />
          <StreakChip />
          <NotificationsMenu />
          <IconButton to="/messages" label="Messages" badge={unreadMessages} className="hidden sm:grid">
            <MessageSquare className="h-[18px] w-[18px]" />
          </IconButton>
          <Link
            to={`/u/${user.handle}`}
            aria-label="Your profile"
            className="flex items-center gap-2 rounded-xl border-2 border-ink bg-hl-blue p-1 shadow-ink transition-transform hover:-translate-y-px lg:pr-3"
          >
            <Avatar user={user} size="xs" className="h-7 w-7 text-[11px]" />
            <span className="hidden font-display text-sm font-bold lg:block">{user.name.split(' ')[0]}</span>
          </Link>
        </div>
      </div>

      {/* Search on phones */}
      <div className="border-t-2 border-ink px-3 py-2 md:hidden">
        <SearchForm key={`m-${q}`} initial={q} />
      </div>
    </header>
  )
}
