'use client'

// ─────────────────────────────────────────────────────────────
//  FIND TEAMMATES screen (route /teams) with three tabs:
//    Explore       → every project, search + category filter, "Request to join"
//    Posted by you → your projects + who asked to join (Accept / Reject)
//    Applied       → projects you asked to join + the owner's reply
//  URL options: ?tab=mine|applied|explore, ?focus=project-cp1. Data: services/teams.js
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Compass, Plus, Send, UserX } from 'lucide-react'
import { api } from '@/services'
import { useToast } from '@/context/ToastContext'
import useFocusFromUrl from '@/hooks/useFocusFromUrl'
import ApplicationCard from '@/components/teams/ApplicationCard'
import ApplyModal from '@/components/teams/ApplyModal'
import CreateProjectModal from '@/components/teams/CreateProjectModal'
import MyProjectCard from '@/components/teams/MyProjectCard'
import ProjectCard from '@/components/teams/ProjectCard'
import RejectModal from '@/components/teams/RejectModal'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import PageTitle from '@/components/ui/PageTitle'
import SearchBox from '@/components/ui/SearchBox'
import Spinner from '@/components/ui/Spinner'
import TabChips, { type Tab } from '@/components/ui/TabChips'
import { teamsHref } from '@/utils/links'
import { errorMessage } from '@/utils/errors'
import type { Application, MyApplication, MyProject, Project } from '@/types'
import type { TeamsTab } from '@/utils/links'

const CATEGORIES = ['All', 'Competition', 'Research', 'Hackathon', 'Side project']
const TEAMS_TABS: TeamsTab[] = ['explore', 'mine', 'applied']

export default function TeamsView() {
  const toast = useToast()
  const params = useSearchParams()
  const router = useRouter()
  // Only accept a real tab name from the URL; anything else shows Explore
  const rawTab = params.get('tab')
  const tab: TeamsTab = TEAMS_TABS.includes(rawTab as TeamsTab) ? (rawTab as TeamsTab) : 'explore'
  const setTab = (id: TeamsTab) => router.replace(teamsHref(id), { scroll: false })

  const [projects, setProjects] = useState<Project[] | null>(null) // Explore
  const [mine, setMine] = useState<MyProject[] | null>(null) // Posted by you
  const [applied, setApplied] = useState<MyApplication[] | null>(null) // Applied
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [creating, setCreating] = useState(false)
  const [applyingTo, setApplyingTo] = useState<Project | null>(null)
  const [rejecting, setRejecting] = useState<{ project: Project; application: Application } | null>(null)

  // Load all three tabs (also after every change so the counts stay right)
  const reload = useCallback(() => {
    // If a list fails to load, show why and use an empty list so the spinner stops
    const failed = <T,>(setList: (list: T[]) => void) => (err: unknown) => {
      toast(errorMessage(err), 'pink')
      setList([])
    }
    api.getProjects().then(setProjects).catch(failed(setProjects))
    api.getMyProjects().then(setMine).catch(failed(setMine))
    api.getMyApplications().then(setApplied).catch(failed(setApplied))
  }, [toast])

  useEffect(() => {
    reload()
  }, [reload])

  // Links like /teams?focus=project-cp1 scroll to that project
  useFocusFromUrl(!!projects && tab === 'explore')

  const accept = async (project: Project, application: Application) => {
    const name = application.applicant.name.split(' ')[0]
    try {
      await api.respondToApplication(project.id, application.id, 'accepted', `Welcome to the team, ${name}! Message me so we can get started.`)
      toast(`${name} is on the team 🎉`, 'mint')
      reload()
    } catch (err) {
      toast(errorMessage(err), 'pink')
    }
  }

  const q = search.toLowerCase()
  const shownProjects = projects?.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      (!q || [p.title, p.description, ...p.skillsNeeded].some((s) => s.toLowerCase().includes(q))),
  )
  const waitingForMe = mine?.reduce((n, p) => n + p.applications.filter((a) => a.status === 'pending').length, 0) || 0
  const repliesToMe = applied?.filter((a) => a.status !== 'pending').length || 0

  const TABS: Tab<TeamsTab>[] = [
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
