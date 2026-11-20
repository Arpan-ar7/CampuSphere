// 🔔 bell in the top bar with a drop-down list of notifications.
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, X } from 'lucide-react'
import { api } from '../../api/index.js'
import { cn } from '../../utils/cn.js'
import { timeAgo } from '../../utils/time.js'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import IconButton from '../ui/IconButton.jsx'

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const box = useRef(null)
  const { pathname } = useLocation()

  // Reload when the page changes (e.g. after accepting a request)
  useEffect(() => {
    api.getNotifications().then(setItems)
  }, [pathname])

  // Close on outside click or Esc
  useEffect(() => {
    if (!open) return
    const onClick = (e) => box.current && !box.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const unread = items.filter((n) => !n.read).length

  const markAllRead = async () => {
    await api.markAllNotificationsRead()
    setItems(await api.getNotifications())
  }

  return (
    <div ref={box} className="relative">
      <IconButton label="Notifications" badge={unread} aria-expanded={open} onClick={() => setOpen(!open)}>
        <Bell className="h-[18px] w-[18px]" />
      </IconButton>

      {open && (
        <div className="absolute top-12 right-0 z-50 w-[min(22rem,calc(100vw-1.5rem))] animate-fade-up rounded-2xl border-2 border-ink bg-card p-4 shadow-ink-lg">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold">Notifications</h2>
            <IconButton label="Close notifications" small onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </IconButton>
          </div>

          {items.length === 0 ? (
            <p className="font-hand text-xl text-ink/60">nothing new, all quiet on campus</p>
          ) : (
            <ul className="max-h-80 space-y-1 overflow-y-auto">
              {items.map((n) => (
                <li key={n.id}>
                  <Link to={n.link} onClick={() => setOpen(false)} className={cn('flex gap-2.5 rounded-lg p-1.5 hover:bg-hl-yellow/40', !n.read && 'bg-hl-yellow/25')}>
                    <Avatar user={n.author} size="sm" />
                    <p className="text-sm leading-snug">
                      <strong>{n.author.name}</strong> {n.text} <em>{n.target}</em>{' '}
                      <span className="font-hand text-base text-ink/60">· {timeAgo(n.createdAt)}</span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Button size="sm" color="mint" className="mt-3 w-full" onClick={markAllRead} disabled={unread === 0}>
            {unread === 0 ? 'All caught up ✓' : 'Mark all as read'}
          </Button>
        </div>
      )}
    </div>
  )
}
