// "Ask to join" pop-up: the student writes why they'd be a good fit.
import { useState } from 'react'
import { Send } from 'lucide-react'
import { api } from '../../api/index.js'
import { useStreak } from '../../context/StreakContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { timeAgo } from '../../utils/time.js'
import Button from '../ui/Button.jsx'
import { Field, Textarea } from '../ui/FormFields.jsx'
import Modal from '../ui/Modal.jsx'

export default function ApplyModal({ project, onClose, onApplied }) {
  const { record } = useStreak()
  const toast = useToast()
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)
  const owner = project.author.name.split(' ')[0]

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    const application = await api.applyToProject(project.id, note.trim())
    toast(`Request sent to ${owner} ✉️`, 'mint')
    record('apply')
    onApplied(application)
  }

  return (
    <Modal title="Ask to join" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-xl border-2 border-ink bg-paper p-3">
          <p className="font-display font-extrabold">{project.title}</p>
          <p className="text-xs text-ink/60">by {project.author.name} · posted {timeAgo(project.createdAt)}</p>
        </div>
        <Field label={`Why should ${owner} pick you? (optional)`}>
          <Textarea rows={3} maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Your skills, what you'd like to work on, when you're free…" />
        </Field>
        <Button size="xl" color="yellow" disabled={sending} className="w-full">
          <Send className="h-4 w-4" /> {sending ? 'Sending…' : 'Send request'}
        </Button>
      </form>
    </Modal>
  )
}
