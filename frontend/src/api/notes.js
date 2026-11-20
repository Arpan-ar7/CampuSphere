import * as mock from '../mock/data.js'
import { USE_MOCK, now, request, uid, wait } from './client.js'

const withUploader = (n) => mock.withAuthor(n, 'uploaderId')

export async function getNotes({ subject = 'All', search = '' } = {}) {
  if (!USE_MOCK) return request(`/notes?subject=${encodeURIComponent(subject)}&search=${encodeURIComponent(search)}`)
  await wait()
  const q = search.toLowerCase()
  return mock.notes
    .filter((n) => subject === 'All' || n.subject === subject)
    .filter((n) => !q || [n.title, n.subject, n.summary, ...n.tags].some((s) => s.toLowerCase().includes(q)))
    .map(withUploader)
}

export async function getNote(id) {
  if (!USE_MOCK) return request(`/notes/${id}`)
  await wait(100)
  const note = mock.notes.find((n) => n.id === id)
  if (!note) throw new Error('Note not found')
  return withUploader(note)
}

// data = { title, subject, semester, summary, file }
export async function uploadNote(data) {
  if (!USE_MOCK) {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => form.append(k, v))
    return request('/notes', { method: 'POST', body: form, isForm: true })
  }
  await wait(400)
  const ext = data.file?.name.split('.').pop()?.toUpperCase() || 'PDF'
  const note = {
    id: uid('n'), title: data.title, subject: data.subject, semester: Number(data.semester), uploaderId: mock.me(),
    pages: 1, fileType: ext, downloads: 0, likes: 0, saves: 0, liked: false, saved: false, uploadedAt: now(),
    summary: data.summary || '', tags: [], preview: [],
  }
  mock.notes.unshift(note)
  return withUploader(note)
}

export const getSubjects = async () => (USE_MOCK ? mock.subjects : request('/notes/subjects'))
