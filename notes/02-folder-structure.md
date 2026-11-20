# 2. Folder structure: every file explained

[← Back to notes](<README.md>)

Click any file name to open it. Every code file also starts with a comment box that repeats
what it does, who uses it, and what you can pass to it.

```
frontend/src/
├── app/            PAGES. The folder path = the web address
├── components/     Reusable pieces of UI, grouped by feature
│   ├── ui/             generic building blocks (Button, Card, Modal…)
│   ├── layout/         the frame: top bar, sidebars, phone menu
│   ├── feed/           posts
│   ├── notes/          notes library
│   ├── teams/          find teammates
│   ├── streak/         daily streak
│   └── trending/       top 5 trending
├── services/       Calls TO the backend (one file per feature)
├── mock/           Fake data used until the backend is ready
├── context/        App-wide state (login, streak, pop-ups, unread)
├── hooks/          Small reusable React helpers
├── utils/          Plain helper functions (no React)
├── types/          TypeScript types: the shape of all data
├── assets/         Images imported by code
└── config.ts       App settings in one place
```

**Rule of thumb for where things go**

| You are making… | Put it in… |
|---|---|
| a new screen / web address | `app/` |
| something shown on screen that's reused | `components/<feature>/` (or `components/ui/` if it's generic) |
| a call to the backend | `services/<feature>.ts` |
| state shared by many pages | `context/` |
| a helper that uses React hooks | `hooks/` |
| a helper with no React | `utils/` |
| a setting someone might want to change | `config.ts` |
| a new kind of data (or a new field) | `types/index.ts` |

---

## `app/`: pages and routing

In Next.js, **folders inside `app/` become web addresses**. A folder in brackets like `(main)` is a *group*:
it shares a layout but does **not** appear in the URL. `[handle]` means "this part of the URL is a variable".

Each page folder has two files:
- **`page.tsx`**: tiny Next.js file: sets the browser-tab title (`metadata`) and shows the View.
- **`…View.tsx`**: the actual screen (a client component, marked `'use client'`).

| File | Web address | What it's for |
|---|---|---|
| [app/layout.tsx](<../frontend/src/app/layout.tsx>) | every page | Root layout: `<html>`, fonts (next/font), title template, providers |
| [app/providers.tsx](<../frontend/src/app/providers.tsx>) | every page | Wraps the app in ToastProvider + AuthProvider |
| [app/globals.css](<../frontend/src/app/globals.css>) | every page | Tailwind + design tokens (colours, fonts, shadows, animations) |
| [app/icon.svg](<../frontend/src/app/icon.svg>) | browser tab | The favicon (Next.js picks it up automatically) |
| [app/not-found.tsx](<../frontend/src/app/not-found.tsx>) | unknown URLs | "This page isn't in the notebook" 404 page |
| [app/error.tsx](<../frontend/src/app/error.tsx>) | if a page crashes | Friendly error + "Try again" (outside the logged-in area) |
| [app/global-error.tsx](<../frontend/src/app/global-error.tsx>) | if everything crashes | Last-resort error page (own `<html>`, inline styles) |
| [app/login/page.tsx](<../frontend/src/app/login/page.tsx>) | `/login` | Title "Log in" → shows LoginView |
| [app/login/LoginView.tsx](<../frontend/src/app/login/LoginView.tsx>) | `/login` | Log in / sign up form, campus photo background |
| [app/(main)/layout.tsx](<../frontend/src/app/(main)/layout.tsx>) | all logged-in pages | Wraps pages in **AppShell** (frame + login check) |
| [app/(main)/error.tsx](<../frontend/src/app/(main)/error.tsx>) | if a logged-in page crashes | Error message, menus keep working |
| [app/(main)/page.tsx](<../frontend/src/app/(main)/page.tsx>) | `/` | Title "Campus Feed" → shows FeedView |
| [app/(main)/FeedView.tsx](<../frontend/src/app/(main)/FeedView.tsx>) | `/` | **Feed**: composer, filter tabs, posts, search results |
| [app/(main)/notes/page.tsx](<../frontend/src/app/(main)/notes/page.tsx>) | `/notes` | Title "Notes Library" → shows NotesView |
| [app/(main)/notes/NotesView.tsx](<../frontend/src/app/(main)/notes/NotesView.tsx>) | `/notes` | **Notes library**: search, subject tabs, upload |
| [app/(main)/teams/page.tsx](<../frontend/src/app/(main)/teams/page.tsx>) | `/teams` | Title "Find Teammates" → shows TeamsView |
| [app/(main)/teams/TeamsView.tsx](<../frontend/src/app/(main)/teams/TeamsView.tsx>) | `/teams` | **Teams**: Explore / Posted by you / Applied tabs |
| [app/(main)/messages/[[...chat]]/page.tsx](<../frontend/src/app/(main)/messages/[[...chat]]/page.tsx>) | `/messages`, `/messages/c1` | Title "Messages" → shows MessagesView |
| [app/(main)/messages/[[...chat]]/MessagesView.tsx](<../frontend/src/app/(main)/messages/[[...chat]]/MessagesView.tsx>) | `/messages/…` | **Chat**: conversation list + open chat |
| [app/(main)/u/[handle]/page.tsx](<../frontend/src/app/(main)/u/[handle]/page.tsx>) | `/u/arpan` | Title "Profile" → shows ProfileView |
| [app/(main)/u/[handle]/ProfileView.tsx](<../frontend/src/app/(main)/u/[handle]/ProfileView.tsx>) | `/u/…` | **Profile**: card, stats, posts / notes / projects / saved |

