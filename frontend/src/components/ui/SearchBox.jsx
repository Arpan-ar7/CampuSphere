import { Search } from 'lucide-react'
import { cn } from '../../utils/cn.js'
import { Input } from './FormFields.jsx'

// Text box with a magnifying-glass icon
export default function SearchBox({ className, ...props }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink/50" />
      <Input type="search" className="pl-9" {...props} />
    </div>
  )
}
