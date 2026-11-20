'use client'

// ─────────────────────────────────────────────────────────────
//  CHAT screen: conversation list on the left, the open chat on the right.
//  On phones you see the list first, then the chat (with a back button).
//  Enter sends, Shift+Enter makes a new line. Data: services/chat.js
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useUnread } from '@/context/UnreadContext'
import { ArrowLeft, Send } from 'lucide-react'
import { api } from '@/services'
import { LIMITS } from '@/config'
import { useToast } from '@/context/ToastContext'
import { useCurrentUser } from '@/context/AuthContext'
import { useStreak } from '@/context/StreakContext'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Textarea } from '@/components/ui/FormFields'
import IconButton from '@/components/ui/IconButton'
import PageTitle from '@/components/ui/PageTitle'
import SearchBox from '@/components/ui/SearchBox'
import Spinner from '@/components/ui/Spinner'
import { cn } from '@/utils/cn'
import { errorMessage } from '@/utils/errors'
import { timeAgo } from '@/utils/time'
import { chatHref, profileHref } from '@/utils/links'
import type { Conversation, Message } from '@/types'

export default function MessagesView() {
  const conversationId = useParams<{ chat?: string[] }>().chat?.[0] // /messages/c1 → 'c1'
  const [conversations, setConversations] = useState<Conversation[] | null>(null)
  const [search, setSearch] = useState('')

  // (Re)load the chat list whenever a different chat is opened
  useEffect(() => {
    api
      .getConversations()
      .then(setConversations)
      .catch(() => setConversations([]))
  }, [conversationId])

  const active = conversations?.find((c) => c.id === conversationId)
  const shown = conversations?.filter((c) => c.withUser.name.toLowerCase().includes(search.toLowerCase()))

  // Keep the list preview in sync after sending
  const onSent = (msg: Message) =>
    setConversations((list) => (list ?? []).map((c) => (c.id === conversationId ? { ...c, lastMessage: msg.text, updatedAt: msg.createdAt, unread: 0 } : c)))

  return (
    <section>
      <PageTitle title="Messages" color="lilac" subtitle="study groups, DMs, and project chaos" />

      <Card className="overflow-hidden">
        <div className="grid h-[calc(100dvh-17rem)] min-h-[26rem] md:grid-cols-[19rem_1fr] lg:h-[calc(100dvh-13rem)]">
          {/* Conversation list (hidden on phones while a chat is open) */}
          <div className={cn('min-h-0 flex-col border-ink md:flex md:border-r-2', conversationId ? 'hidden' : 'flex')}>
            <div className="border-b-2 border-ink p-3">
              <SearchBox value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats…" aria-label="Search conversations" />
            </div>
            <ul className="flex-1 overflow-y-auto">
              {!shown ? <Spinner /> : shown.length === 0 ? (
                <li className="p-6 text-center font-hand text-xl text-ink/60">no chats found</li>
              ) : (
                shown.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={chatHref(c.id)}
                      className={cn('flex items-start gap-2.5 border-b-2 border-gridline p-3 transition-colors hover:bg-hl-yellow/40', c.id === conversationId && 'bg-hl-yellow/50')}
                    >
                      <Avatar user={c.withUser} online={c.withUser.online} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2">
                          <span className="truncate font-display text-sm font-bold">{c.withUser.name}</span>
                          <span className="ml-auto shrink-0 text-[10px] text-ink/50">{timeAgo(c.updatedAt)}</span>
                        </span>
                        <span className="block truncate text-xs text-ink/65">{c.withUser.department}</span>
                        <span className={cn('mt-1 block truncate text-xs', c.unread ? 'font-bold' : 'text-ink/70')}>{c.lastMessage}</span>
                      </span>
                      {c.unread > 0 && c.id !== conversationId && (
                        <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full border-2 border-ink bg-hl-pink px-1 text-[10px] font-bold">{c.unread}</span>
                      )}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Open chat */}
          <div className={cn('min-h-0 flex-col md:flex', conversationId ? 'flex' : 'hidden')}>
            {active ? (
              <ChatThread key={active.id} conversation={active} onSent={onSent} />
            ) : conversationId && !conversations ? (
              <Spinner />
            ) : (
              <div className="grid flex-1 place-items-center p-6 text-center">
                <div>
                  <p className="font-display text-xl font-bold">Pick a conversation</p>
                  <p className="font-hand text-xl text-ink/60">ask for notes, plan a study session, or ping your team</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </section>
  )
}

function ChatThread({ conversation, onSent }: { conversation: Conversation; onSent: (msg: Message) => void }) {
  const user = useCurrentUser()
  const { record } = useStreak()
  const toast = useToast()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[] | null>(null)
  const [text, setText] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const { refreshUnread } = useUnread()
  const other = conversation.withUser

  // Opening a chat marks it read, so refresh the unread badge in the menu
  useEffect(() => {
    api.getMessages(conversation.id).then((list) => {
      setMessages(list)
      refreshUnread()
    })
  }, [conversation.id, refreshUnread])

  // Always show the newest message
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages])

  const send = async (e?: FormEvent) => {
    e?.preventDefault()
    const body = text.trim()
    if (!body) return
    setText('')
    try {
      const msg = await api.sendMessage(conversation.id, body)
      setMessages((list) => [...(list ?? []), msg])
      onSent(msg)
      record('message') // counts for today's streak
    } catch (err) {
      setText(body) // put the text back so nothing is lost
      toast(errorMessage(err), 'pink')
    }
  }

  // Enter sends, Shift+Enter makes a new line
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) send(e)
  }

  return (
    <>
      <div className="flex items-center gap-2.5 border-b-2 border-ink p-3">
        <IconButton label="Back to chats" small className="md:hidden" onClick={() => router.push('/messages')}>
          <ArrowLeft className="h-4 w-4" />
        </IconButton>
        <Avatar user={other} online={other.online} />
        <Link href={profileHref(other.handle)} className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold hover:underline">{other.name}</p>
          <p className="font-hand text-lg leading-none text-ink/60">{other.department} · {other.online ? 'online' : 'offline'}</p>
        </Link>
      </div>

      <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {!messages ? <Spinner /> : messages.map((m, i) => {
          const mine = m.senderId === user.id
          const newSender = i === 0 || messages[i - 1].senderId !== m.senderId
          return (
            <div key={m.id}>
              {newSender && (
                <p className="mb-1 text-center font-hand text-lg text-ink/50">{mine ? 'You' : other.name.split(' ')[0]} · {timeAgo(m.createdAt)}</p>
              )}
              <div className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                <p
                  className={cn(
                    'max-w-[85%] border-2 border-ink px-3 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap',
                    mine ? 'rounded-[1rem_1rem_0.3rem_1rem] bg-hl-yellow' : 'rounded-[1rem_1rem_1rem_0.3rem] bg-card',
                  )}
                >
                  {m.text}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={send} className="flex items-end gap-2 border-t-2 border-ink p-3">
        <Textarea rows={1} maxLength={LIMITS.message} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKeyDown} placeholder={`Message ${other.name.split(' ')[0]}…`} aria-label="Message" className="max-h-32" />
        <Button size="xl" color="yellow" className="shrink-0 px-3.5" disabled={!text.trim()} aria-label="Send message">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </>
  )
}
