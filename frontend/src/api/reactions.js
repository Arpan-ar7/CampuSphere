// Like & save — work the same for posts, notes and team projects.
// kind: 'posts' | 'notes' | 'collabs'
import * as mock from '../mock/data.js'
import { USE_MOCK, request } from './client.js'

const MOCK_LISTS = { posts: mock.posts, notes: mock.notes, collabs: mock.collabPosts }

export async function toggleLike(kind, id) {
  if (!USE_MOCK) return request(`/${kind}/${id}/like`, { method: 'POST' })
  const item = MOCK_LISTS[kind].find((x) => x.id === id)
  item.liked = !item.liked
  item.likes += item.liked ? 1 : -1
  return { liked: item.liked, likes: item.likes }
}

export async function toggleSave(kind, id) {
  if (!USE_MOCK) return request(`/${kind}/${id}/save`, { method: 'POST' })
  const item = MOCK_LISTS[kind].find((x) => x.id === id)
  item.saved = !item.saved
  item.saves += item.saved ? 1 : -1
  return { saved: item.saved, saves: item.saves }
}
