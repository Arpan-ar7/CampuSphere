'use client'

// ─────────────────────────────────────────────────────────────
//  Reject someone with a kind message (pre-filled, editable).
//  The applicant sees this message in their Teams → "Applied" tab.
//  Opened from MyProjectCard's "Reject" button.
// ─────────────────────────────────────────────────────────────
import { useState, type FormEvent } from 'react'
import { api } from '@/services'
import { errorMessage } from '@/utils/errors'
import { LIMITS } from '@/config'
import { useToast } from '@/context/ToastContext'
import Button from '@/components/ui/Button'
import { Field, Textarea } from '@/components/ui/FormFields'
import Modal from '@/components/ui/Modal'
import type { Application, Project } from '@/types'

interface RejectModalProps {
  project: Project
  application: Application
  onClose: () => void
  onDone: () => void
}

export default function RejectModal({ project, application, onClose, onDone }: RejectModalProps) {
  const toast = useToast()
  const name = application.applicant.name.split(' ')[0]
  const [message, setMessage] = useState(`Sorry ${name}, we've already found our team for now. Thanks for applying, and all the best!`)
  const [sending, setSending] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await api.respondToApplication(project.id, application.id, 'rejected', message.trim())
      toast(`Message sent to ${name}`, 'peach')
      onDone()
    } catch (err) {
      toast(errorMessage(err), 'pink')
      setSending(false)
    }
  }

  return (
    <Modal title={`Reject ${name}?`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-ink/75">{name} will see this message in their <b>Applied</b> tab. Keep it kind!</p>
        <Field label="Message">
          <Textarea required rows={3} maxLength={LIMITS.rejectMessage} value={message} onChange={(e) => setMessage(e.target.value)} />
        </Field>
        <div className="flex gap-2">
          <Button type="button" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button color="pink" className="flex-1" disabled={sending || !message.trim()}>{sending ? 'Sending…' : 'Reject & send'}</Button>
        </div>
      </form>
    </Modal>
  )
}
