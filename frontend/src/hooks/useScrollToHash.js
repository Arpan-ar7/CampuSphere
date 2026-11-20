import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// When the URL ends with #something (e.g. /notes#note-n3), scroll to that
// element once the page's data has loaded, and flash it so it's easy to spot.
export default function useScrollToHash(ready) {
  const { hash } = useLocation()

  useEffect(() => {
    if (!ready || !hash) return
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.animate(
      [
        { outline: '4px solid var(--color-hl-pink)', outlineOffset: '6px' },
        { outline: '4px solid transparent', outlineOffset: '6px' },
      ],
      { duration: 2200, easing: 'ease-out' },
    )
  }, [ready, hash])
}
