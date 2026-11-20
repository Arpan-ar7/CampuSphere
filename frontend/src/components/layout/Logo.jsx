import { Link } from 'react-router-dom'
import { NotebookPen } from 'lucide-react'
import { APP_NAME, UNIVERSITY } from '../../config.js'

export default function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${APP_NAME} home`}>
      <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-hl-yellow shadow-ink">
        <NotebookPen className="h-5 w-5" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[1.15rem] font-extrabold tracking-tight sm:text-xl">{APP_NAME}</span>
        <span className="hidden font-hand text-[1.05rem] text-ink/70 lowercase sm:block">{UNIVERSITY.name}</span>
      </span>
    </Link>
  )
}
