// Pick a note from the library to attach to a post.
import { useEffect, useState } from 'react'
import { api } from '../../api/index.js'
import { BG, subjectColor } from '../../utils/colors.js'
import { cn } from '../../utils/cn.js'
import Modal from '../ui/Modal.jsx'
import SearchBox from '../ui/SearchBox.jsx'
import Spinner from '../ui/Spinner.jsx'

export default function AttachNoteModal({ onPick, onClose }) {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => api.getNotes({ search }).then(setNotes), 200)
    return () => clearTimeout(t)
  }, [search])

  return (
    <Modal title="Attach a note" onClose={onClose}>
      <SearchBox autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the notes library…" aria-label="Search notes" />
      <div className="mt-4 space-y-2">
        {!notes ? (
          <Spinner />
        ) : notes.length === 0 ? (
          <p className="font-hand text-xl text-ink/60">no notes match that</p>
        ) : (
          notes.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => onPick(n)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 border-ink bg-card p-2.5 text-left hover:bg-hl-yellow/40"
            >
              <span className={cn('h-8 w-2 shrink-0 rounded-full border-2 border-ink', BG[subjectColor(n.subject)])} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{n.title}</span>
                <span className="text-xs text-ink/60">{n.subject} · by {n.author.name}</span>
              </span>
            </button>
          ))
        )}
      </div>
    </Modal>
  )
}
