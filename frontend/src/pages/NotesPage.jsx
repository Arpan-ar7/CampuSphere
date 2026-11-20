// Notes Library: search, filter by subject, open, upload.
import { useEffect, useState } from 'react'
import { SearchX, Upload } from 'lucide-react'
import { api } from '../api/index.js'
import useScrollToHash from '../hooks/useScrollToHash.js'
import NoteCard from '../components/notes/NoteCard.jsx'
import UploadNoteModal from '../components/notes/UploadNoteModal.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import PageTitle from '../components/ui/PageTitle.jsx'
import SearchBox from '../components/ui/SearchBox.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import TabChips from '../components/ui/TabChips.jsx'

export default function NotesPage() {
  const [notes, setNotes] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [subject, setSubject] = useState('All')
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    api.getSubjects().then(setSubjects)
  }, [])

  // Re-fetch when filters change (small delay so we don't call on every keystroke)
  useEffect(() => {
    const t = setTimeout(() => api.getNotes({ subject, search }).then(setNotes), 200)
    return () => clearTimeout(t)
  }, [subject, search])

  // Links like /notes#note-n3 (from Trending) scroll to that note
  useScrollToHash(!!notes)

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
