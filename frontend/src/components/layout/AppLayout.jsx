// The frame around every page once you're logged in:
//   top bar · left sidebar · [page] · right sidebar · phone bottom menu
import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { api } from '../../api/index.js'
import CampusBackdrop from './CampusBackdrop.jsx'
import LeftSidebar from './LeftSidebar.jsx'
import MobileNav from './MobileNav.jsx'
import RightSidebar from './RightSidebar.jsx'
import TopBar from './TopBar.jsx'

export default function AppLayout() {
  const { pathname } = useLocation()
  const [unreadMessages, setUnreadMessages] = useState(0)

  // Unread-messages badge: refreshed on every page change, and by the chat page after opening a chat
  const refreshUnread = useCallback(() => {
    api.getConversations().then((list) => setUnreadMessages(list.reduce((sum, c) => sum + c.unread, 0)))
  }, [])

  useEffect(() => {
    refreshUnread()
  }, [pathname, refreshUnread])

  return (
    <div className="min-h-screen">
      <CampusBackdrop />
      <TopBar unreadMessages={unreadMessages} />

      <div className="mx-auto flex max-w-[1500px] gap-6 px-3 pt-5 pb-28 sm:px-5 lg:px-8 lg:pb-10">
        <LeftSidebar unreadMessages={unreadMessages} />
        <main className="min-w-0 flex-1">
          <Outlet context={{ refreshUnread }} />
        </main>
        <RightSidebar />
      </div>

      <MobileNav unreadMessages={unreadMessages} />
    </div>
  )
}
