// The join button on a project. Shows "Request to join", or your status if you already asked.
import { Check, Clock, Inbox, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'

export default function JoinButton({ project, onApply }) {
  const { user } = useAuth()
  const status = project.myApplication?.status

  if (project.author.id === user.id)
    return <Button size="sm" to="/teams?tab=mine"><Inbox className="h-4 w-4" /> Your project · see requests</Button>
  if (status === 'pending') return <Chip color="yellow" className="px-2.5 py-1 text-xs"><Clock className="h-3.5 w-3.5" /> Request sent</Chip>
  if (status === 'accepted') return <Chip color="mint" className="px-2.5 py-1 text-xs"><Check className="h-3.5 w-3.5" strokeWidth={3} /> You're in</Chip>
  if (status === 'rejected') return <Chip color="pink" className="px-2.5 py-1 text-xs"><X className="h-3.5 w-3.5" strokeWidth={3} /> Not selected</Chip>
  if (project.spotsLeft === 0) return <Chip className="px-2.5 py-1 text-xs">Team full</Chip>
  return <Button size="sm" color="yellow" onClick={onApply}>Request to join</Button>
}
