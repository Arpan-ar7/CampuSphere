// Find Teammates: Explore projects · Posted by you (accept / reject) · Applied (replies).
// The tab is in the URL (?tab=mine) so notifications can link straight to it.
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Compass, Plus, Send, UserX } from 'lucide-react'
import { api } from '../api/index.js'
import { useToast } from '../context/ToastContext.jsx'
import useScrollToHash from '../hooks/useScrollToHash.js'
import ApplicationCard from '../components/teams/ApplicationCard.jsx'
import ApplyModal from '../components/teams/ApplyModal.jsx'
import CreateProjectModal from '../components/teams/CreateProjectModal.jsx'
import MyProjectCard from '../components/teams/MyProjectCard.jsx'
import ProjectCard from '../components/teams/ProjectCard.jsx'
import RejectModal from '../components/teams/RejectModal.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import PageTitle from '../components/ui/PageTitle.jsx'
import SearchBox from '../components/ui/SearchBox.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import TabChips from '../components/ui/TabChips.jsx'

const CATEGORIES = ['All', 'Competition', 'Research', 'Hackathon', 'Side project']

export default function TeamsPage() {
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'explore'
  const setTab = (id) => setParams({ tab: id })

  const [projects, setProjects] = useState(null) // Explore
  const [mine, setMine] = useState(null) // Posted by you
  const [applied, setApplied] = useState(null) // Applied
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [creating, setCreating] = useState(false)
  const [applyingTo, setApplyingTo] = useState(null)
  const [rejecting, setRejecting] = useState(null) // { project, application }

  // Load all three tabs (also after every change so the counts stay right)
  const reload = useCallback(() => {
    api.getProjects().then(setProjects)
    api.getMyProjects().then(setMine)
    api.getMyApplications().then(setApplied)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  // Links like /teams#project-cp1 scroll to that project
  useScrollToHash(!!projects && tab === 'explore')

  const accept = async (project, application) => {
    const name = application.applicant.name.split(' ')[0]
    await api.respondToApplication(project.id, application.id, 'accepted', `Welcome to the team, ${name}! Message me so we can get started.`)
    toast(`${name} is on the team 🎉`, 'mint')
    reload()
  }

  const q = search.toLowerCase()
  const shownProjects = projects?.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      (!q || [p.title, p.description, ...p.skillsNeeded].some((s) => s.toLowerCase().includes(q))),
  )
  const waitingForMe = mine?.reduce((n, p) => n + p.applications.filter((a) => a.status === 'pending').length, 0) || 0
  const repliesToMe = applied?.filter((a) => a.status !== 'pending').length || 0

  const TABS = [
    { id: 'explore', label: '🔎 Explore' },
    { id: 'mine', label: '📬 Posted by you', count: waitingForMe },
    { id: 'applied', label: '📨 Applied', count: repliesToMe },
  ]

  return (
    <section>
      <PageTitle title="Find Teammates" color="pink" subtitle="groups forming across campus right now">
        <Button color="mint" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Post a project</Button>
      </PageTitle>

      <TabChips label="Teams sections" tabs={TABS} value={tab} onChange={setTab} className="mb-4" />

      {/* ── Explore ── */}
      {tab === 'explore' && (
        <>
          <Card className="mb-4 flex flex-wrap items-center gap-3 p-3">
            <SearchBox className="min-w-[13rem] flex-1" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects, skills…" aria-label="Search projects" />
            <TabChips label="Categories" tabs={CATEGORIES.map((c) => ({ id: c, label: c }))} value={category} onChange={setCategory} />
          </Card>
          {!shownProjects ? <Spinner /> : shownProjects.length === 0 ? (
            <EmptyState icon={UserX} title="No teams match" hint="be the first to post one!" />
          ) : (
            <div className="space-y-4">
              {shownProjects.map((p) => <ProjectCard key={p.id} project={p} onApply={() => setApplyingTo(p)} />)}
            </div>
          )}
        </>
      )}

      {/* ── Posted by you ── */}
      {tab === 'mine' && (
        !mine ? <Spinner /> : mine.length === 0 ? (
          <EmptyState icon={Plus} title="You haven't posted a project yet" hint="post one and requests to join show up here">
            <Button color="mint" onClick={() => setCreating(true)}>Post a project</Button>
          </EmptyState>
        ) : (
          <div className="space-y-4">
            {mine.map((p) => (
              <MyProjectCard key={p.id} project={p} onAccept={(a) => accept(p, a)} onReject={(a) => setRejecting({ project: p, application: a })} />
            ))}
          </div>
        )
      )}

      {/* ── Applied ── */}
      {tab === 'applied' && (
        !applied ? <Spinner /> : applied.length === 0 ? (
          <EmptyState icon={Send} title="You haven't asked to join a team yet" hint="find a project you like and send a request">
            <Button color="yellow" onClick={() => setTab('explore')}><Compass className="h-4 w-4" /> Explore projects</Button>
          </EmptyState>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {applied.map((a) => <ApplicationCard key={a.id} application={a} />)}
          </div>
        )
      )}

      {/* ── Pop-ups ── */}
      {creating && (
        <CreateProjectModal
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false)
            reload()
            setTab('mine')
          }}
        />
      )}
      {applyingTo && (
        <ApplyModal
          project={applyingTo}
          onClose={() => setApplyingTo(null)}
          onApplied={() => {
            setApplyingTo(null)
            reload()
          }}
        />
      )}
      {rejecting && (
        <RejectModal
          {...rejecting}
          onClose={() => setRejecting(null)}
          onDone={() => {
            setRejecting(null)
            reload()
          }}
        />
      )}
    </section>
  )
}
