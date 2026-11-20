import Highlight from './Highlight.jsx'

// Big page heading with a highlighter stroke behind it, a handwritten line under it,
// and optional buttons on the right.
export default function PageTitle({ title, subtitle, color = 'yellow', children }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <Highlight color={color}>{title}</Highlight>
        </h1>
        {subtitle && <p className="font-hand text-xl text-ink/65">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}
