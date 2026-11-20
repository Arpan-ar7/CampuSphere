# 7. Styling & design: "Campus Notebook"

[← Back to notes](<README.md>)

## The look

Inspired by a student's notebook (style: *soft neo-brutalism*):
- cream **grid paper** background + the campus photo at the top
- cards with **2px ink outlines** and **hard shadows** (no blur)
- **highlighter colours** for tags, tabs and highlighted words
- headings with a **tilted highlighter stroke** behind them
- three fonts: **Bricolage Grotesque** (headings), **DM Sans** (text), **Caveat** (handwritten notes)

## How styling works

All styling uses **Tailwind CSS** classes written directly on elements:
```jsx
<div className="rounded-2xl border-2 border-ink bg-card p-4 shadow-ink-lg">…</div>
```
There are no separate CSS files per component. The only CSS file is
[app/globals.css](<../frontend/src/app/globals.css>), which holds the **design tokens**.

## Design tokens: change them in one place

In [globals.css](<../frontend/src/app/globals.css>) → `@theme`:

| Token | Tailwind classes | Value |
|---|---|---|
| `--color-ink` | `text-ink`, `border-ink`, `bg-ink` | #1d1b16 (almost black) |
| `--color-paper` | `bg-paper` | #fbf7ee (cream page) |
| `--color-card` | `bg-card` | #fffdf7 (card white) |
| `--color-gridline` | used by the grid background | #ebe4d3 |
| `--color-hl-yellow` … `--color-hl-lilac` | `bg-hl-yellow`, `bg-hl-pink`, `bg-hl-mint`, `bg-hl-blue`, `bg-hl-peach`, `bg-hl-lilac` | highlighter colours |
| `--shadow-ink-sm` / `--shadow-ink` / `--shadow-ink-lg` | `shadow-ink-sm`, `shadow-ink`, `shadow-ink-lg` | 2px / 3px / 4px hard shadows |
| `--font-display` / `--font-sans` / `--font-hand` | `font-display`, `font-sans`, `font-hand` | the three fonts |
| `--animate-pop`, `--animate-fade-up` | `animate-pop`, `animate-fade-up` | small animations |

Fonts are loaded in [app/layout.tsx](<../frontend/src/app/layout.tsx>) with **next/font** (downloaded at build time, no flicker).

## Colours in code: [utils/colors.ts](<../frontend/src/utils/colors.ts>)

Tailwind only includes classes it can **see written in full** in the code, so colour classes come from one map:
```js
import { BG } from '@/utils/colors'
BG.mint            // 'bg-hl-mint'
colorFor(user.id)  // a person always gets the same colour
subjectColor('DBMS')        // 'yellow'
CATEGORY_COLORS.Hackathon   // 'pink'
```
✅ `BG[color]` ❌ `` `bg-hl-${color}` `` (Tailwind can't see this, so the colour won't appear).

Join classes conditionally with [`cn()`](<../frontend/src/utils/cn.ts>):
```js
cn('rounded-xl border-2', isActive && 'bg-hl-yellow')
```

## Responsive (phones → big screens)

Tailwind prefixes apply from a screen width upward: `sm` ≥640px, `md` ≥768px, `lg` ≥1024px, `xl` ≥1280px.

| Screen | Layout |
|---|---|
| Phone | Top bar + search row, page, bottom menu ([MobileNav](<../frontend/src/components/layout/MobileNav.tsx>)) |
| `lg` | Left sidebar appears, bottom menu hides |
| `xl` | Right sidebar appears (Trending + Streak move there from the feed) |

## Background photo

[CampusBackdrop.tsx](<../frontend/src/components/layout/CampusBackdrop.tsx>) shows the photos listed in
[config.ts](<../frontend/src/config.ts>) → `CAMPUS_PHOTOS` using **next/image** (auto-resized, blurred preview).
To add a photo: put it in [`src/assets/`](<../frontend/src/assets/>), import it in config.ts, add it to the list.
With more than one, they crossfade every minute.

## Accessibility (usable by everyone)

- Every icon-only button has a `label` (read by screen readers).
- Keyboard focus shows a blue outline (`:focus-visible` in globals.css).
- People with "reduce motion" turned on get no animations.
- Pop-ups close with **Esc**; tabs use `role="tab"` + `aria-selected`.
