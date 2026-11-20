// ─────────────────────────────────────────────────────────────
//  Campus feed: list posts, create a post, add a reply.
//  GET /posts, POST /posts, POST /posts/:id/comments
// ─────────────────────────────────────────────────────────────
import * as mock from '@/mock/data'
import type { RawPost } from '@/mock/data'
import { USE_MOCK, now, request, uid, wait } from '@/services/client'
import { toProject } from '@/services/teams'
import type { Comment, NewPost, Post } from '@/types'

/** Mock: raw post → full Post (author, comment authors, attached note / project) */
function toPost(p: RawPost): Post {
  const note = p.noteId ? mock.notes.find((n) => n.id === p.noteId) : undefined
  const project = p.projectId ? mock.collabPosts.find((c) => c.id === p.projectId) : undefined
  return {
    ...mock.withAuthor(p),
    recentComments: p.recentComments.map((c) => mock.withAuthor(c)),
    note: note ? mock.withAuthor(note, 'uploaderId') : null,
    project: project ? toProject(project) : null,
  }
}

/** Newest posts first */
export async function getFeed(): Promise<Post[]> {
  if (!USE_MOCK) return request<Post[]>('/posts')
  await wait()
  return [...mock.posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(toPost)
}

export async function createPost({ content, type = 'update', noteId = null }: NewPost): Promise<Post> {
  if (!USE_MOCK) return request<Post>('/posts', { method: 'POST', body: { content, type, noteId } })
  await wait(150)
  const post: RawPost = {
    id: uid('p'), authorId: mock.me(), type, content, noteId, createdAt: now(),
    likes: 0, comments: 0, saves: 0, liked: false, saved: false, recentComments: [],
  }
  mock.posts.unshift(post)
  return toPost(post)
}

export async function addComment(postId: string, text: string): Promise<Comment> {
  if (!USE_MOCK) return request<Comment>(`/posts/${encodeURIComponent(postId)}/comments`, { method: 'POST', body: { text } })
  await wait(100)
  const post = mock.posts.find((p) => p.id === postId)
  if (!post) throw new Error('That post no longer exists.')
  const comment = { id: uid('c'), authorId: mock.me(), text, createdAt: now() }
  post.recentComments.push(comment)
  post.comments += 1
  return mock.withAuthor(comment)
}
