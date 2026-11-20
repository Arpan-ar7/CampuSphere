// Teams: projects looking for collaborators, and requests to join them.
import * as mock from '../mock/data.js'
import { USE_MOCK, newestFirst, now, request, uid, wait } from './client.js'

const toApplication = (a) => ({ ...a, applicant: mock.userById(a.userId) })

// Adds the numbers the Teams page needs to a project
export function toProject(c) {
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

// Explore tab: every project, newest first
export async function getProjects() {
  if (!USE_MOCK) return request('/collabs')
  await wait()
  return mock.collabPosts.map(toProject).sort(newestFirst('createdAt'))
}

export async function getProject(id) {
  if (!USE_MOCK) return request(`/collabs/${id}`)
  const project = mock.collabPosts.find((c) => c.id === id)
  return project ? toProject(project) : null
}

// "Posted by you" tab: my projects + everyone who applied
export async function getMyProjects() {
  if (!USE_MOCK) return request('/collabs/mine')
  await wait()
  return mock.collabPosts
    .filter((c) => c.authorId === mock.me())
    .sort(newestFirst('createdAt'))
    .map((c) => ({
      ...toProject(c),
      applications: mock.applications.filter((a) => a.projectId === c.id).map(toApplication).sort(newestFirst('appliedAt')),
    }))
}

// "Applied" tab: projects I asked to join, with the owner's reply
export async function getMyApplications() {
  if (!USE_MOCK) return request('/collabs/applied')
  await wait()
  return mock.applications
    .filter((a) => a.userId === mock.me())
    .map((a) => ({ ...toApplication(a), project: toProject(mock.collabPosts.find((c) => c.id === a.projectId)) }))
    .sort((a, b) => new Date(b.respondedAt || b.appliedAt) - new Date(a.respondedAt || a.appliedAt))
}

export async function createProject({ title, description, skillsNeeded, spots, category }) {
  if (!USE_MOCK) return request('/collabs', { method: 'POST', body: { title, description, skillsNeeded, spots, category } })
  await wait(200)
  const project = { id: uid('cp'), authorId: mock.me(), title, description, skillsNeeded, spots: Number(spots), category, createdAt: now(), saves: 0, saved: false }
  mock.collabPosts.unshift(project)
  return toProject(project)
}

// Ask to join a project
export async function applyToProject(projectId, note) {
  if (!USE_MOCK) return request(`/collabs/${projectId}/apply`, { method: 'POST', body: { note } })
  await wait(200)
  const app = { id: uid('a'), projectId, userId: mock.me(), note, status: 'pending', response: '', appliedAt: now(), respondedAt: null }
  mock.applications.push(app)
  return toApplication(app)
}

// Owner accepts or rejects someone. status: 'accepted' | 'rejected'
export async function respondToApplication(projectId, applicationId, status, response) {
  if (!USE_MOCK) return request(`/collabs/${projectId}/applications/${applicationId}`, { method: 'PATCH', body: { status, response } })
  await wait(200)
  const app = mock.applications.find((a) => a.id === applicationId)
  Object.assign(app, { status, response, respondedAt: now() })
  return toApplication(app)
}
