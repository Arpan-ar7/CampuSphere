// Upload a note: file + title + subject + semester + short summary.
import { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { api } from '../../api/index.js'
import { useStreak } from '../../context/StreakContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import Button from '../ui/Button.jsx'
import { Field, Input, Select, Textarea } from '../ui/FormFields.jsx'
import Modal from '../ui/Modal.jsx'

export default function UploadNoteModal({ subjects, onClose, onUploaded }) {
  const { record } = useStreak()
  const toast = useToast()
  const [form, setForm] = useState({ title: '', subject: subjects[0] || '', semester: 1, summary: '', file: null })
  const [saving, setSaving] = useState(false)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const note = await api.uploadNote(form)
    toast('Note uploaded, thanks for sharing! 📒', 'mint')
    record('upload_note')
    onUploaded(note)
  }

  return (
    <Modal title="Upload a note" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <label className="flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-ink bg-paper p-6 text-center transition hover:bg-hl-yellow/30">
          <UploadCloud className="h-8 w-8" />
          <span className="text-sm font-bold">{form.file ? form.file.name : 'Click to choose a file'}</span>
          <span className="text-xs text-ink/60">PDF, DOCX or images · max 20 MB</span>
          <input type="file" accept=".pdf,.doc,.docx,image/*" required className="hidden" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
        </label>

        <Field label="Title">
          <Input required value={form.title} onChange={set('title')} placeholder="e.g. DBMS Unit 4 – Indexing" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Subject">
            <Select value={form.subject} onChange={set('subject')}>
              {subjects.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="Semester">
            <Select value={form.semester} onChange={set('semester')}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>Sem {n}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="What's inside? (optional)">
          <Textarea rows={2} maxLength={200} value={form.summary} onChange={set('summary')} placeholder="One or two lines so people know what they're getting" />
        </Field>

        <Button size="xl" color="yellow" disabled={saving} className="w-full">{saving ? 'Uploading…' : 'Upload'}</Button>
      </form>
    </Modal>
  )
}
