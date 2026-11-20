// Bottom menu on phones and tablets.
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { cn } from '../../utils/cn.js'
import { NAV_LINKS } from './navLinks.js'

export default function MobileNav({ unreadMessages }) {
  const { user } = useAuth()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper px-2 py-1.5 lg:hidden" aria-label="Main menu">
      <ul className="mx-auto flex max-w-lg justify-between gap-1">
        {NAV_LINKS.map(({ to, short, icon: Icon, profile, showUnread }) => (
          <li key={short} className="flex-1">
            <NavLink
              to={profile ? `/u/${user.handle}` : to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center gap-0.5 rounded-xl border-2 px-1 py-1.5 text-[10px] font-bold',
                  isActive ? 'border-ink bg-hl-yellow' : 'border-transparent',
                )
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {short}
              {showUnread && unreadMessages > 0 && (
                <span className="absolute top-0.5 right-2 grid h-4 min-w-4 place-items-center rounded-full border-2 border-ink bg-hl-pink px-0.5 text-[9px]">{unreadMessages}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
