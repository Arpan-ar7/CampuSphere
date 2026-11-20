'use client'

// ─────────────────────────────────────────────────────────────
//  "Ask to join" pop-up: the student writes why they'd be a good fit.
//  Opened from a project's "Request to join" button (Teams page or a post in the Feed).
//  Calls onApplied(application) when the request is sent.
// ─────────────────────────────────────────────────────────────
import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { api } from '@/services'
import { LIMITS } from '@/config'
import { useStreak } from '@/context/StreakContext'
import { useToast } from '@/context/ToastContext'
import { timeAgo } from '@/utils/time'
import { errorMessage } from '@/utils/errors'
import Button from '@/components/ui/Button'
import { Field, Textarea } from '@/components/ui/FormFields'
import Modal from '@/components/ui/Modal'
import type { Application, Project } from '@/types'

interface ApplyModalProps {
  project: Project
  onClose: () => void
  onApplied: (application: Application) => void
}

export default function ApplyModal({ project, onClose, onApplied }: ApplyModalProps) {
  const { record } = useStreak()
  const toast = useToast()
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)
  const owner = project.author.name.split(' ')[0]

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      const application = await api.applyToProject(project.id, note.trim())
      toast(`Request sent to ${owner} ✉️`, 'mint')
      record('apply') // counts for today's streak
      onApplied(application)
    } catch (err) {
      toast(errorMessage(err), 'pink')
      setSending(false)
    }
  }

  return (
    <Modal title="Ask to join" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-xl border-2 border-ink bg-paper p-3">
          <p className="font-display font-extrabold">{project.title}</p>
          <p className="text-xs text-ink/60">by {project.author.name} · posted {timeAgo(project.createdAt)}</p>
        </div>
        <Field label={`Why should ${owner} pick you? (optional)`}>
          <Textarea rows={3} maxLength={LIMITS.applyNote} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Your skills, what you'd like to work on, when you're free…" />
        </Field>
        <Button size="xl" color="yellow" disabled={sending} className="w-full">
          <Send className="h-4 w-4" /> {sending ? 'Sending…' : 'Send request'}
        </Button>
      </form>
    </Modal>
  )
}
