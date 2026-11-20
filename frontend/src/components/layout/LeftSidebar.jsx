// Left column (big screens): university, menu, saved notes, a tip, log out.
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Bookmark, GraduationCap, LogOut } from 'lucide-react'
import { api } from '../../api/index.js'
import { UNIVERSITY } from '../../config.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { BG, subjectColor } from '../../utils/colors.js'
import { cn } from '../../utils/cn.js'
import Card from '../ui/Card.jsx'
import { StickyNote } from '../ui/Decorations.jsx'
import { NAV_LINKS } from './navLinks.js'

export default function LeftSidebar({ unreadMessages }) {
  const { user, logout } = useAuth()
  const [savedNotes, setSavedNotes] = useState([])

  useEffect(() => {
    api.getNotes().then((notes) => setSavedNotes(notes.filter((n) => n.saved)))
  }, [])

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-[5.5rem] space-y-4">
        <Card className="flex items-center gap-2.5 p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-ink bg-hl-lilac">
            <GraduationCap className="h-[18px] w-[18px]" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-bold">{UNIVERSITY.shortName}</span>
            <span className="block font-hand text-base leading-none text-ink/60">{user.department} · year {user.year}</span>
          </span>
        </Card>

        <Card as="nav" className="p-2" aria-label="Main menu">
          <ul className="space-y-1">
            {NAV_LINKS.map(({ to, label, icon: Icon, profile, showUnread }) => (
              <li key={label}>
                <NavLink
                  to={profile ? `/u/${user.handle}` : to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-lg border-2 px-3 py-2 text-sm font-bold transition-colors',
                      isActive ? 'border-ink bg-hl-yellow' : 'border-transparent hover:bg-hl-yellow/60',
                    )
                  }
                >
                  <Icon className="h-[18px] w-[18px]" /> {label}
                  {showUnread && unreadMessages > 0 && (
                    <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full border-2 border-ink bg-hl-pink px-1 text-[10px] font-bold">{unreadMessages}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-3">
          <h3 className="mb-2 flex items-center gap-1.5 font-display text-sm font-bold">
            <Bookmark className="h-4 w-4" /> My Notebook
          </h3>
          {savedNotes.length === 0 ? (
            <p className="font-hand text-lg leading-tight text-ink/60">save notes and they show up here</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {savedNotes.slice(0, 3).map((n) => (
                <li key={n.id}>
                  <Link to={`/notes#note-${n.id}`} className="flex items-center gap-2 hover:underline">
                    <span className={cn('h-3 w-3 shrink-0 rounded-sm border-2 border-ink', BG[subjectColor(n.subject)])} />
                    <span className="truncate">{n.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link to={`/u/${user.handle}?tab=saved`} className="mt-2 inline-block font-hand text-lg text-ink/70 underline decoration-dashed underline-offset-4">
            see all {savedNotes.length} saved →
          </Link>
        </Card>

        <Card className="relative p-4 pt-8">
          <StickyNote className="-top-3 right-4 rotate-3">tip!</StickyNote>
          <p className="font-hand text-xl leading-snug">
            Wrap words in <span className="rounded bg-hl-yellow px-1">==double equals==</span> to highlight them in your post ✏️
          </p>
        </Card>

        <button onClick={logout} className="flex cursor-pointer items-center gap-1.5 px-1 text-sm text-ink/60 hover:text-ink">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </aside>
  )
}
