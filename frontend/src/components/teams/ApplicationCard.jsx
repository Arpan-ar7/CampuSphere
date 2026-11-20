// "Applied": a project I asked to join, my note, and the owner's reply
// (green "welcome" or pink "sorry" note).
import { Link } from 'react-router-dom'
import { Check, Clock, Compass, MessageCircle, X } from 'lucide-react'
import { BG } from '../../utils/colors.js'
import { cn } from '../../utils/cn.js'
import { timeAgo } from '../../utils/time.js'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'
import Chip from '../ui/Chip.jsx'
import { Tape } from '../ui/Decorations.jsx'

const STATUS = {
  pending: { label: 'Waiting', color: 'yellow', icon: Clock },
  accepted: { label: 'Accepted', color: 'mint', icon: Check },
  rejected: { label: 'Not selected', color: 'pink', icon: X },
}

export default function ApplicationCard({ application }) {
  const { project } = application
  const owner = project.author
  const ownerFirst = owner.name.split(' ')[0]
  const status = STATUS[application.status]
  const StatusIcon = status.icon

  return (
    <Card as="article" className="flex flex-col p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to={`/u/${owner.handle}`} className="text-xs font-bold text-ink/60 hover:underline">{owner.name}'s project</Link>
          <h3 className="font-display text-lg leading-snug font-bold">{project.title}</h3>
          <p className="text-xs text-ink/60">You applied {timeAgo(application.appliedAt)}</p>
        </div>
        <Chip color={status.color} className="shrink-0"><StatusIcon className="h-3 w-3" strokeWidth={3} /> {status.label}</Chip>
      </div>

      {application.note && <p className="mt-3 text-sm text-ink/70">You wrote: “{application.note}”</p>}

      {application.status === 'pending' ? (
        <p className="mt-4 font-hand text-xl leading-tight">waiting for {ownerFirst} to reply…</p>
      ) : (
        // The owner's reply, shown like a note passed back to you
        <div className={cn('relative mt-5 rounded-xl border-2 border-ink p-3 shadow-ink', BG[status.color])}>
          <Tape className="-top-2.5 right-6 rotate-3" />
          <div className="flex items-center gap-2">
            <Avatar user={owner} size="sm" />
            <p className="text-xs font-bold">{ownerFirst} replied · {timeAgo(application.respondedAt)}</p>
          </div>
          <p className="mt-2 text-sm">{application.response}</p>
        </div>
      )}

      <div className="mt-auto flex gap-2 pt-4">
        {application.status === 'accepted' && (
          <Button size="sm" color="yellow" to="/messages"><MessageCircle className="h-4 w-4" /> Message {ownerFirst}</Button>
        )}
        {application.status === 'rejected' && (
          <Button size="sm" to="/teams?tab=explore"><Compass className="h-4 w-4" /> Find other teams</Button>
        )}
      </div>
    </Card>
  )
}
