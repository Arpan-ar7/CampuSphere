'use client'

// ─────────────────────────────────────────────────────────────
//  One note in the library: coloured subject strip, summary, tags, stats, Like/Save, Open.
//  Used by: NotesView, ProfileView. "Open" shows NotePreviewModal.
// ─────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { BG, subjectColor } from '@/utils/colors'
import { cn } from '@/utils/cn'
import { timeAgo } from '@/utils/time'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Chip from '@/components/ui/Chip'
import { LikeButton, SaveButton } from '@/components/ui/ReactionButtons'
import NotePreviewModal from '@/components/notes/NotePreviewModal'
import type { Note } from '@/types'

export default function NoteCard({ note }: { note: Note }) {
  const [open, setOpen] = useState(false)
  const color = subjectColor(note.subject)

  return (
    <Card as="article" id={`note-${note.id}`} className="relative flex scroll-mt-28 flex-col overflow-hidden p-4">
      <div className={cn('absolute inset-x-0 top-0 h-2.5 border-b-2 border-ink', BG[color])} />

      <div className="mt-1.5 flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <Chip color="paper">{note.subject} · Sem {note.semester}</Chip>
          <h3 className="mt-2 font-display text-lg leading-tight font-bold">{note.title}</h3>
        </div>
        <SaveButton kind="notes" item={note} small showLabel={false} />
      </div>

      {note.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/80">{note.summary}</p>}
      {note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {note.tags.map((t) => <Chip key={t} color={color}>#{t}</Chip>)}
        </div>
      )}

      <div className="mt-auto pt-4">
        <div className="flex items-center gap-2 border-t-2 border-dashed border-gridline pt-3">
          <Avatar user={note.author} size="xs" className="h-7 w-7" />
          <span className="min-w-0 flex-1 truncate text-xs text-ink/65">{note.author.name} · posted {timeAgo(note.uploadedAt)}</span>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-ink/70">
          <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {note.pages} pp</span>
          <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" /> {note.downloads.toLocaleString()}</span>
          <LikeButton kind="notes" item={note} small />
          <Button size="sm" color="yellow" className="ml-auto" onClick={() => setOpen(true)}>Open</Button>
        </div>
      </div>

      {open && <NotePreviewModal note={note} onClose={() => setOpen(false)} />}
    </Card>
  )
}
