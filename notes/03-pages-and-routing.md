# 3. Pages & routing

[← Back to notes](<README.md>)

## How routing works in Next.js (App Router)

- Every folder inside [`frontend/src/app/`](<../frontend/src/app/>) that has a **`page.tsx`** becomes a web address.
- **`layout.tsx`** wraps all pages below it (things that stay on screen, like menus).
- **`(main)`**: brackets around a folder name = a *route group*. Its pages share [`(main)/layout.tsx`](<../frontend/src/app/(main)/layout.tsx>)
  (the logged-in frame) but `(main)` is **not** in the URL. So `app/(main)/notes/page.tsx` is just `/notes`.
- **`[handle]`**: a *dynamic segment*. `/u/priya` fills `handle = 'priya'` (read with `useParams()`).
- **`[[...chat]]`**: an *optional catch-all*. Matches both `/messages` and `/messages/c1`.
- **`page.tsx`** is a small *server component* that sets the browser-tab title with `export const metadata`.
  The interactive screen is in **`…View.tsx`** (a *client component*, starts with `'use client'`).

```
app/layout.tsx                  ← <html>, fonts, providers (every page)
├── login/page.tsx              → /login
└── (main)/layout.tsx           ← AppShell: top bar, sidebars, phone menu, login check
    ├── page.tsx                → /
    ├── notes/page.tsx          → /notes
    ├── teams/page.tsx          → /teams
    ├── messages/[[...chat]]/  → /messages and /messages/c1
    └── u/[handle]/page.tsx     → /u/arpan
```

## What happens when someone opens a page

1. The server sends the HTML, which at first is just the "opening your notebook…" loader
   ([FullPageLoader.tsx](<../frontend/src/components/ui/FullPageLoader.tsx>)), because the login is stored **in the browser**.
2. In the browser, [AuthContext.tsx](<../frontend/src/context/AuthContext.tsx>) reads the saved login.
3. [AppShell.tsx](<../frontend/src/components/layout/AppShell.tsx>): **logged out** → goes to `/login`. **Logged in** → shows the frame + the page.
4. The View loads its data from [services](<05-data-services-and-mock.md>) and shows a spinner until it arrives.

---

## `/`: Campus Feed

**Files:** [page.tsx](<../frontend/src/app/(main)/page.tsx>) · [FeedView.tsx](<../frontend/src/app/(main)/FeedView.tsx>)

