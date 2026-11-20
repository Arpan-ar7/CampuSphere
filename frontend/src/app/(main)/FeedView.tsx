'use client'

// ─────────────────────────────────────────────────────────────
//  FEED screen (route /): post composer, streak + trending (small screens), filter tabs, posts.
//  URL options: ?q=word (search from the top bar), ?focus=post-p1 (scroll to a post).
//  Data: api.getFeed() → services/posts.js
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookOpen, Coffee, UserPlus, X } from 'lucide-react'
import { api } from '@/services'
import { errorMessage } from '@/utils/errors'
import { useCurrentUser } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import useFocusFromUrl from '@/hooks/useFocusFromUrl'
import PostCard from '@/components/feed/PostCard'
import PostComposer from '@/components/feed/PostComposer'
import StreakCard from '@/components/streak/StreakCard'
import TrendingCard from '@/components/trending/TrendingCard'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import PageTitle from '@/components/ui/PageTitle'
import Spinner from '@/components/ui/Spinner'
import TabChips, { type Tab } from '@/components/ui/TabChips'
import type { Post } from '@/types'

type FeedFilter = 'all' | 'dept' | 'notes' | 'teams' | 'questions' | 'saved'

const FILTERS: Tab<FeedFilter>[] = [
  { id: 'all', label: '✨ For you' },
  { id: 'dept', label: '🏫 My dept' },
  { id: 'notes', label: '📒 Notes' },
  { id: 'teams', label: '🤝 Teams' },
  { id: 'questions', label: '❓ Questions' },
  { id: 'saved', label: '⭐ Saved' },
]

export default function FeedView() {
  const user = useCurrentUser()
  const toast = useToast()
  const params = useSearchParams()
  const router = useRouter()
  const query = (params.get('q') || '').toLowerCase()
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [filter, setFilter] = useState<FeedFilter>('all')

  // Load the posts once. If the server fails, show why and stop the spinner.
  useEffect(() => {
    api
      .getFeed()
      .then(setPosts)
      .catch((err) => {
        toast(errorMessage(err), 'pink')
        setPosts([])
      })
  }, [toast])

  // Links like /?focus=post-p1 (from Trending) scroll to that post
  useFocusFromUrl(!!posts)

  // Which posts each filter tab shows
  const matchesFilter = (p: Post): boolean =>
    ({
      all: true,
      dept: p.author.department === user.department,
      notes: !!p.note,
      teams: !!p.project,
      questions: p.type === 'question',
      saved: p.saved,
    })[filter]

  // Top-bar search (?q=…) looks in the text, the author's name and attached note/project titles
  const matchesSearch = (p: Post): boolean =>
    !query || [p.content, p.author.name, p.note?.title, p.project?.title].some((s) => s?.toLowerCase().includes(query))

  const visible = posts?.filter((p) => matchesFilter(p) && matchesSearch(p))

  return (
    <section>
      <PageTitle title="The Campus Feed" subtitle="everything happening on campus, one page">
        <Button size="sm" color="mint" href="/notes"><BookOpen className="h-4 w-4" /> Browse notes</Button>
        <Button size="sm" color="pink" href="/teams"><UserPlus className="h-4 w-4" /> Find teammates</Button>
      </PageTitle>

      <PostComposer onPosted={(post) => setPosts((list) => [post, ...(list || [])])} />

      {/* On smaller screens the right sidebar is hidden, so show streak + trending here */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:hidden">
        <StreakCard />
        <TrendingCard />
      </div>

      <TabChips label="Feed filters" tabs={FILTERS} value={filter} onChange={setFilter} className="mb-4" />

      {query && (
        <div className="mb-4 flex items-center gap-2 font-hand text-xl">
          results for “{params.get('q')}”
          <Button size="sm" onClick={() => router.replace('/', { scroll: false })}><X className="h-3.5 w-3.5" /> clear</Button>
        </div>
      )}

      {!visible ? (
        <Spinner />
      ) : visible.length === 0 ? (
        <EmptyState icon={Coffee} title="Nothing here yet" hint="try another tab, the notebook's not that full" />
      ) : (
        <div className="space-y-4">
          {visible.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}
    </section>
  )
}
