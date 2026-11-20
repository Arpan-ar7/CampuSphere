'use client'

// ─────────────────────────────────────────────────────────────
//  "Upload a note" pop-up: file + title + subject + semester + short summary.
//  Checks the file type and size before uploading (see utils/upload.js).
//  Opened from the Notes page.
// ─────────────────────────────────────────────────────────────
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { UploadCloud } from 'lucide-react'
import { api } from '@/services'
import { LIMITS, UPLOAD } from '@/config'
import { useStreak } from '@/context/StreakContext'
import { useToast } from '@/context/ToastContext'
import { checkUploadFile } from '@/utils/upload'
import { errorMessage } from '@/utils/errors'
import Button from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/FormFields'
import Modal from '@/components/ui/Modal'
import type { Note, NoteUpload } from '@/types'

interface UploadNoteModalProps {
  /** Subject choices (without "All") */
  subjects: string[]
  onClose: () => void
  onUploaded: (note: Note) => void
}

type FieldChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

export default function UploadNoteModal({ subjects, onClose, onUploaded }: UploadNoteModalProps) {
  const { record } = useStreak()
  const toast = useToast()
  const [form, setForm] = useState<NoteUpload>({ title: '', subject: subjects[0] ?? '', semester: 1, summary: '', file: null })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const set = (key: Exclude<keyof NoteUpload, 'file'>) => (e: FieldChange) => setForm({ ...form, [key]: e.target.value })

  // Check the file as soon as it's picked, so the student knows straight away
  const pickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setError(file ? checkUploadFile(file) : '')
    setForm({ ...form, file })
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const problem = checkUploadFile(form.file)
    if (problem) return setError(problem)
    setSaving(true)
    try {
      const note = await api.uploadNote({ ...form, title: form.title.trim(), summary: form.summary.trim() })
      toast('Note uploaded, thanks for sharing! 📒', 'mint')
      record('upload_note')
      onUploaded(note)
    } catch (err) {
      setError(errorMessage(err))
      setSaving(false)
    }
  }

  return (
    <Modal title="Upload a note" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <label className="flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-ink bg-paper p-6 text-center transition hover:bg-hl-yellow/30">
          <UploadCloud className="h-8 w-8" />
          <span className="max-w-full truncate text-sm font-bold">{form.file ? form.file.name : 'Click to choose a file'}</span>
          <span className="text-xs text-ink/60">PDF, Word or images · max {UPLOAD.maxSizeMB} MB</span>
          <input type="file" accept={UPLOAD.accept} required className="sr-only" onChange={pickFile} />
        </label>

        <Field label="Title">
          <Input required maxLength={LIMITS.noteTitle} value={form.title} onChange={set('title')} placeholder="e.g. DBMS Unit 4 – Indexing" />
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
          <Textarea rows={2} maxLength={LIMITS.noteSummary} value={form.summary} onChange={set('summary')} placeholder="One or two lines so people know what they're getting" />
        </Field>

        {error && <p role="alert" className="rounded-xl border-2 border-ink bg-hl-pink px-3 py-2 text-sm font-bold">{error}</p>}

        <Button size="xl" color="yellow" disabled={saving}className="w-full">{saving ? 'Uploading…' : 'Upload'}</Button>
      </form>
    </Modal>
  )
}
