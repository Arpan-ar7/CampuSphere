'use client'

// ─────────────────────────────────────────────────────────────
//  One project in the Teams → Explore tab (and on profiles).
//  Shows category, posted time, spots left, skills needed, members, Save + JoinButton.
// ─────────────────────────────────────────────────────────────
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import Chip from '@/components/ui/Chip'
import { SaveButton } from '@/components/ui/ReactionButtons'
import JoinButton from '@/components/teams/JoinButton'
import ProjectHeader from '@/components/teams/ProjectHeader'
import type { Project } from '@/types'

export default function ProjectCard({ project, onApply }: { project: Project; onApply?: () => void }) {
  return (
    <Card as="article" id={`project-${project.id}`} className="scroll-mt-28 p-4 sm:p-5">
      <ProjectHeader project={project} />

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.skillsNeeded.map((s) => <Chip key={s} color="peach">needs {s}</Chip>)}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t-2 border-dashed border-gridline pt-3">
        <div className="flex -space-x-2" title={project.members.map((m) => m.name).join(', ')}>
          {project.members.map((m) => <Avatar key={m.id} user={m} size="sm" />)}
        </div>
        <span className="text-xs font-bold">{project.applicantsCount} applied</span>
        <div className="ml-auto flex items-center gap-2">
          <SaveButton kind="collabs" item={project} />
          <JoinButton project={project} onApply={onApply} />
        </div>
      </div>
    </Card>
  )
}
