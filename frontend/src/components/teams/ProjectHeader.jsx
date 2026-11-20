// Top part shared by project cards: category, when it was posted, spots left, title, owner.
import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { CATEGORY_COLORS } from '../../utils/colors.js'
import { timeAgo } from '../../utils/time.js'
import Avatar from '../ui/Avatar.jsx'
import Chip from '../ui/Chip.jsx'

export default function ProjectHeader({ project, showDescription = true }) {
  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip color={CATEGORY_COLORS[project.category] || 'yellow'}>{project.category}</Chip>
          <Chip color="lilac"><Clock className="h-3 w-3" /> posted {timeAgo(project.createdAt)}</Chip>
          <Chip color={project.spotsLeft > 0 ? 'card' : 'pink'}>
            {project.spotsLeft > 0 ? `${project.spotsLeft} of ${project.spots} spots left` : 'team full'}
          </Chip>
        </div>
        <h3 className="mt-2 font-display text-xl leading-tight font-bold">{project.title}</h3>
        {showDescription && <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{project.description}</p>}
      </div>
      <Link to={`/u/${project.author.handle}`} title={`Posted by ${project.author.name}`}>
        <Avatar user={project.author} size="lg" />
      </Link>
    </div>
  )
}
