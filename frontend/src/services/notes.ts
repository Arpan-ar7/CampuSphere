// ─────────────────────────────────────────────────────────────
//  Notes library: list/search notes, one note, upload a note, list subjects.
//  GET /notes, GET /notes/:id, POST /notes (file upload), GET /notes/subjects
// ─────────────────────────────────────────────────────────────
import * as mock from '@/mock/data'
import type { RawNote } from '@/mock/data'
import { USE_MOCK, now, request, uid, wait } from '@/services/client'
import type { Note, NoteUpload } from '@/types'

/** Mock: raw note (uploaderId) → full Note (author object) */
const toNote = (n: RawNote): Note => mock.withAuthor(n, 'uploaderId')

export async function getNotes({ subject = 'All', search = '' }: { subject?: string; search?: string } = {}): Promise<Note[]> {
  if (!USE_MOCK) return request<Note[]>(`/notes?subject=${encodeURIComponent(subject)}&search=${encodeURIComponent(search)}`)
  await wait()
  const q = search.toLowerCase()
  return mock.notes
    .filter((n) => subject === 'All' || n.subject === subject)
    .filter((n) => !q || [n.title, n.subject, n.summary, ...n.tags].some((s) => s.toLowerCase().includes(q)))
    .map(toNote)
}

export async function getNote(id: string): Promise<Note> {
  if (!USE_MOCK) return request<Note>(`/notes/${encodeURIComponent(id)}`)
  await wait(100)
  const note = mock.notes.find((n) => n.id === id)
  if (!note) throw new Error('Note not found')
  return toNote(note)
}

export async function uploadNote(data: NoteUpload): Promise<Note> {
  if (!USE_MOCK) {
    // Files are sent as multipart/form-data
    const form = new FormData()
    form.append('title', data.title)
    form.append('subject', data.subject)
    form.append('semester', String(data.semester))
    form.append('summary', data.summary)
    if (data.file) form.append('file', data.file)
    return request<Note>('/notes', { method: 'POST', body: form, isForm: true })
  }
  await wait(400)
  const ext = data.file?.name.split('.').pop()?.toUpperCase() || 'PDF'
  const note: RawNote = {
    id: uid('n'), title: data.title, subject: data.subject, semester: Number(data.semester), uploaderId: mock.me(),
    pages: 1, fileType: ext, downloads: 0, likes: 0, saves: 0, liked: false, saved: false, uploadedAt: now(),
    summary: data.summary || '', tags: [], preview: [],
  }
  mock.notes.unshift(note)
  return toNote(note)
}

export async function getSubjects(): Promise<string[]> {
  return USE_MOCK ? mock.subjects : request<string[]>('/notes/subjects')
}
