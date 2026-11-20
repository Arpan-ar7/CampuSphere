// Pop-up with a note's summary and contents, plus Download / Like / Save.
import { useEffect } from 'react'
import { Download, Notebook } from 'lucide-react'
import { useStreak } from '../../context/StreakContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { BG, subjectColor } from '../../utils/colors.js'
import { cn } from '../../utils/cn.js'
import { timeAgo } from '../../utils/time.js'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import Modal from '../ui/Modal.jsx'
import { LikeButton, SaveButton } from '../ui/ReactionButtons.jsx'

// Until the backend gives a real file URL, download a small text summary instead
function downloadNote(note) {
  if (note.fileUrl) {
    window.open(note.fileUrl, '_blank', 'noopener')
    return
  }
  const text = [note.title, `${note.subject} · Sem ${note.semester} · by ${note.author.name}`, '', note.summary, '', ...note.preview.map((p, i) => `${i + 1}. ${p}`)].join('\n')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
  link.download = `${note.title.replace(/[^\w]+/g, '-')}.txt`
  link.click()
  URL.revokeObjectURL(link.href)
}

export default function NotePreviewModal({ note, onClose }) {
  const { record } = useStreak()
  const toast = useToast()

  // Opening a note counts for the streak ("browse anything")
  useEffect(() => {
    record('open_note')
  }, [record])

  const onDownload = () => {
    downloadNote(note)
    toast(`Downloaded ${note.title}`, 'mint')
  }

  return (
    <Modal title="Note preview" onClose={onClose}>
      <div className="flex items-start gap-3">
        <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-ink', BG[subjectColor(note.subject)])}>
          <Notebook className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <Chip>{note.subject} · Sem {note.semester}</Chip>
          <h3 className="mt-2 font-display text-xl leading-tight font-bold">{note.title}</h3>
          <p className="text-sm text-ink/65">by {note.author.name} · posted {timeAgo(note.uploadedAt)} · {note.pages} pages · {note.fileType}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border-2 border-ink bg-paper p-4">
        {note.summary && <p className="text-sm leading-relaxed">{note.summary}</p>}
        {note.preview.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {note.preview.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 border-ink bg-hl-yellow" />
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button color="mint" onClick={onDownload}>
          <Download className="h-4 w-4" /> Download
        </Button>
        <LikeButton kind="notes" item={note} />
        <SaveButton kind="notes" item={note} />
        <Button size="sm" className="ml-auto" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  )
}
