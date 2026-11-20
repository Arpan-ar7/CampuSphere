'use client'

// ─────────────────────────────────────────────────────────────
//  "What's happening?" box at the top of the Feed.
//  Buttons: attach a note, highlight selected words (==like this==), mark as a question.
//  Calls onPosted(post) so the Feed can show the new post at the top.
// ─────────────────────────────────────────────────────────────
import { useRef, useState } from 'react'
import { CircleQuestionMark, Highlighter, Paperclip, Send, X } from 'lucide-react'
import { api } from '@/services'
import { LIMITS } from '@/config'
import { useCurrentUser } from '@/context/AuthContext'
import { useStreak } from '@/context/StreakContext'
import { useToast } from '@/context/ToastContext'
import { cn } from '@/utils/cn'
import { errorMessage } from '@/utils/errors'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Chip from '@/components/ui/Chip'
import { Tape } from '@/components/ui/Decorations'
import { Textarea } from '@/components/ui/FormFields'
import AttachNoteModal from '@/components/feed/AttachNoteModal'
import type { Note, Post } from '@/types'

const MAX_LENGTH = LIMITS.post // counter turns red past this

export default function PostComposer({ onPosted }: { onPosted: (post: Post) => void }) {
  const user = useCurrentUser()
  const { record } = useStreak()
  const toast = useToast()
  const textRef = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState('')
  const [isQuestion, setIsQuestion] = useState(false)
  const [note, setNote] = useState<Note | null>(null)
  const [picking, setPicking] = useState(false)
  const [posting, setPosting] = useState(false)

  // Wrap the selected words in ==…== so they show highlighted
  const highlight = () => {
    const el = textRef.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    const selected = text.slice(start, end) || 'highlighted words'
    setText(`${text.slice(0, start)}==${selected}==${text.slice(end)}`)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + 2, start + 2 + selected.length)
    })
  }

  const submit = async () => {
    if (!text.trim() || text.length > MAX_LENGTH) return
    setPosting(true)
    try {
      const post = await api.createPost({ content: text.trim(), type: isQuestion ? 'question' : 'update', noteId: note?.id })
      onPosted(post)
      setText('')
      setIsQuestion(false)
      setNote(null)
      toast('Posted to the campus feed 🎉', 'mint')
      record('post') // counts for today's streak
    } catch (err) {
      toast(errorMessage(err), 'pink') // keep the text so nothing is lost
    } finally {
      setPosting(false)
    }
  }

  const left = MAX_LENGTH - text.length

  return (
    <Card className="relative mb-5 p-4">
      <Tape className="-top-2.5 left-8 -rotate-2" />
      <div className="flex gap-3">
        <Avatar user={user} size="lg" className="hidden sm:grid" />
        <div className="min-w-0 flex-1">
          <Textarea
            ref={textRef}
            rows={2}
            maxLength={MAX_LENGTH * 2} // hard cap for huge pastes; the counter enforces the real limit
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isQuestion ? 'Ask your campus anything…' : "Share a note, a tip, a question… what's happening?"}
            aria-label="Write a post"
          />

          {(note || isQuestion) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {isQuestion && <Chip color="peach"><CircleQuestionMark className="h-3 w-3" /> Question</Chip>}
              {note && (
                <Chip color="yellow">
                  📎 {note.title}
                  <button type="button" onClick={() => setNote(null)} aria-label="Remove attached note" className="cursor-pointer">
                    <X className="h-3 w-3" strokeWidth={3} />
                  </button>
                </Chip>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" color="yellow" onClick={() => setPicking(true)}><Paperclip className="h-4 w-4" /> Attach note</Button>
            <Button size="sm" color="lilac" onClick={highlight} title="Select words, then click to highlight them"><Highlighter className="h-4 w-4" /> Highlight</Button>
            <Button size="sm" color={isQuestion ? 'peach' : 'card'} onClick={() => setIsQuestion(!isQuestion)} aria-pressed={isQuestion}>
              <CircleQuestionMark className="h-4 w-4" /> Ask
            </Button>
            <div className="ml-auto flex items-center gap-3">
              {text && <span className={cn('text-xs font-bold', left < 0 ? 'text-red-600' : 'text-ink/50')}>{left}</span>}
              <Button size="xl" color="mint" onClick={submit} disabled={!text.trim() || left < 0 || posting}>
                {posting ? 'Posting…' : 'Post it'} <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {picking && (
        <AttachNoteModal
          onClose={() => setPicking(false)}
          onPick={(n) => {
            setNote(n)
            setPicking(false)
          }}
        />
      )}
    </Card>
  )
}
