// A student's profile: card, stats, and tabs for posts / notes / projects / saved.
// /u/arpan?tab=saved opens straight on a tab.
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { BadgeCheck, Flame, GraduationCap, MessageCircle, Pencil, UserPlus } from 'lucide-react'
import { api } from '../api/index.js'
import { UNIVERSITY } from '../config.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useStreak } from '../context/StreakContext.jsx'
import PostCard from '../components/feed/PostCard.jsx'
import NoteCard from '../components/notes/NoteCard.jsx'
import ProjectCard from '../components/teams/ProjectCard.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Chip from '../components/ui/Chip.jsx'
import { Tape } from '../components/ui/Decorations.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import TabChips from '../components/ui/TabChips.jsx'

function Stat({ value, label }) {
  return (
    <Card className="p-3 text-center">
      <p className="font-display text-2xl font-extrabold">{value}</p>
      <p className="text-xs font-bold tracking-wide text-ink/60 uppercase">{label}</p>
    </Card>
  )
}

export default function ProfilePage() {
  const { handle } = useParams()
  const { user: me } = useAuth()
  const { streak } = useStreak()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'posts'
  // Remember which handle the data belongs to, so switching profiles shows the spinner
  const [result, setResult] = useState({ handle: null })

  useEffect(() => {
    api
      .getUser(handle)
      .then((data) => setResult({ handle, data }))
      .catch((e) => setResult({ handle, error: e.message }))
  }, [handle])

  if (result.handle !== handle) return <Spinner />
  if (result.error) return <EmptyState title="Profile not found" hint={result.error} />

  const { user, posts, notes, projects, savedNotes } = result.data
  const isMe = user.id === me.id

  const tabs = [
    { id: 'posts', label: `Posts (${posts.length})` },
    { id: 'notes', label: `Notes (${notes.length})` },
    { id: 'projects', label: `Projects (${projects.length})` },
    ...(isMe ? [{ id: 'saved', label: `Saved (${savedNotes.length})` }] : []),
  ]

  return (
    <section>
      {/* Profile card */}
      <Card className="relative mb-5 overflow-hidden p-5">
        <div className="pointer-events-none absolute inset-0 bg-paper bg-[linear-gradient(var(--color-gridline)_1px,transparent_1px),linear-gradient(90deg,var(--color-gridline)_1px,transparent_1px)] bg-[size:28px_28px] opacity-90" />
        <Tape className="-top-2.5 right-10 rotate-3" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar user={user} size="xl" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{user.name}</h1>
            <p className="text-sm text-ink/70">@{user.handle} · {user.department} · year {user.year}</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed">{user.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip color="yellow"><GraduationCap className="h-3.5 w-3.5" /> {UNIVERSITY.shortName}</Chip>
              {isMe && streak && <Chip color="peach"><Flame className="h-3.5 w-3.5" /> {streak.current}-day streak</Chip>}
              {notes.length >= 2 && <Chip color="pink"><BadgeCheck className="h-3.5 w-3.5" /> Note sharer</Chip>}
              {user.skills.map((s) => <Chip key={s} color="mint">{s}</Chip>)}
            </div>
          </div>
          {isMe ? (
            <Button color="lilac"><Pencil className="h-4 w-4" /> Edit profile</Button>
          ) : (
            <div className="flex gap-2">
              <Button color="mint"><UserPlus className="h-4 w-4" /> Follow</Button>
              <Button to="/messages" aria-label="Message"><MessageCircle className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
      </Card>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={notes.length} label="Notes shared" />
        <Stat value={projects.length} label="Projects" />
        <Stat value={user.followers} label="Followers" />
        {isMe && streak ? <Stat value={`🔥 ${streak.best}`} label="Best streak" /> : <Stat value={user.following} label="Following" />}
      </div>

      <TabChips label="Profile sections" tabs={tabs} value={tab} onChange={(id) => setParams({ tab: id })} className="mb-4" />

      {tab === 'posts' && (posts.length ? <div className="space-y-4">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div> : <EmptyState title="No posts yet" hint={isMe ? 'go say hi to the campus 👋' : 'nothing posted yet'} />)}
      {tab === 'notes' && (notes.length ? <div className="grid gap-4 sm:grid-cols-2">{notes.map((n) => <NoteCard key={n.id} note={n} />)}</div> : <EmptyState title="No notes shared" hint="upload your first cheat sheet and become campus famous" />)}
      {tab === 'projects' && (projects.length ? <div className="space-y-4">{projects.map((p) => <ProjectCard key={p.id} project={p} />)}</div> : <EmptyState title="No projects" hint="post one from the Teams page" />)}
      {tab === 'saved' && (savedNotes.length ? <div className="grid gap-4 sm:grid-cols-2">{savedNotes.map((n) => <NoteCard key={n.id} note={n} />)}</div> : <EmptyState title="Nothing saved yet" hint="tap the bookmark on any note to keep it here" />)}
    </section>
  )
}
