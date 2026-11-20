'use client'

// ─────────────────────────────────────────────────────────────
//  "Post a project" pop-up: a new project looking for teammates.
//  Opened from the Teams page. Calls onCreated() after it's saved.
// ─────────────────────────────────────────────────────────────
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { api } from '@/services'
import { LIMITS } from '@/config'
import { useStreak } from '@/context/StreakContext'
import { useToast } from '@/context/ToastContext'
import { CATEGORY_COLORS } from '@/utils/colors'
import { errorMessage } from '@/utils/errors'
import Button from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/FormFields'
import Modal from '@/components/ui/Modal'

const MAX_SKILLS = 8

interface ProjectForm {
  title: string
  description: string
  /** Comma separated, e.g. "React, Figma" */
  skills: string
  spots: number | string
  category: string
}

type FieldChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

export default function CreateProjectModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { record } = useStreak()
  const toast = useToast()
  const [form, setForm] = useState<ProjectForm>({ title: '', description: '', skills: '', spots: 2, category: 'Side project' })
  const [saving, setSaving] = useState(false)
  const set = (key: keyof ProjectForm) => (e: FieldChange) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // "React, Figma ,, Node" → ['React', 'Figma', 'Node'] (no blanks, no duplicates, max 8)
    const skillsNeeded = [...new Set(form.skills.split(',').map((s) => s.trim()).filter(Boolean))].slice(0, MAX_SKILLS)
    // Keep "people needed" between 1 and 10 even if someone types something odd
    const spots = Math.min(Math.max(Number(form.spots) || 1, 1), 10)
    try {
      await api.createProject({ ...form, title: form.title.trim(), description: form.description.trim(), spots, skillsNeeded })
      toast('Project posted, requests will show up here', 'mint')
      record('create_project') // counts for today's streak
      onCreated()
    } catch (err) {
      toast(errorMessage(err), 'pink')
      setSaving(false)
    }
  }

  return (
    <Modal title="Post a project" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Project title">
          <Input required maxLength={LIMITS.projectTitle} value={form.title} onChange={set('title')} placeholder="e.g. Campus lost & found app" />
        </Field>
        <Field label="What are you building?">
          <Textarea required rows={3} maxLength={LIMITS.projectDescription} value={form.description} onChange={set('description')} placeholder="A short pitch and what you need help with…" />
        </Field>
        <Field label="Skills needed (comma separated)">
          <Input maxLength={LIMITS.skills} value={form.skills} onChange={set('skills')} placeholder="React, Figma, Node.js" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <Select value={form.category} onChange={set('category')}>
              {Object.keys(CATEGORY_COLORS).map((c) => <option key={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="People needed">
            <Input type="number" min={1} max={10} required value={form.spots} onChange={set('spots')} />
          </Field>
        </div>
        <Button size="xl" color="mint" disabled={saving} className="w-full">{saving ? 'Posting…' : 'Post project'}</Button>
      </form>
    </Modal>
  )
}
