// Bell notifications: join requests, replies to your requests, likes, comments.
import * as mock from '../mock/data.js'
import { USE_MOCK, now, request, wait } from './client.js'

export async function getNotifications() {
  if (!USE_MOCK) return request('/notifications')
  await wait(150)
  const myProjects = mock.collabPosts.filter((c) => c.authorId === mock.me())
  const fromTeams = [
    // Someone asked to join my project
    ...mock.applications
      .filter((a) => a.status === 'pending' && myProjects.some((p) => p.id === a.projectId))
      .map((a) => ({
        id: `req-${a.id}`, actorId: a.userId, text: 'asked to join', link: '/teams?tab=mine', createdAt: a.appliedAt,
        target: mock.collabPosts.find((c) => c.id === a.projectId).title,
      })),
    // An owner replied to my request
    ...mock.applications
      .filter((a) => a.userId === mock.me() && a.respondedAt)
      .map((a) => {
        const project = mock.collabPosts.find((c) => c.id === a.projectId)
        return {
          id: `reply-${a.id}`, actorId: project.authorId, link: '/teams?tab=applied', createdAt: a.respondedAt, target: project.title,
          text: a.status === 'accepted' ? 'accepted your request for' : 'replied to your request for',
        }
      }),
  ]
  const readAt = mock.notificationState.readAt
  return [...fromTeams, ...mock.extraNotifications]
    .map((n) => ({ ...mock.withAuthor(n, 'actorId'), read: !!readAt && new Date(n.createdAt) <= new Date(readAt) }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function markAllNotificationsRead() {
  if (!USE_MOCK) return request('/notifications/read', { method: 'POST' })
  mock.notificationState.readAt = now()
}
