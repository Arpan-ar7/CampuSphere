// ─────────────────────────────────────────────────────────────
//  Trending: the top 5 most popular posts, notes and team projects.
//  score = likes + replies + saves (+ applicants for projects).  GET /trending
// ─────────────────────────────────────────────────────────────
import * as mock from '@/mock/data'
import { USE_MOCK, request, wait } from '@/services/client'
import { toProject } from '@/services/teams'
import type { TrendingItem } from '@/types'

type Candidate = Omit<TrendingItem, 'author' | 'score'> & { authorId: string }

export async function getTrending(): Promise<TrendingItem[]> {
  if (!USE_MOCK) return request<TrendingItem[]>('/trending')
  await wait()
  const items: Candidate[] = [
    ...mock.posts.map((p): Candidate => ({ type: 'post', id: p.id, text: p.content.replaceAll('==', ''), authorId: p.authorId, createdAt: p.createdAt, likes: p.likes, comments: p.comments, saves: p.saves })),
    ...mock.notes.map((n): Candidate => ({ type: 'note', id: n.id, text: n.title, authorId: n.uploaderId, createdAt: n.uploadedAt, likes: n.likes, saves: n.saves })),
    ...mock.collabPosts.map((c): Candidate => ({ type: 'project', id: c.id, text: c.title, authorId: c.authorId, createdAt: c.createdAt, saves: c.saves, applicants: toProject(c).applicantsCount })),
  ]
  const score = (i: Candidate) => (i.likes ?? 0) + (i.comments ?? 0) + (i.saves ?? 0) + (i.applicants ?? 0)
  return items
    .map(({ authorId, ...i }) => ({ ...i, author: mock.userById(authorId), score: score({ authorId, ...i }) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}
