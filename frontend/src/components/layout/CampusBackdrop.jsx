// Page background: campus photo at the top fading into cream paper,
// with the notebook grid drawn over everything. Stays fixed while scrolling.
// Photos come from CAMPUS_PHOTOS in src/config.js (more than one = swap every minute).
import { useEffect, useState } from 'react'
import { CAMPUS_PHOTOS } from '../../config.js'
import { cn } from '../../utils/cn.js'

export default function CampusBackdrop({ full = false }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (CAMPUS_PHOTOS.length < 2) return
    const timer = setInterval(() => setCurrent((i) => (i + 1) % CAMPUS_PHOTOS.length), 60_000)
    return () => clearInterval(timer)
  }, [])

  // full = photo fills the screen (login page); otherwise just the top part
  const height = full ? 'h-full' : 'h-[40vh] lg:h-[55vh]'

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-paper">
      {CAMPUS_PHOTOS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={cn(
            'absolute inset-x-0 top-0 w-full object-cover transition-opacity duration-[2000ms] motion-reduce:transition-none',
            height,
            i === current ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}
      {/* fade into paper so text stays readable */}
      <div className={cn('absolute inset-x-0 top-0 bg-gradient-to-b', height, full ? 'from-paper/10 via-paper/45 to-paper/95' : 'from-paper/20 via-paper/60 to-paper')} />
      {/* notebook grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--color-gridline)_1px,transparent_1px),linear-gradient(90deg,var(--color-gridline)_1px,transparent_1px)] bg-[size:28px_28px] opacity-90 mix-blend-multiply" />
    </div>
  )
}
