import * as mock from '../mock/data.js'
import { USE_MOCK, now, request, uid, wait } from './client.js'

export async function getConversations() {
  if (!USE_MOCK) return request('/conversations')
  await wait()
  return mock.conversations
    .map((c) => ({ ...c, withUser: mock.userById(c.withUserId) }))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export async function getMessages(conversationId) {
  if (!USE_MOCK) return request(`/conversations/${conversationId}/messages`)
  await wait(150)
  // Opening a chat marks it as read
  const c = mock.conversations.find((x) => x.id === conversationId)
  if (c) c.unread = 0
  return [...(mock.messages[conversationId] || [])]
}

export async function sendMessage(conversationId, text) {
  if (!USE_MOCK) return request(`/conversations/${conversationId}/messages`, { method: 'POST', body: { text } })
  const msg = { id: uid('m'), senderId: mock.me(), text, createdAt: now() }
  ;(mock.messages[conversationId] ||= []).push(msg)
  const c = mock.conversations.find((x) => x.id === conversationId)
  if (c) Object.assign(c, { lastMessage: text, updatedAt: msg.createdAt })
  return msg
}
