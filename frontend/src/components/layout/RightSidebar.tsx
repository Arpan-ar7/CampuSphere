'use client'

// ─────────────────────────────────────────────────────────────
//  Right column (wide screens only): Trending top 5, your streak, People to meet, a tip.
//  (On smaller screens FeedView shows Trending + Streak at the top of the feed instead.)
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { api } from '@/services'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { StickyNote } from '@/components/ui/Decorations'
import StreakCard from '@/components/streak/StreakCard'
import TrendingCard from '@/components/trending/TrendingCard'
import { profileHref } from '@/utils/links'
import type { User } from '@/types'

function FollowButton() {
  const [following, setFollowing] = useState(false)
  return (
    <Button size="sm" color={following ? 'blue' : 'mint'} onClick={() => setFollowing(!following)}>
      {following ? 'Following ✓' : 'Follow'}
    </Button>
  )
}

export default function RightSidebar() {
  const [people, setPeople] = useState<User[]>([])

  useEffect(() => {
    api.getSuggestedPeople().then(setPeople)
  }, [])

  return (
    <aside className="hidden w-80 shrink-0 xl:block">
      <div className="sticky top-[5.5rem] max-h-[calc(100vh-6.5rem)] space-y-4 overflow-y-auto pr-1 pb-2">
        <TrendingCard />
        <StreakCard />

        <Card className="p-4">
          <h2 className="mb-3 flex items-center gap-1.5 font-display text-base font-bold">
            <UserPlus className="h-4 w-4" /> People to meet
          </h2>
          <ul className="space-y-3">
            {people.map((p) => (
              <li key={p.id} className="flex items-center gap-2.5">
                <Avatar user={p} online={p.online} />
                <Link href={profileHref(p.handle)} className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold hover:underline">{p.name}</p>
                  <p className="truncate text-xs text-ink/60">{p.department} · year {p.year}</p>
                </Link>
                <FollowButton />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="relative mt-6 p-4 pt-8">
          <StickyNote color="mint" className="-top-3 left-4 -rotate-2">tip!</StickyNote>
          <p className="font-hand text-xl leading-snug">Like, save and reply to notes you find useful. It helps them trend for everyone.</p>
        </Card>
      </div>
    </aside>
  )
}
