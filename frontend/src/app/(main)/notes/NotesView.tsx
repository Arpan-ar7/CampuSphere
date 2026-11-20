'use client'

// ─────────────────────────────────────────────────────────────
//  NOTES LIBRARY screen (route /notes): search, filter by subject, open, upload.
//  URL option: ?focus=note-n3 scrolls to that note.
//  Data: api.getNotes(), api.getSubjects() → services/notes.js
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { SearchX, Upload } from 'lucide-react'
import { api } from '@/services'
import { errorMessage } from '@/utils/errors'
import { useToast } from '@/context/ToastContext'
import useFocusFromUrl from '@/hooks/useFocusFromUrl'
import NoteCard from '@/components/notes/NoteCard'
import UploadNoteModal from '@/components/notes/UploadNoteModal'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import PageTitle from '@/components/ui/PageTitle'
import SearchBox from '@/components/ui/SearchBox'
import Spinner from '@/components/ui/Spinner'
import TabChips from '@/components/ui/TabChips'
import type { Note } from '@/types'

export default function NotesView() {
  const toast = useToast()
  const [notes, setNotes] = useState<Note[] | null>(null)
  const [subjects, setSubjects] = useState<string[]>([])
  const [subject, setSubject] = useState('All')
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)

  // Subject tabs (falls back to just "All" if the server fails)
  useEffect(() => {
    api
      .getSubjects()
      .then(setSubjects)
      .catch(() => setSubjects(['All']))
  }, [])

  // Re-fetch when the subject or search changes.
  // The 200 ms delay means we don't call the server on every single keystroke.
  useEffect(() => {
    const load = () =>
      api
        .getNotes({ subject, search })
        .then(setNotes)
        .catch((err) => {
          toast(errorMessage(err), 'pink')
          setNotes([]) // stop the spinner
        })
    const timer = setTimeout(load, 200)
    return () => clearTimeout(timer)
  }, [subject, search, toast])

  // Links like /notes?focus=note-n3 (from Trending) scroll to that note
  useFocusFromUrl(!!notes)

  return (
    <section>
      <PageTitle title="Notes Library" color="mint" subtitle="hand-written, shared by your batch">
        <Button color="yellow" onClick={() => setUploading(true)}><Upload className="h-4 w-4" /> Upload a note</Button>
      </PageTitle>

      <Card className="mb-4 flex flex-wrap items-center gap-3 p-3">
        <SearchBox className="min-w-[14rem] flex-1" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes, subjects, tags…" aria-label="Search notes" />
        <TabChips label="Subjects" tabs={subjects.map((s) => ({ id: s, label: s }))} value={subject} onChange={setSubject} />
      </Card>

      {!notes ? (
        <Spinner />
      ) : notes.length === 0 ? (
        <EmptyState icon={SearchX} title="No notes match that" hint="try another subject, or upload the first one" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((n) => <NoteCard key={n.id} note={n} />)}
        </div>
      )}

      {uploading && (
        <UploadNoteModal
          subjects={subjects.filter((s) => s !== 'All')}
          onClose={() => setUploading(false)}
          onUploaded={(note) => {
            setNotes((list) => [note, ...(list || [])])
            setUploading(false)
          }}
        />
      )}
    </section>
  )
}
