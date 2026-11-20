// ─────────────────────────────────────────────────────────────
//  Teams: projects looking for collaborators, and requests to join them.
//  GET /collabs, /collabs/mine, /collabs/applied · POST /collabs, /collabs/:id/apply
//  PATCH /collabs/:id/applications/:applicationId (accept / reject)
// ─────────────────────────────────────────────────────────────
import * as mock from '@/mock/data'
import type { RawApplication, RawProject } from '@/mock/data'
import { USE_MOCK, newestFirst, now, request, uid, wait } from '@/services/client'
import type { Application, MyApplication, MyProject, NewProject, Project } from '@/types'

const enc = encodeURIComponent

/** Mock: raw application (userId) → full Application (applicant object) */
const toApplication = (a: RawApplication): Application => {
  const { userId, ...rest } = a
  return { ...rest, applicant: mock.userById(userId) }
}

/** Mock: adds the numbers the Teams page needs to a project */
export function toProject(c: RawProject): Project {
  const apps = mock.applications.filter((a) => a.projectId === c.id)
  const accepted = apps.filter((a) => a.status === 'accepted')
  const mine = apps.find((a) => a.userId === mock.me())
  return {
    ...mock.withAuthor(c),
    spotsLeft: Math.max(c.spots - accepted.length, 0),
    applicantsCount: apps.length,
    members: [mock.userById(c.authorId), ...accepted.map((a) => mock.userById(a.userId))],
    myApplication: mine ? toApplication(mine) : null,
  }
}

/** Explore tab: every project, newest first */
export async function getProjects(): Promise<Project[]> {
  if (!USE_MOCK) return request<Project[]>('/collabs')
  await wait()
  return mock.collabPosts.map(toProject).sort(newestFirst<Project>('createdAt'))
}

export async function getProject(id: string): Promise<Project | null> {
  if (!USE_MOCK) return request<Project>(`/collabs/${enc(id)}`)
  const project = mock.collabPosts.find((c) => c.id === id)
  return project ? toProject(project) : null
}

/** "Posted by you" tab: my projects + everyone who applied */
export async function getMyProjects(): Promise<MyProject[]> {
  if (!USE_MOCK) return request<MyProject[]>('/collabs/mine')
  await wait()
  return mock.collabPosts
    .filter((c) => c.authorId === mock.me())
    .sort(newestFirst<RawProject>('createdAt'))
    .map((c) => ({
      ...toProject(c),
      applications: mock.applications
        .filter((a) => a.projectId === c.id)
        .map(toApplication)
        .sort(newestFirst<Application>('appliedAt')),
    }))
}

/** "Applied" tab: projects I asked to join, with the owner's reply (newest reply first) */
export async function getMyApplications(): Promise<MyApplication[]> {
  if (!USE_MOCK) return request<MyApplication[]>('/collabs/applied')
  await wait()
  const lastChange = (a: MyApplication) => new Date(a.respondedAt ?? a.appliedAt).getTime()
  return mock.applications
    .filter((a) => a.userId === mock.me())
    .flatMap((a) => {
      const project = mock.collabPosts.find((c) => c.id === a.projectId)
      return project ? [{ ...toApplication(a), project: toProject(project) }] : []
    })
    .sort((a, b) => lastChange(b) - lastChange(a))
}

export async function createProject({ title, description, skillsNeeded, spots, category }: NewProject): Promise<Project> {
  if (!USE_MOCK) return request<Project>('/collabs', { method: 'POST', body: { title, description, skillsNeeded, spots, category } })
  await wait(200)
  const project: RawProject = { id: uid('cp'), authorId: mock.me(), title, description, skillsNeeded, spots: Number(spots), category, createdAt: now(), saves: 0, saved: false }
  mock.collabPosts.unshift(project)
  return toProject(project)
}

/** Ask to join a project */
export async function applyToProject(projectId: string, note: string): Promise<Application> {
  if (!USE_MOCK) return request<Application>(`/collabs/${enc(projectId)}/apply`, { method: 'POST', body: { note } })
  await wait(200)
  const app: RawApplication = { id: uid('a'), projectId, userId: mock.me(), note, status: 'pending', response: '', appliedAt: now(), respondedAt: null }
  mock.applications.push(app)
  return toApplication(app)
}

/** The project owner accepts or rejects someone, with a message they will see */
export async function respondToApplication(projectId: string, applicationId: string, status: 'accepted' | 'rejected', response: string): Promise<Application> {
  if (!USE_MOCK) {
    return request<Application>(`/collabs/${enc(projectId)}/applications/${enc(applicationId)}`, { method: 'PATCH', body: { status, response } })
  }
  await wait(200)
  const app = mock.applications.find((a) => a.id === applicationId)
  if (!app) throw new Error('That request no longer exists.')
  Object.assign(app, { status, response, respondedAt: now() })
  return toApplication(app)
}
