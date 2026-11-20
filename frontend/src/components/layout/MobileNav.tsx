'use client'

// ─────────────────────────────────────────────────────────────
//  Bottom menu on phones and tablets (hidden on big screens, where LeftSidebar is used).
// ─────────────────────────────────────────────────────────────
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCurrentUser } from '@/context/AuthContext'
import { useUnread } from '@/context/UnreadContext'
import { cn } from '@/utils/cn'
import { NAV_LINKS, isActiveLink } from '@/components/layout/navLinks'
import { profileHref } from '@/utils/links'

export default function MobileNav() {
  const user = useCurrentUser()
  const { unreadMessages } = useUnread()
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper px-2 py-1.5 lg:hidden" aria-label="Main menu">
      <ul className="mx-auto flex max-w-lg justify-between gap-1">
        {NAV_LINKS.map(({ href, short, icon: Icon, profile, showUnread }) => {
          const target = profile ? profileHref(user.handle) : href
          const active = isActiveLink(pathname, target)
          return (
            <li key={short} className="flex-1">
              <Link
                href={target}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 rounded-xl border-2 px-1 py-1.5 text-[10px] font-bold',
                  active ? 'border-ink bg-hl-yellow' : 'border-transparent',
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {short}
                {showUnread && unreadMessages > 0 && (
                  <span className="absolute top-0.5 right-2 grid h-4 min-w-4 place-items-center rounded-full border-2 border-ink bg-hl-pink px-0.5 text-[9px]">{unreadMessages}</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
