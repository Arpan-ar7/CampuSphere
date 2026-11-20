import * as mock from '../mock/data.js'
import { USE_MOCK, request, wait } from './client.js'
import { toProject } from './teams.js'

// Profile page: the person + their posts, notes and projects (+ saved items if it's me)
export async function getUser(handle) {
  if (!USE_MOCK) return request(`/users/${handle}`)
  await wait()
  const user = mock.users.find((u) => u.handle === handle)
  if (!user) throw new Error('User not found')
  const isMe = user.id === mock.me()
  return {
    user,
    posts: mock.posts.filter((p) => p.authorId === user.id).map((p) => mock.withAuthor({ ...p, recentComments: p.recentComments.map((c) => mock.withAuthor(c)) })),
    notes: mock.notes.filter((n) => n.uploaderId === user.id).map((n) => mock.withAuthor(n, 'uploaderId')),
    projects: mock.collabPosts.filter((c) => c.authorId === user.id).map(toProject),
    savedNotes: isMe ? mock.notes.filter((n) => n.saved).map((n) => mock.withAuthor(n, 'uploaderId')) : [],
  }
}

// "People to meet" in the right sidebar
export async function getSuggestedPeople() {
  if (!USE_MOCK) return request('/users/suggested')
  await wait()
  return mock.users.filter((u) => u.id !== mock.me()).slice(0, 3)
}
