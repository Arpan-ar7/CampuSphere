# 9. How to add things (recipes)

[← Back to notes](<README.md>)

## Add a new page

Example: an **Events** page at `/events`.

1. Create the folder `frontend/src/app/(main)/events/` (inside `(main)` = needs login, gets the menus).
2. Add **`page.tsx`** (title + which view to show):
   ```js
   import EventsView from './EventsView'

   export const metadata = { title: 'Events' }

   export default function EventsPage() {
     return <EventsView />
   }
   ```
3. Add **`EventsView.tsx`** (the screen):
   ```jsx
   'use client'

   // ─────────────────────────────────────────────
   //  EVENTS screen (route /events): upcoming campus events.
   // ─────────────────────────────────────────────
   import PageTitle from '@/components/ui/PageTitle'

   export default function EventsView() {
     return (
       <section>
         <PageTitle title="Events" color="peach" subtitle="what's on this week" />
         {/* …your content… */}
       </section>
     )
   }
   ```
4. Add it to the menu in [navLinks.ts](<../frontend/src/components/layout/navLinks.ts>):
   ```js
   { href: '/events', label: 'Events', short: 'Events', icon: CalendarDays },
   ```
   (import `CalendarDays` from `lucide-react` at the top). It appears in both the left menu and the phone menu.
5. Add a link helper in [utils/links.ts](<../frontend/src/utils/links.ts>) if other pages link to it.

## Add a new backend call

Example: `getEvents()`.

0. Describe the data in [types/index.ts](<../frontend/src/types/index.ts>):
   ```ts
   export interface CampusEvent {
     id: string
     title: string
     date: string // ISO date
   }
   ```
1. Create [`services/events.ts`](<../frontend/src/services/>) (or add to an existing file):
   ```js
   // ─────────────────────────────────────────────
   //  Events.  GET /events
   // ─────────────────────────────────────────────
   import * as mock from '@/mock/data'
   import { USE_MOCK, request, wait } from '@/services/client'
   import type { CampusEvent } from '@/types'

   export async function getEvents(): Promise<CampusEvent[]> {
     if (!USE_MOCK) return request<CampusEvent[]>('/events') // real backend
     await wait()                              // pretend network delay
     return mock.events                        // fake data
   }
   ```
2. Add typed fake data to [mock/data.ts](<../frontend/src/mock/data.ts>): `export const events: CampusEvent[] = [ … ]`.
3. Register it in [services/index.ts](<../frontend/src/services/index.ts>):
   ```js
   import * as events from '@/services/events'
   // …
   ...events, // getEvents
   ```
4. Use it in a component:
   ```js
   const [events, setEvents] = useState<CampusEvent[] | null>(null)
   useEffect(() => {
     api.getEvents().then(setEvents).catch((err: unknown) => { toast(errorMessage(err), 'pink'); setEvents([]) })
   }, [toast])
   ```
5. Write the endpoint + data shape in [API_CONTRACT.md](<../API_CONTRACT.md>) so your friend can build it.

## Add a new component

1. Pick the folder: `components/ui/` if it's generic, otherwise `components/<feature>/`.
2. Start with the header comment (what it is, who uses it, props), then **type the props**:
   ```tsx
   interface EventCardProps {
     event: CampusEvent
     onOpen?: () => void // ? = optional
   }

   export default function EventCard({ event, onOpen }: EventCardProps) { … }
   ```
3. Use the building blocks (`Card`, `Button`, `Chip`…) and colours from `BG` in [utils/colors.ts](<../frontend/src/utils/colors.ts>).
4. Add `'use client'` at the very top **only if** it uses `useState` / `useEffect` / click handlers.
5. Add it to [02-folder-structure.md](<02-folder-structure.md>) and [04-components.md](<04-components.md>).

## Add a form field (safely)

```jsx
<Field label="Event name">
  <Input required maxLength={LIMITS.eventName} value={form.name} onChange={set('name')} />
</Field>
```
1. Add the limit to `LIMITS` in [config.ts](<../frontend/src/config.ts>).
2. `trim()` text before sending.
3. Wrap the `api` call in `try / catch`, show `toast(errorMessage(err), 'pink')`, and turn the "Saving…" state off on error.

## Make an action count for the streak

```js
const { record } = useStreak()
// after the action succeeds:
record('rsvp_event')
```
Add a description to `STREAK.actions` in [config.ts](<../frontend/src/config.ts>) so it's listed in the streak pop-up,
and tell the backend about the new `type` (API_CONTRACT.md → Streak).

## Change colours / fonts / university

| To change… | Edit |
|---|---|
| a colour or shadow | `@theme` in [globals.css](<../frontend/src/app/globals.css>) |
| a font | [app/layout.tsx](<../frontend/src/app/layout.tsx>) (next/font) + `@theme inline` in globals.css |
| university name, streak minutes, limits | [config.ts](<../frontend/src/config.ts>) |
| the background photo | [assets/](<../frontend/src/assets/>) + `CAMPUS_PHOTOS` in config.ts |

## Before you commit

```powershell
cd frontend
npm run check
```
(runs lint + a production build). Fix anything it reports.
