// Post a new project looking for teammates.
import { useState } from 'react'
import { api } from '../../api/index.js'
import { useStreak } from '../../context/StreakContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { CATEGORY_COLORS } from '../../utils/colors.js'
import Button from '../ui/Button.jsx'
import { Field, Input, Select, Textarea } from '../ui/FormFields.jsx'
import Modal from '../ui/Modal.jsx'

export default function CreateProjectModal({ onClose, onCreated }) {
  const { record } = useStreak()
  const toast = useToast()
  const [form, setForm] = useState({ title: '', description: '', skills: '', spots: 2, category: 'Side project' })
  const [saving, setSaving] = useState(false)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const skillsNeeded = form.skills.split(',').map((s) => s.trim()).filter(Boolean)
    await api.createProject({ ...form, skillsNeeded })
    toast('Project posted, requests will show up here', 'mint')
    record('create_project')
    onCreated()
  }

  return (
    <Modal title="Post a project" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Project title">
          <Input required value={form.title} onChange={set('title')} placeholder="e.g. Campus lost & found app" />
        </Field>
        <Field label="What are you building?">
          <Textarea required rows={3} value={form.description} onChange={set('description')} placeholder="A short pitch and what you need help with…" />
        </Field>
        <Field label="Skills needed (comma separated)">
          <Input value={form.skills} onChange={set('skills')} placeholder="React, Figma, Node.js" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <Select value={form.category} onChange={set('category')}>
              {Object.keys(CATEGORY_COLORS).map((c) => <option key={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="People needed">
            <Input type="number" min={1} max={10} value={form.spots} onChange={set('spots')} />
          </Field>
        </div>
        <Button size="xl" color="mint" disabled={saving} className="w-full">{saving ? 'Posting…' : 'Post project'}</Button>
      </form>
    </Modal>
  )
}
