// A project in the Explore tab.
import Avatar from '../ui/Avatar.jsx'
import Card from '../ui/Card.jsx'
import Chip from '../ui/Chip.jsx'
import { SaveButton } from '../ui/ReactionButtons.jsx'
import JoinButton from './JoinButton.jsx'
import ProjectHeader from './ProjectHeader.jsx'

export default function ProjectCard({ project, onApply }) {
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
