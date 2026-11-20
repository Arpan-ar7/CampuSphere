'use client'

// ─────────────────────────────────────────────────────────────
//  The FRAME around every logged-in page:
//    TopBar · LeftSidebar · [page] · RightSidebar · MobileNav (+ campus photo background)
//  Also the "must be logged in" check: logged-out visitors are sent to /login.
//  Used by: app/(main)/layout.js
// ─────────────────────────────────────────────────────────────
import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { StreakProvider } from '@/context/StreakContext'
import { UnreadProvider } from '@/context/UnreadContext'
import FullPageLoader from '@/components/ui/FullPageLoader'
import CampusBackdrop from '@/components/layout/CampusBackdrop'
import LeftSidebar from '@/components/layout/LeftSidebar'
import MobileNav from '@/components/layout/MobileNav'
import RightSidebar from '@/components/layout/RightSidebar'
import TopBar from '@/components/layout/TopBar'

export default function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  // user === undefined means "still checking", so only redirect once we know they're logged out
  useEffect(() => {
    if (user === null) router.replace('/login')
  }, [user, router])

  if (!user) return <FullPageLoader />

  return (
    <StreakProvider>
      <UnreadProvider>
        <div className="min-h-screen">
          <CampusBackdrop />
          <TopBar />
          <div className="mx-auto flex max-w-[1500px] gap-6 px-3 pt-5 pb-28 sm:px-5 lg:px-8 lg:pb-10">
            <LeftSidebar />
            <main className="min-w-0 flex-1">{children}</main>
            <RightSidebar />
          </div>
          <MobileNav />
        </div>
      </UnreadProvider>
    </StreakProvider>
  )
}
