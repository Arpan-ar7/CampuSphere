import { Flame } from 'lucide-react'
import Card from '../ui/Card.jsx'
import StreakDetails from './StreakDetails.jsx'

// Streak box for the sidebar (and the top of the feed on small screens)
export default function StreakCard() {
  return (
    <Card className="p-4">
      <h2 className="mb-3 flex items-center gap-1.5 font-display text-base font-bold">
        <Flame className="h-4 w-4" /> Your streak
      </h2>
      <StreakDetails />
    </Card>
  )
}