More detail: [Pages & routing](<03-pages-and-routing.md>).

---

## `components/layout/`: the frame around every page

| File | What it's for |
|---|---|
| [AppShell.tsx](<../frontend/src/components/layout/AppShell.tsx>) | The frame: TopBar + LeftSidebar + page + RightSidebar + MobileNav. Sends logged-out visitors to `/login` |
| [TopBar.tsx](<../frontend/src/components/layout/TopBar.tsx>) | Sticky top bar: logo, search, 🔥 streak, 🔔 notifications, messages, profile button |
| [LeftSidebar.tsx](<../frontend/src/components/layout/LeftSidebar.tsx>) | Big screens: university card, menu, "My Notebook" saved notes, tip, log out |
| [RightSidebar.tsx](<../frontend/src/components/layout/RightSidebar.tsx>) | Wide screens: Trending, Streak, People to meet, tip |
| [MobileNav.tsx](<../frontend/src/components/layout/MobileNav.tsx>) | Bottom menu on phones/tablets |
| [navLinks.ts](<../frontend/src/components/layout/navLinks.ts>) | The list of menu items + `isActiveLink()` (which one is highlighted) |
| [NotificationsMenu.tsx](<../frontend/src/components/layout/NotificationsMenu.tsx>) | The 🔔 bell and its drop-down list |
| [CampusBackdrop.tsx](<../frontend/src/components/layout/CampusBackdrop.tsx>) | Campus photo + grid-paper background (uses next/image) |
| [Logo.tsx](<../frontend/src/components/layout/Logo.tsx>) | Logo + university name |

## `components/feed/`: posts

| File | What it's for |
|---|---|
| [PostCard.tsx](<../frontend/src/components/feed/PostCard.tsx>) | One post: author, text, attached note/project, like/reply/share/save, replies |
| [PostComposer.tsx](<../frontend/src/components/feed/PostComposer.tsx>) | "What's happening?" box: attach note, highlight, ask a question, post |
| [RichText.tsx](<../frontend/src/components/feed/RichText.tsx>) | Shows `==highlighted==` words and bold `#tags` (plain text only, safe) |
| [AttachNoteModal.tsx](<../frontend/src/components/feed/AttachNoteModal.tsx>) | Pop-up to pick a note to attach to a post |

## `components/notes/`: notes library

| File | What it's for |
|---|---|
| [NoteCard.tsx](<../frontend/src/components/notes/NoteCard.tsx>) | One note card: subject strip, summary, tags, like/save, Open |
| [NotePreviewModal.tsx](<../frontend/src/components/notes/NotePreviewModal.tsx>) | Note preview pop-up with Download / Like / Save |
| [UploadNoteModal.tsx](<../frontend/src/components/notes/UploadNoteModal.tsx>) | Upload form (checks file type and size first) |

## `components/teams/`: find teammates

