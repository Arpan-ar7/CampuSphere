// ─────────────────────────────────────────────────────────────
//  Top part shared by ProjectCard and MyProjectCard:
//  category, when it was posted, spots left, title, description and the owner's avatar.
// ─────────────────────────────────────────────────────────────
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { CATEGORY_COLORS } from '@/utils/colors'
import { timeAgo } from '@/utils/time'
import Avatar from '@/components/ui/Avatar'
import Chip from '@/components/ui/Chip'
import { profileHref } from '@/utils/links'
import type { Project } from '@/types'

export default function ProjectHeader({ project, showDescription = true }: { project: Project; showDescription?: boolean }) {
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
      <Link href={profileHref(project.author.handle)} title={`Posted by ${project.author.name}`}>
        <Avatar user={project.author} size="lg" />
      </Link>
    </div>
  )
}
