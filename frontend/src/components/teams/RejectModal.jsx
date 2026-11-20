// Reject someone with a kind message. They see it in their "Applied" tab.
import { useState } from 'react'
import { api } from '../../api/index.js'
import { useToast } from '../../context/ToastContext.jsx'
import Button from '../ui/Button.jsx'
import { Field, Textarea } from '../ui/FormFields.jsx'
import Modal from '../ui/Modal.jsx'

export default function RejectModal({ project, application, onClose, onDone }) {
  const toast = useToast()
  const name = application.applicant.name.split(' ')[0]
  const [message, setMessage] = useState(`Sorry ${name}, we've already found our team for now. Thanks for applying, and all the best!`)
  const [sending, setSending] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    await api.respondToApplication(project.id, application.id, 'rejected', message.trim())
    toast(`Message sent to ${name}`, 'peach')
    onDone()
  }

  return (
    <Modal title={`Reject ${name}?`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-ink/75">{name} will see this message in their <b>Applied</b> tab. Keep it kind!</p>
        <Field label="Message">
          <Textarea required rows={3} maxLength={300} value={message} onChange={(e) => setMessage(e.target.value)} />
        </Field>
        <div className="flex gap-2">
          <Button type="button" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button color="pink" className="flex-1" disabled={sending || !message.trim()}>{sending ? 'Sending…' : 'Reject & send'}</Button>
        </div>
      </form>
    </Modal>
  )
}
