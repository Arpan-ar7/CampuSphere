// Trending: the top 5 most popular posts, notes and team projects.
// score = likes + replies + saves (+ applicants for projects)
import * as mock from '../mock/data.js'
import { USE_MOCK, request, wait } from './client.js'
import { toProject } from './teams.js'

export async function getTrending() {
  if (!USE_MOCK) return request('/trending')
  await wait()
  const items = [
    ...mock.posts.map((p) => ({ type: 'post', id: p.id, text: p.content.replaceAll('==', ''), authorId: p.authorId, createdAt: p.createdAt, likes: p.likes, comments: p.comments, saves: p.saves })),
    ...mock.notes.map((n) => ({ type: 'note', id: n.id, text: n.title, authorId: n.uploaderId, createdAt: n.uploadedAt, likes: n.likes, saves: n.saves })),
    ...mock.collabPosts.map((c) => ({ type: 'project', id: c.id, text: c.title, authorId: c.authorId, createdAt: c.createdAt, saves: c.saves, applicants: toProject(c).applicantsCount })),
  ]
  const score = (i) => (i.likes || 0) + (i.comments || 0) + (i.saves || 0) + (i.applicants || 0)
  return items
    .map((i) => mock.withAuthor({ ...i, score: score(i) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}
