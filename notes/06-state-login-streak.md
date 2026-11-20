# 6. State: login, streak, pop-ups, unread

[← Back to notes](<README.md>)

**State** = data that can change while the app runs (who's logged in, today's streak…).
State used by many pages lives in a **context** in [`context/`](<../frontend/src/context/>), read with a hook like `useAuth()`.

```
app/layout.tsx
└── Providers (app/providers.tsx)
    ├── ToastProvider        → useToast()      pop-up messages
    └── AuthProvider         → useAuth()       who is logged in
        └── (main)/layout.tsx → AppShell
            ├── StreakProvider  → useStreak()   daily streak (only when logged in)
            └── UnreadProvider  → useUnread()   unread-messages badge
```

---

## Login: [AuthContext.tsx](<../frontend/src/context/AuthContext.tsx>) + [utils/session.ts](<../frontend/src/utils/session.ts>)

```js
const { user, login, signup, logout } = useAuth()
```

| `user` value | Meaning | What the app shows |
|---|---|---|
| `undefined` | Still checking (server, or first instant in the browser) | Loader |
| `null` | Logged out | `/login` |
| `{ id, name, … }` | Logged in | The app |

- **On logged-in pages use `useCurrentUser()`** instead: it returns the `User` directly (never empty), because
  [AppShell](<../frontend/src/components/layout/AppShell.tsx>) only shows those pages once someone is logged in.
  ```ts
  const user = useCurrentUser() // User, no null checks needed
  ```
- The token + user are saved in the browser's **localStorage** by [session.ts](<../frontend/src/utils/session.ts>) (the only file that touches them).
- React's `useSyncExternalStore` reads them safely: the server can't see localStorage, so it says "not known yet",
  and the browser fills in the real value without errors.
- Logging in or out in **another tab** updates this tab too (the `storage` event).
- If the backend ever answers **401**, [client.ts](<../frontend/src/services/client.ts>) clears the session → you're sent to `/login`.

---

## Daily streak: [StreakContext.tsx](<../frontend/src/context/StreakContext.tsx>) + [services/streak.ts](<../frontend/src/services/streak.ts>)

```js
const { streak, activeSeconds, goalSeconds, record } = useStreak()
// streak = { current, best, todayCounted, week: [{ date, label, active, isToday }] }
```

**A day counts when the student does ANY of these** (rules in [config.ts](<../frontend/src/config.ts>) → `STREAK`):

1. **Uses the app for 5 minutes**. Every 10 seconds, if the tab is visible **and** they moved the mouse / typed / scrolled
   in the last minute, 10 seconds are added. Idle time doesn't count. Seconds are saved per day in localStorage,
   so a refresh doesn't reset them.
2. **Does an action**. Components call `record('<type>')`:

| Action | Where `record()` is called |
|---|---|
| `post` | [PostComposer](<../frontend/src/components/feed/PostComposer.tsx>) |
| `comment` | [PostCard](<../frontend/src/components/feed/PostCard.tsx>) (reply) |
| `message` | [MessagesView](<../frontend/src/app/(main)/messages/[[...chat]]/MessagesView.tsx>) |
| `upload_note` | [UploadNoteModal](<../frontend/src/components/notes/UploadNoteModal.tsx>) |
| `open_note` | [NotePreviewModal](<../frontend/src/components/notes/NotePreviewModal.tsx>) |
| `like`, `save` | [ReactionButtons](<../frontend/src/components/ui/ReactionButtons.tsx>) |
| `apply` | [ApplyModal](<../frontend/src/components/teams/ApplyModal.tsx>) |
| `create_project` | [CreateProjectModal](<../frontend/src/components/teams/CreateProjectModal.tsx>) |
| `active_5min` | StreakContext itself, when 5 minutes are reached |

- Only the **first** qualifying action each day talks to the server; after that `record()` does nothing.
- When today first counts, a toast pops up: **"🔥 12-day streak! Today counts."**
- **current** = days in a row ending today (or yesterday, if today isn't done yet). Miss a day → back to 1.
- **best** = the longest run ever.
- In mock mode, [services/streak.ts](<../frontend/src/services/streak.ts>) seeds 11 previous days so you can see it working.
  To reset it: in the browser console run `localStorage.removeItem('campusphere_streak_days')`.

Shown by: [StreakChip](<../frontend/src/components/streak/StreakChip.tsx>) (top bar), [StreakCard](<../frontend/src/components/streak/StreakCard.tsx>) (sidebar), the profile page.

---

## Pop-up messages: [ToastContext.tsx](<../frontend/src/context/ToastContext.tsx>)

```js
const toast = useToast()
toast('Saved to your notebook 📒', 'mint')   // colours: yellow (default), mint, pink, blue, peach, lilac
```
Shown bottom-right for 2.8 seconds. Use **pink** for errors.

## Unread badge: [UnreadContext.tsx](<../frontend/src/context/UnreadContext.tsx>)

```js
const { unreadMessages, refreshUnread } = useUnread()
```
Recounted on every page change; the chat page calls `refreshUnread()` after opening a chat.

---

## Page-level state

Each View keeps its own state with `useState` (e.g. the list of posts, the selected tab).
Tabs that should be shareable live **in the URL** instead (`?tab=mine`, `?q=…`, `?focus=…`) and are read with `useSearchParams()`.

Next.js 16 (Cache Components) keeps up to 3 recently visited pages **alive but hidden**, so going back is instant and keeps
your scroll/tab. Their data reloads when they become visible again. That's why `useFocusFromUrl` looks for the
*visible* copy of an element.
