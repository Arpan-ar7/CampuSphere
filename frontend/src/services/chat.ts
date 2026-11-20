// ─────────────────────────────────────────────────────────────
//  Chats: list conversations, load messages (marks the chat read), send a message.
//  GET /conversations, GET /conversations/:id/messages, POST /conversations/:id/messages
// ─────────────────────────────────────────────────────────────
import * as mock from '@/mock/data'
import { USE_MOCK, now, request, uid, wait } from '@/services/client'
import type { Conversation, Message } from '@/types'

const enc = encodeURIComponent

/** Most recent conversation first */
export async function getConversations(): Promise<Conversation[]> {
  if (!USE_MOCK) return request<Conversation[]>('/conversations')
  await wait()
  return mock.conversations
    .map(({ withUserId, ...c }) => ({ ...c, withUser: mock.userById(withUserId) }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

/** Oldest message first. Opening a chat marks it as read. */
export async function getMessages(conversationId: string): Promise<Message[]> {
  if (!USE_MOCK) return request<Message[]>(`/conversations/${enc(conversationId)}/messages`)
  await wait(150)
  const c = mock.conversations.find((x) => x.id === conversationId)
  if (c) c.unread = 0
  return [...(mock.messages[conversationId] ?? [])]
}

export async function sendMessage(conversationId: string, text: string): Promise<Message> {
  if (!USE_MOCK) return request<Message>(`/conversations/${enc(conversationId)}/messages`, { method: 'POST', body: { text } })
  const msg: Message = { id: uid('m'), senderId: mock.me(), text, createdAt: now() }
  ;(mock.messages[conversationId] ??= []).push(msg)
  const c = mock.conversations.find((x) => x.id === conversationId)
  if (c) Object.assign(c, { lastMessage: text, updatedAt: msg.createdAt })
  return msg
}
