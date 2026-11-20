# 4. Components

[← Back to notes](<README.md>)

A **component** is a reusable piece of UI written as a function that returns JSX (HTML-like code).
You pass it **props** (options), like HTML attributes: `<Button color="mint">Save</Button>`.

Components that use state, effects or click handlers start with `'use client'` (they run in the browser).

---

## UI building blocks: [`components/ui/`](<../frontend/src/components/ui/>)

Use these instead of writing raw HTML + classes, so the whole app looks the same.

### [Button](<../frontend/src/components/ui/Button.tsx>)
Chunky outlined button that presses down when clicked.

| Prop | Values | Default |
|---|---|---|
| `color` | `yellow` `pink` `mint` `blue` `peach` `lilac` `ink` `card` | `card` |
| `size` | `sm` `md` `xl` | `md` |
| `href` | a path. Turns it into a link | none |
| anything else | normal `<button>` props (`onClick`, `disabled`, `type`…) | |

```jsx
<Button color="yellow" onClick={save}>Save</Button>
<Button size="sm" href="/notes">Browse notes</Button>
```

### [IconButton](<../frontend/src/components/ui/IconButton.tsx>)
Square icon-only button. `label` (required, read by screen readers + tooltip), `badge` (pink number), `href`, `small`.
```jsx
<IconButton label="Notifications" badge={3}><Bell className="h-4 w-4" /></IconButton>
```

### [Card](<../frontend/src/components/ui/Card.tsx>)
Outlined box with a hard shadow. `color` (default `card`), `as` (HTML tag, e.g. `"article"`), `className`.

### [Chip](<../frontend/src/components/ui/Chip.tsx>)
Small rounded label. `color`, `className`. `<Chip color="mint">DBMS</Chip>`

### [Avatar](<../frontend/src/components/ui/Avatar.tsx>)
Initials in a circle; colour is fixed per person. `user` (needs `id`, `name`), `size` (`xs` `sm` `md` `lg` `xl`), `online` (green dot).

### [Modal](<../frontend/src/components/ui/Modal.tsx>)
Pop-up window. `title`, `onClose`, children. Closes on **Esc** or a click outside; stops the page scrolling behind it.
```jsx
{open && <Modal title="Upload a note" onClose={() => setOpen(false)}>…</Modal>}
```

### [FormFields](<../frontend/src/components/ui/FormFields.tsx>)
`Input`, `Textarea`, `Select` (all accept normal HTML props) and `Field` (adds a label).
```jsx
<Field label="Title">
  <Input required maxLength={LIMITS.noteTitle} value={title} onChange={(e) => setTitle(e.target.value)} />
</Field>
```
Always set `maxLength` using [`LIMITS`](<../frontend/src/config.ts>) from config.

### [SearchBox](<../frontend/src/components/ui/SearchBox.tsx>)
An `Input` with a magnifying glass. Has `maxLength={LIMITS.search}` built in.

### [TabChips](<../frontend/src/components/ui/TabChips.tsx>)
Pill tabs. `tabs` = `[{ id, label, count? }]`, `value` (selected id), `onChange(id)`, `label` (for screen readers).

### [PageTitle](<../frontend/src/components/ui/PageTitle.tsx>) · [Highlight](<../frontend/src/components/ui/Highlight.tsx>)
`PageTitle`: big heading with a highlighter stroke + handwritten `subtitle`, `color`, and buttons as children.
`Highlight`: wraps any text in the tilted highlighter stroke.

### [Decorations](<../frontend/src/components/ui/Decorations.tsx>)
`<Tape className="-top-2.5 left-8 -rotate-2" />` and `<StickyNote className="-top-3 right-4">tip!</StickyNote>`.
The parent card needs `relative` so they position correctly.

### [ReactionButtons](<../frontend/src/components/ui/ReactionButtons.tsx>)
`<LikeButton kind="posts" item={post} />` and `<SaveButton kind="notes" item={note} />`.
`kind` is `posts`, `notes` or `collabs`. They update instantly, then confirm with the server (undo on failure),
and count for the streak.

### [EmptyState](<../frontend/src/components/ui/EmptyState.tsx>) · [Spinner](<../frontend/src/components/ui/Spinner.tsx>) · [FullPageLoader](<../frontend/src/components/ui/FullPageLoader.tsx>) · [ErrorMessage](<../frontend/src/components/ui/ErrorMessage.tsx>)
- `EmptyState`: `icon`, `title`, `hint`, optional buttons as children
- `Spinner`: shown while a list loads
- `FullPageLoader`: full-screen loader while the login is read
- `ErrorMessage`: friendly crash message with "Try again" (used by the error pages)

---

## Layout: [`components/layout/`](<../frontend/src/components/layout/>)

