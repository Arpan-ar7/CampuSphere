// ─────────────────────────────────────────────────────────────
//  Bell notifications: join requests, replies to your requests, likes, comments.
//  GET /notifications, POST /notifications/read
// ─────────────────────────────────────────────────────────────
import * as mock from '@/mock/data'
import type { RawNotification } from '@/mock/data'
import { USE_MOCK, now, request, wait } from '@/services/client'
import type { AppNotification } from '@/types'
import { teamsHref } from '@/utils/links'

/** Newest first */
export async function getNotifications(): Promise<AppNotification[]> {
  if (!USE_MOCK) return request<AppNotification[]>('/notifications')
  await wait(150)
  const projectById = (id: string) => mock.collabPosts.find((c) => c.id === id)
  const myProjects = mock.collabPosts.filter((c) => c.authorId === mock.me())

  const fromTeams: RawNotification[] = [
    // Someone asked to join my project
    ...mock.applications
      .filter((a) => a.status === 'pending' && myProjects.some((p) => p.id === a.projectId))
      .map((a) => ({
        id: `req-${a.id}`, actorId: a.userId, text: 'asked to join', link: teamsHref('mine'), createdAt: a.appliedAt,
        target: projectById(a.projectId)?.title ?? 'your project',
      })),
    // An owner replied to my request
    ...mock.applications
      .filter((a) => a.userId === mock.me() && a.respondedAt)
      .flatMap((a) => {
        const project = projectById(a.projectId)
        if (!project || !a.respondedAt) return []
        return [{
          id: `reply-${a.id}`, actorId: project.authorId, link: teamsHref('applied'), createdAt: a.respondedAt, target: project.title,
          text: a.status === 'accepted' ? 'accepted your request for' : 'replied to your request for',
        }]
      }),
  ]

  const readAt = mock.notificationState.readAt
  return [...fromTeams, ...mock.extraNotifications]
    .map(({ actorId, ...n }) => ({
      ...n,
      author: mock.userById(actorId),
      read: readAt !== null && new Date(n.createdAt) <= new Date(readAt),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function markAllNotificationsRead(): Promise<void> {
  if (!USE_MOCK) return request<void>('/notifications/read', { method: 'POST' })
  mock.notificationState.readAt = now()
}
