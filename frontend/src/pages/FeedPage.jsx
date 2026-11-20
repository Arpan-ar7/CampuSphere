// Home: the campus feed.
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookOpen, Coffee, UserPlus, X } from 'lucide-react'
import { api } from '../api/index.js'
import { useAuth } from '../context/AuthContext.jsx'
import useScrollToHash from '../hooks/useScrollToHash.js'
import PostCard from '../components/feed/PostCard.jsx'
import PostComposer from '../components/feed/PostComposer.jsx'
import StreakCard from '../components/streak/StreakCard.jsx'
import TrendingCard from '../components/trending/TrendingCard.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import PageTitle from '../components/ui/PageTitle.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import TabChips from '../components/ui/TabChips.jsx'

const FILTERS = [
  { id: 'all', label: '✨ For you' },
  { id: 'dept', label: '🏫 My dept' },
  { id: 'notes', label: '📒 Notes' },
  { id: 'teams', label: '🤝 Teams' },
  { id: 'questions', label: '❓ Questions' },
  { id: 'saved', label: '⭐ Saved' },
]

export default function FeedPage() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const query = (params.get('q') || '').toLowerCase()
  const [posts, setPosts] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.getFeed().then(setPosts)
  }, [])

  // Links like /#post-p1 (from Trending) scroll to that post
  useScrollToHash(!!posts)

  const matchesFilter = (p) =>
    ({
      all: true,
      dept: p.author.department === user.department,
      notes: !!p.note,
      teams: !!p.project,
      questions: p.type === 'question',
      saved: p.saved,
    })[filter]

  const matchesSearch = (p) =>
    !query || [p.content, p.author.name, p.note?.title, p.project?.title].some((s) => s?.toLowerCase().includes(query))

  const visible = posts?.filter((p) => matchesFilter(p) && matchesSearch(p))

  return (
    <section>
      <PageTitle title="The Campus Feed" subtitle="everything happening on campus, one page">
        <Button size="sm" color="mint" to="/notes"><BookOpen className="h-4 w-4" /> Browse notes</Button>
        <Button size="sm" color="pink" to="/teams"><UserPlus className="h-4 w-4" /> Find teammates</Button>
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
          <Button size="sm" onClick={() => setParams({})}><X className="h-3.5 w-3.5" /> clear</Button>
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
