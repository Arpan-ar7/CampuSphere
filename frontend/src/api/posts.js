// Campus feed: posts and comments.
import * as mock from '../mock/data.js'
import { USE_MOCK, now, request, uid, wait } from './client.js'
import { toProject } from './teams.js'

// Adds the author, comment authors and any attached note / project
function toPost(p) {
  const note = p.noteId && mock.notes.find((n) => n.id === p.noteId)
  const project = p.projectId && mock.collabPosts.find((c) => c.id === p.projectId)
  return {
    ...mock.withAuthor(p),
    recentComments: p.recentComments.map((c) => mock.withAuthor(c)),
    note: note ? mock.withAuthor(note, 'uploaderId') : null,
    project: project ? toProject(project) : null,
  }
}

export async function getFeed() {
  if (!USE_MOCK) return request('/posts')
  await wait()
  return [...mock.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(toPost)
}

// { content, type: 'update' | 'question', noteId? }
export async function createPost({ content, type = 'update', noteId = null }) {
  if (!USE_MOCK) return request('/posts', { method: 'POST', body: { content, type, noteId } })
  await wait(150)
  const post = { id: uid('p'), authorId: mock.me(), type, content, noteId, createdAt: now(), likes: 0, comments: 0, saves: 0, liked: false, saved: false, recentComments: [] }
  mock.posts.unshift(post)
  return toPost(post)
}

export async function addComment(postId, text) {
  if (!USE_MOCK) return request(`/posts/${postId}/comments`, { method: 'POST', body: { text } })
  await wait(100)
  const post = mock.posts.find((p) => p.id === postId)
  const comment = { id: uid('c'), authorId: mock.me(), text, createdAt: now() }
  post.recentComments.push(comment)
  post.comments += 1
  return mock.withAuthor(comment)
}