**On screen:**
- Highlighted title "The Campus Feed" + "Browse notes" / "Find teammates" buttons
- [PostComposer](<../frontend/src/components/feed/PostComposer.tsx>): write a post, attach a note, highlight words, mark as a question
- On smaller screens: [StreakCard](<../frontend/src/components/streak/StreakCard.tsx>) + [TrendingCard](<../frontend/src/components/trending/TrendingCard.tsx>) (on wide screens they're in the right sidebar)
- Filter tabs: For you · My dept · Notes · Teams · Questions · Saved
- List of [PostCard](<../frontend/src/components/feed/PostCard.tsx>)s

**URL options:** `/?q=dbms` shows search results (from the top-bar search). `/?focus=post-p1` scrolls to that post.

**Data:** `api.getFeed()` · `api.createPost()` · `api.addComment()` · `api.toggleLike/toggleSave('posts', id)`

**Counts for the streak:** posting, replying, liking, saving.

---

## `/notes`: Notes Library

**Files:** [page.tsx](<../frontend/src/app/(main)/notes/page.tsx>) · [NotesView.tsx](<../frontend/src/app/(main)/notes/NotesView.tsx>)

**On screen:** search box, subject tabs (All, DBMS, OS…), grid of [NoteCard](<../frontend/src/components/notes/NoteCard.tsx>)s,
"Upload a note" button → [UploadNoteModal](<../frontend/src/components/notes/UploadNoteModal.tsx>). "Open" → [NotePreviewModal](<../frontend/src/components/notes/NotePreviewModal.tsx>).

**URL options:** `/notes?focus=note-n3` scrolls to that note.

**Data:** `api.getSubjects()` · `api.getNotes({ subject, search })` (200 ms after you stop typing) · `api.uploadNote()`

**Counts for the streak:** uploading, opening a note, liking, saving.

---

## `/teams`: Find Teammates

**Files:** [page.tsx](<../frontend/src/app/(main)/teams/page.tsx>) · [TeamsView.tsx](<../frontend/src/app/(main)/teams/TeamsView.tsx>)

| Tab | URL | Shows |
|---|---|---|
| 🔎 Explore | `/teams` | Every project ([ProjectCard](<../frontend/src/components/teams/ProjectCard.tsx>)): search + category filter, "Request to join" → [ApplyModal](<../frontend/src/components/teams/ApplyModal.tsx>) |
| 📬 Posted by you | `/teams?tab=mine` | Your projects ([MyProjectCard](<../frontend/src/components/teams/MyProjectCard.tsx>)) + requests → Accept / Reject ([RejectModal](<../frontend/src/components/teams/RejectModal.tsx>)) |
| 📨 Applied | `/teams?tab=applied` | Projects you asked to join ([ApplicationCard](<../frontend/src/components/teams/ApplicationCard.tsx>)) + the owner's reply |

"Post a project" → [CreateProjectModal](<../frontend/src/components/teams/CreateProjectModal.tsx>).
The pink badges count requests waiting for you and replies you received.

**The join flow:**
1. A student clicks **Request to join**, writes an optional note → status **pending**.
2. The owner sees it in **Posted by you** → **Accept** (fills a spot) or **Reject** (writes a kind message).
3. The student sees the result in **Applied**: green "welcome" note or pink "sorry" note.

**Data:** `getProjects` · `getMyProjects` · `getMyApplications` · `createProject` · `applyToProject` · `respondToApplication`

---

## `/messages` and `/messages/<chatId>`: Chat

**Files:** [page.tsx](<../frontend/src/app/(main)/messages/[[...chat]]/page.tsx>) · [MessagesView.tsx](<../frontend/src/app/(main)/messages/[[...chat]]/MessagesView.tsx>)

**On screen:** conversation list (search, unread badges, online dots) + the open chat (bubbles, message box).
On phones: list first, then the chat with a back button. **Enter** sends, **Shift+Enter** adds a new line.

**Data:** `getConversations` · `getMessages` (also marks the chat read) · `sendMessage`. After opening a chat it calls
`refreshUnread()` from [UnreadContext](<../frontend/src/context/UnreadContext.tsx>) so the menu badge updates.

**Counts for the streak:** sending a message.

---

## `/u/<handle>`: Profile

**Files:** [page.tsx](<../frontend/src/app/(main)/u/[handle]/page.tsx>) · [ProfileView.tsx](<../frontend/src/app/(main)/u/[handle]/ProfileView.tsx>)

**On screen:** profile card (avatar, bio, skill chips, streak chip on your own profile), stats,
tabs **Posts / Notes / Projects / Saved** (Saved only on your own profile).

**URL options:** `/u/arpan?tab=saved` opens a tab directly.

**Data:** `api.getUser(handle)`

---

## `/login`: Log in / Sign up

**Files:** [page.tsx](<../frontend/src/app/login/page.tsx>) · [LoginView.tsx](<../frontend/src/app/login/LoginView.tsx>)

Log in or sign up with a university email. Already logged in → goes to the feed.
Demo mode: any email + password works (sign-up needs an 8+ character password).

---

## Error & not-found pages

| File | When |
|---|---|
| [not-found.tsx](<../frontend/src/app/not-found.tsx>) | The URL doesn't exist |
| [(main)/error.tsx](<../frontend/src/app/(main)/error.tsx>) | A logged-in page crashed (menus still work) |
| [error.tsx](<../frontend/src/app/error.tsx>) | Any other page crashed |
| [global-error.tsx](<../frontend/src/app/global-error.tsx>) | The root layout itself crashed |

## Building links

Never type URLs by hand in components; use the helpers in [utils/links.ts](<../frontend/src/utils/links.ts>):

```js
profileHref('priya')          // "/u/priya"
profileHref('priya', 'saved') // "/u/priya?tab=saved"
chatHref('c1')                // "/messages/c1"
teamsHref('mine')             // "/teams?tab=mine"
postHref('p1')                // "/?focus=post-p1"
noteHref('n3')                // "/notes?focus=note-n3"
projectHref('cp1')            // "/teams?focus=project-cp1"
```
