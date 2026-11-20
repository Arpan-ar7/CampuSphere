'use client'

// ─────────────────────────────────────────────────────────────
//  Links like /notes?focus=note-n3 (from Trending, notifications, shared links)
//  scroll to that item once the page's data has loaded, and flash it pink.
//  Use: useFocusFromUrl(dataIsLoaded)
// ─────────────────────────────────────────────────────────────
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function useFocusFromUrl(ready: boolean): void {
  const focus = useSearchParams().get('focus')

  useEffect(() => {
    if (!ready || !focus) return
    // Next.js keeps recently visited pages hidden in the background,
    // so pick the copy that is actually visible.
    const el = [...document.querySelectorAll(`[id="${CSS.escape(focus)}"]`)].find((node): node is HTMLElement => node instanceof HTMLElement && node.offsetParent !== null)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.animate(
      [
        { outline: '4px solid var(--color-hl-pink)', outlineOffset: '6px' },
        { outline: '4px solid transparent', outlineOffset: '6px' },
      ],
      { duration: 2200, easing: 'ease-out' },
    )
  }, [ready, focus])
}
