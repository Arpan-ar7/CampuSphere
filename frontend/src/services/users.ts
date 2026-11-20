// ─────────────────────────────────────────────────────────────
//  Profiles and "People to meet".  GET /users/:handle, GET /users/suggested
// ─────────────────────────────────────────────────────────────
import * as mock from '@/mock/data'
import { USE_MOCK, request, wait } from '@/services/client'
import { toProject } from '@/services/teams'
import type { Post, User, UserProfile } from '@/types'

/** Profile page: the person + their posts, notes and projects (+ saved notes if it's me) */
export async function getUser(handle: string): Promise<UserProfile> {
  if (!USE_MOCK) return request<UserProfile>(`/users/${encodeURIComponent(handle)}`)
  await wait()
  const user = mock.users.find((u) => u.handle === handle)
  if (!user) throw new Error('User not found')
  const isMe = user.id === mock.me()
  const posts: Post[] = mock.posts
    .filter((p) => p.authorId === user.id)
    .map((p) => ({ ...mock.withAuthor(p), recentComments: p.recentComments.map((c) => mock.withAuthor(c)) }))
  return {
    user,
    posts,
    notes: mock.notes.filter((n) => n.uploaderId === user.id).map((n) => mock.withAuthor(n, 'uploaderId')),
    projects: mock.collabPosts.filter((c) => c.authorId === user.id).map(toProject),
    savedNotes: isMe ? mock.notes.filter((n) => n.saved).map((n) => mock.withAuthor(n, 'uploaderId')) : [],
  }
}

/** "People to meet" in the right sidebar */
export async function getSuggestedPeople(): Promise<User[]> {
  if (!USE_MOCK) return request<User[]>('/users/suggested')
  await wait()
  return mock.users.filter((u) => u.id !== mock.me()).slice(0, 3)
}