| File | What it's for |
|---|---|
| [ProjectCard.tsx](<../frontend/src/components/teams/ProjectCard.tsx>) | A project in Explore: details, members, Save, join button |
| [ProjectHeader.tsx](<../frontend/src/components/teams/ProjectHeader.tsx>) | Shared top of project cards: category, posted time, spots left, title, owner |
| [MyProjectCard.tsx](<../frontend/src/components/teams/MyProjectCard.tsx>) | "Posted by you": your project + requests with Accept / Reject |
| [ApplicationCard.tsx](<../frontend/src/components/teams/ApplicationCard.tsx>) | "Applied": a request you sent + the owner's reply |
| [JoinButton.tsx](<../frontend/src/components/teams/JoinButton.tsx>) | "Request to join" or your status (sent / in / not selected / full) |
| [ApplyModal.tsx](<../frontend/src/components/teams/ApplyModal.tsx>) | "Ask to join" pop-up with a short note |
| [RejectModal.tsx](<../frontend/src/components/teams/RejectModal.tsx>) | Reject with a kind (editable) message |
| [CreateProjectModal.tsx](<../frontend/src/components/teams/CreateProjectModal.tsx>) | "Post a project" form |

## `components/streak/` and `components/trending/`

| File | What it's for |
|---|---|
| [streak/StreakChip.tsx](<../frontend/src/components/streak/StreakChip.tsx>) | 🔥 counter in the top bar; click for details |
| [streak/StreakCard.tsx](<../frontend/src/components/streak/StreakCard.tsx>) | Streak box for the sidebar |
| [streak/StreakDetails.tsx](<../frontend/src/components/streak/StreakDetails.tsx>) | Big number, 7-day calendar, today's progress, rules |
| [trending/TrendingCard.tsx](<../frontend/src/components/trending/TrendingCard.tsx>) | Top 5 trending posts / notes / projects |

## `components/ui/`: generic building blocks

| File | What it's for |
|---|---|
| [Button.tsx](<../frontend/src/components/ui/Button.tsx>) | The chunky button (or link with `href`) |
| [IconButton.tsx](<../frontend/src/components/ui/IconButton.tsx>) | Square icon-only button with optional badge |
| [Card.tsx](<../frontend/src/components/ui/Card.tsx>) | Outlined box with hard shadow |
| [Chip.tsx](<../frontend/src/components/ui/Chip.tsx>) | Small rounded label |
| [Avatar.tsx](<../frontend/src/components/ui/Avatar.tsx>) | Round initials avatar (+ online dot) |
| [Modal.tsx](<../frontend/src/components/ui/Modal.tsx>) | Pop-up window (Esc / click outside to close) |
| [FormFields.tsx](<../frontend/src/components/ui/FormFields.tsx>) | `Input`, `Textarea`, `Select`, `Field` (label) |
| [SearchBox.tsx](<../frontend/src/components/ui/SearchBox.tsx>) | Input with a magnifying glass (max length built in) |
| [TabChips.tsx](<../frontend/src/components/ui/TabChips.tsx>) | Row of pill tabs |
| [PageTitle.tsx](<../frontend/src/components/ui/PageTitle.tsx>) | Big highlighted page heading + handwritten subtitle |
| [Highlight.tsx](<../frontend/src/components/ui/Highlight.tsx>) | Highlighter stroke behind text |
| [Decorations.tsx](<../frontend/src/components/ui/Decorations.tsx>) | `Tape` and `StickyNote` paper decorations |
| [ReactionButtons.tsx](<../frontend/src/components/ui/ReactionButtons.tsx>) | `LikeButton` and `SaveButton` |
| [EmptyState.tsx](<../frontend/src/components/ui/EmptyState.tsx>) | "Nothing here yet" box |
| [Spinner.tsx](<../frontend/src/components/ui/Spinner.tsx>) | Small loading spinner |
| [FullPageLoader.tsx](<../frontend/src/components/ui/FullPageLoader.tsx>) | Full-screen "opening your notebook…" loader |
| [ErrorMessage.tsx](<../frontend/src/components/ui/ErrorMessage.tsx>) | Friendly crash message used by the error pages |

More detail (options/props for each): [Components](<04-components.md>).

---

## `services/`: calls to the backend

