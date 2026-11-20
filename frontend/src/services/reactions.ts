// ─────────────────────────────────────────────────────────────
//  Like & save: these work the same for posts, notes and team projects.
//  POST /:kind/:id/like, POST /:kind/:id/save   (kind: posts | notes | collabs)
// ─────────────────────────────────────────────────────────────
import * as mock from '@/mock/data'
import { USE_MOCK, request } from '@/services/client'
import type { ReactionKind } from '@/types'

export interface LikeResult {
  liked: boolean
  likes: number
}
export interface SaveResult {
  saved: boolean
  saves: number
}

// Mock lists by kind (projects have no likes, only saves)
const LIKEABLE = { posts: mock.posts, notes: mock.notes }
const SAVEABLE = { posts: mock.posts, notes: mock.notes, collabs: mock.collabPosts }

export async function toggleLike(kind: ReactionKind, id: string): Promise<LikeResult> {
  if (!USE_MOCK) return request<LikeResult>(`/${kind}/${encodeURIComponent(id)}/like`, { method: 'POST' })
  if (kind === 'collabs') throw new Error('Projects can only be saved, not liked.')
  const item = LIKEABLE[kind].find((x) => x.id === id)
  if (!item) throw new Error('That item no longer exists.')
  item.liked = !item.liked
  item.likes += item.liked ? 1 : -1
  return { liked: item.liked, likes: item.likes }
}

export async function toggleSave(kind: ReactionKind, id: string): Promise<SaveResult> {
  if (!USE_MOCK) return request<SaveResult>(`/${kind}/${encodeURIComponent(id)}/save`, { method: 'POST' })
  const item = SAVEABLE[kind].find((x) => x.id === id)
  if (!item) throw new Error('That item no longer exists.')
  item.saved = !item.saved
  item.saves += item.saved ? 1 : -1
  return { saved: item.saved, saves: item.saves }
}