| Component | Notes |
|---|---|
| [AppShell](<../frontend/src/components/layout/AppShell.tsx>) | Wraps logged-in pages. Provides StreakProvider + UnreadProvider. Redirects to `/login` if logged out |
| [TopBar](<../frontend/src/components/layout/TopBar.tsx>) | Search form pushes `/?q=…`. `key={q}` resets the search box when the search changes |
| [LeftSidebar](<../frontend/src/components/layout/LeftSidebar.tsx>) | Visible from `lg` screens (≥1024px). Saved notes reload on every page change |
| [RightSidebar](<../frontend/src/components/layout/RightSidebar.tsx>) | Visible from `xl` screens (≥1280px). "Follow" is visual only for now |
| [MobileNav](<../frontend/src/components/layout/MobileNav.tsx>) | Visible below `lg` |
| [navLinks.ts](<../frontend/src/components/layout/navLinks.ts>) | Add a menu item here and it appears in both menus |
| [NotificationsMenu](<../frontend/src/components/layout/NotificationsMenu.tsx>) | Closes on outside click / Esc. Links are checked with `safeInternalHref` |
| [CampusBackdrop](<../frontend/src/components/layout/CampusBackdrop.tsx>) | `full` prop = photo fills the screen (login page) |
| [Logo](<../frontend/src/components/layout/Logo.tsx>) | Uses `APP_NAME` and `UNIVERSITY` from config |

---

## Feed: [`components/feed/`](<../frontend/src/components/feed/>)

- **[PostCard](<../frontend/src/components/feed/PostCard.tsx>)** (`post`): author, [RichText](<../frontend/src/components/feed/RichText.tsx>), attached note (opens NotePreviewModal),
  attached project (with JoinButton → ApplyModal), Like / Reply / Share (copies a `?focus=` link) / Save, replies + reply box.
- **[PostComposer](<../frontend/src/components/feed/PostComposer.tsx>)** (`onPosted(post)`): counter turns red after `LIMITS.post` characters.
  *Highlight* wraps the selected words in `==…==`. *Ask* marks the post as a question. *Attach note* opens
  [AttachNoteModal](<../frontend/src/components/feed/AttachNoteModal.tsx>) (`onPick(note)`, `onClose`).
- **[RichText](<../frontend/src/components/feed/RichText.tsx>)** (`text`): turns `==words==` into coloured highlights (yellow, mint, blue… in turn)
  and `#tags` into bold. It never renders HTML, so posts can't inject code.

## Notes: [`components/notes/`](<../frontend/src/components/notes/>)

- **[NoteCard](<../frontend/src/components/notes/NoteCard.tsx>)** (`note`): `id="note-<id>"` lets `?focus=` scroll to it.
- **[NotePreviewModal](<../frontend/src/components/notes/NotePreviewModal.tsx>)** (`note`, `onClose`): counts as "open a note" for the streak.
  Download opens `note.fileUrl` only if it's a real `http(s)` link; without one, it downloads a text summary.
- **[UploadNoteModal](<../frontend/src/components/notes/UploadNoteModal.tsx>)** (`subjects`, `onClose`, `onUploaded(note)`): checks type/size with
  [utils/upload.ts](<../frontend/src/utils/upload.ts>) before sending.

## Teams: [`components/teams/`](<../frontend/src/components/teams/>)

| Component | Props | Notes |
|---|---|---|
| [ProjectCard](<../frontend/src/components/teams/ProjectCard.tsx>) | `project`, `onApply` | `id="project-<id>"` for `?focus=` |
| [ProjectHeader](<../frontend/src/components/teams/ProjectHeader.tsx>) | `project`, `showDescription` | Shared by ProjectCard and MyProjectCard |
| [MyProjectCard](<../frontend/src/components/teams/MyProjectCard.tsx>) | `project`, `onAccept(app)`, `onReject(app)` | Accept disabled when `spotsLeft === 0` |
| [ApplicationCard](<../frontend/src/components/teams/ApplicationCard.tsx>) | `application` | Status: Waiting / Accepted / Not selected |
| [JoinButton](<../frontend/src/components/teams/JoinButton.tsx>) | `project`, `onApply` | Chooses the right button/status for you |
| [ApplyModal](<../frontend/src/components/teams/ApplyModal.tsx>) | `project`, `onClose`, `onApplied(app)` | Counts for the streak |
| [RejectModal](<../frontend/src/components/teams/RejectModal.tsx>) | `project`, `application`, `onClose`, `onDone` | Pre-filled kind message |
| [CreateProjectModal](<../frontend/src/components/teams/CreateProjectModal.tsx>) | `onClose`, `onCreated` | Skills split by commas, max 8, no duplicates |

## Streak & trending

- **[StreakChip](<../frontend/src/components/streak/StreakChip.tsx>)**: peach = today counts, dashed = not yet. Click → pop-up with rules.
- **[StreakCard](<../frontend/src/components/streak/StreakCard.tsx>)** → **[StreakDetails](<../frontend/src/components/streak/StreakDetails.tsx>)** (`showRules`): number, best, 7-day calendar, today's minutes bar.
- **[TrendingCard](<../frontend/src/components/trending/TrendingCard.tsx>)**: top 5; each row links to the item with `?focus=`.