| File | Backend endpoints | Functions |
|---|---|---|
| [index.ts](<../frontend/src/services/index.ts>) | (combines all) | exports `api` with every function below |
| [client.ts](<../frontend/src/services/client.ts>) | n/a | `request()` (token, timeout, 401 → logout, errors), `USE_MOCK` switch |
| [auth.ts](<../frontend/src/services/auth.ts>) | `/auth/login`, `/auth/signup` | `login`, `signup` |
| [posts.ts](<../frontend/src/services/posts.ts>) | `/posts`, `/posts/:id/comments` | `getFeed`, `createPost`, `addComment` |
| [reactions.ts](<../frontend/src/services/reactions.ts>) | `/:kind/:id/like`, `/:kind/:id/save` | `toggleLike`, `toggleSave` |
| [notes.ts](<../frontend/src/services/notes.ts>) | `/notes`, `/notes/:id`, `/notes/subjects` | `getNotes`, `getNote`, `uploadNote`, `getSubjects` |
| [teams.ts](<../frontend/src/services/teams.ts>) | `/collabs…` | `getProjects`, `getMyProjects`, `getMyApplications`, `createProject`, `applyToProject`, `respondToApplication` |
| [chat.ts](<../frontend/src/services/chat.ts>) | `/conversations…` | `getConversations`, `getMessages`, `sendMessage` |
| [trending.ts](<../frontend/src/services/trending.ts>) | `/trending` | `getTrending` |
| [streak.ts](<../frontend/src/services/streak.ts>) | `/streak`, `/streak/activity` | `getStreak`, `recordActivity` |
| [notifications.ts](<../frontend/src/services/notifications.ts>) | `/notifications` | `getNotifications`, `markAllNotificationsRead` |
| [users.ts](<../frontend/src/services/users.ts>) | `/users/:handle`, `/users/suggested` | `getUser`, `getSuggestedPeople` |

More detail: [Data: services & mock data](<05-data-services-and-mock.md>).

## `mock/`

| File | What it's for |
|---|---|
| [data.ts](<../frontend/src/mock/data.ts>) | All fake data: users, posts, notes, chats, projects, applications, notifications |

## `context/`: app-wide state

| File | Hook | What it's for |
|---|---|---|
| [AuthContext.tsx](<../frontend/src/context/AuthContext.tsx>) | `useAuth()`, `useCurrentUser()` | Who is logged in; `login`, `signup`, `logout`. `useCurrentUser()` returns the user on logged-in pages |
| [StreakContext.tsx](<../frontend/src/context/StreakContext.tsx>) | `useStreak()` | Daily streak + active-time tracking; `record('post')` |
| [ToastContext.tsx](<../frontend/src/context/ToastContext.tsx>) | `useToast()` | Pop-up messages in the corner |
| [UnreadContext.tsx](<../frontend/src/context/UnreadContext.tsx>) | `useUnread()` | Unread-messages badge count |

More detail: [State: login, streak, pop-ups](<06-state-login-streak.md>).

## `types/`: the shape of all data

| File | What it's for |
|---|---|
| [index.ts](<../frontend/src/types/index.ts>) | Every data type: `User`, `Post`, `Note`, `Project`, `Application`, `Conversation`, `Message`, `TrendingItem`, `Streak`, `AppNotification`… They match [API_CONTRACT.md](<../API_CONTRACT.md>) exactly |

Import them with `import type { Post } from '@/types'`.

## `hooks/`

| File | What it's for |
|---|---|
| [useFocusFromUrl.ts](<../frontend/src/hooks/useFocusFromUrl.ts>) | `?focus=note-n3` → scroll to that item and flash it |

## `utils/`: plain helpers

| File | What it's for |
|---|---|
| [cn.ts](<../frontend/src/utils/cn.ts>) | Join CSS class names, skipping empty ones |
| [colors.ts](<../frontend/src/utils/colors.ts>) | Colour class names; colour for a person / subject / category |
| [time.ts](<../frontend/src/utils/time.ts>) | `timeAgo()` ("5m ago"), `dayKey()`, `daysAgo()` |
| [links.ts](<../frontend/src/utils/links.ts>) | **Every in-app link** (`profileHref`, `noteHref`…) + `safeInternalHref` / `safeExternalUrl` (security) |
| [session.ts](<../frontend/src/utils/session.ts>) | Reads/writes the saved login (token + user) |
| [errors.ts](<../frontend/src/utils/errors.ts>) | `errorMessage(err)`: turns any caught error into a short readable message |
| [upload.ts](<../frontend/src/utils/upload.ts>) | `checkUploadFile()`: right file type and size? |

## Other

| File | What it's for |
|---|---|
| [config.ts](<../frontend/src/config.ts>) | App name, university, streak rules, text limits, upload rules, campus photos |
| [assets/campus.webp](<../frontend/src/assets/campus.webp>) | The Marwadi University campus photo |
| [../API_CONTRACT.md](<../API_CONTRACT.md>) | The agreement with the backend: every endpoint and data shape |
