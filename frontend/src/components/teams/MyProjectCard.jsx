// "Posted by you": one of my projects with everyone who asked to join (Accept / Reject).
import { Link } from 'react-router-dom'
import { Check, MessageCircle, X } from 'lucide-react'
import { cn } from '../../utils/cn.js'
import { timeAgo } from '../../utils/time.js'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'
import Chip from '../ui/Chip.jsx'
import ProjectHeader from './ProjectHeader.jsx'

export default function MyProjectCard({ project, onAccept, onReject }) {
  const waiting = project.applications.filter((a) => a.status === 'pending').length

  return (
    <Card as="article" className="p-4 sm:p-5">
      <ProjectHeader project={project} showDescription={false} />

      <h4 className="mt-4 mb-2 flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase">
        Requests to join {waiting > 0 && <Chip color="pink">{waiting} waiting</Chip>}
      </h4>

      {project.applications.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-ink/40 p-4 text-center font-hand text-xl">no requests yet, share it on the feed!</p>
      ) : (
        <ul className="space-y-2.5">
          {project.applications.map((a) => (
            <li key={a.id} className={cn('rounded-xl border-2 border-ink p-3', a.status === 'pending' ? 'bg-card' : 'bg-paper')}>
              <div className="flex flex-wrap items-start gap-3">
                <Link to={`/u/${a.applicant.handle}`}><Avatar user={a.applicant} /></Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/u/${a.applicant.handle}`} className="font-bold hover:underline">{a.applicant.name}</Link>
                  <p className="text-xs text-ink/60">{a.applicant.department} · year {a.applicant.year} · applied {timeAgo(a.appliedAt)}</p>
                  {a.note && <p className="mt-1.5 text-sm">“{a.note}”</p>}
                  {a.status === 'rejected' && a.response && <p className="mt-1.5 font-hand text-lg leading-tight text-ink/60">you replied: “{a.response}”</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {a.status === 'pending' && (
                    <>
                      <Button size="sm" color="mint" onClick={() => onAccept(a)} disabled={project.spotsLeft === 0} title={project.spotsLeft === 0 ? 'Team is full' : undefined}>
                        <Check className="h-4 w-4" strokeWidth={3} /> Accept
                      </Button>
                      <Button size="sm" onClick={() => onReject(a)}>
                        <X className="h-4 w-4" strokeWidth={3} /> Reject
                      </Button>
                    </>
                  )}
                  {a.status === 'accepted' && (
                    <>
                      <Chip color="mint"><Check className="h-3 w-3" strokeWidth={3} /> Accepted</Chip>
                      <Button size="sm" to="/messages" title={`Message ${a.applicant.name}`}><MessageCircle className="h-4 w-4" /></Button>
                    </>
                  )}
                  {a.status === 'rejected' && <Chip color="pink"><X className="h-3 w-3" strokeWidth={3} /> Rejected</Chip>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
