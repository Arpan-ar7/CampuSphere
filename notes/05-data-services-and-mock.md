# 5. Data: services & mock data

[← Back to notes](<README.md>)

## The big picture

```
 Page / component            services/                      backend (friend's project)
 ────────────────            ─────────                      ─────────────────────────
 api.getFeed()  ───────────▶ posts.ts → getFeed()
                              │ USE_MOCK = true?  ──▶ mock/data.ts (fake data, no server)
                              │ USE_MOCK = false? ──▶ client.ts request('/posts') ──▶ GET /api/posts
```

- Components **never** call `fetch` themselves. They call `api.something()` from [services/index.ts](<../frontend/src/services/index.ts>).
- Each feature has one file in [`services/`](<../frontend/src/services/>). Every function has **two branches**:
  the real backend call (`request(...)`), and the mock version (reads/changes [mock/data.ts](<../frontend/src/mock/data.ts>)).
- The full list of endpoints and data shapes is the **contract** with the backend: [API_CONTRACT.md](<../API_CONTRACT.md>).

## [client.ts](<../frontend/src/services/client.ts>): the request helper

`request(path, { method, body, isForm })` does the real HTTP call and:

| What | Why |
|---|---|
| Adds `Authorization: Bearer <token>` | The backend knows who is asking |
| Stops after **15 seconds** | No endless spinners if the server hangs |
| On **401** → clears the login and sends you to `/login` | Expired/invalid token |
| Short, friendly error messages | Never shows raw server errors to students |
| Sends JSON (or `FormData` for file uploads) | |

It also exports `USE_MOCK` (from `.env.local`) and small mock helpers (`wait`, `uid`, `now`, `newestFirst`).

## Every service file

| File | Functions | Notes |
|---|---|---|
| [auth.ts](<../frontend/src/services/auth.ts>) | `login(email, password)`, `signup(data)` | Returns `{ token, user }` |
| [posts.ts](<../frontend/src/services/posts.ts>) | `getFeed()`, `createPost({ content, type, noteId })`, `addComment(postId, text)` | Adds author, comments, attached note/project |
| [reactions.ts](<../frontend/src/services/reactions.ts>) | `toggleLike(kind, id)`, `toggleSave(kind, id)` | `kind`: `posts` · `notes` · `collabs` |
| [notes.ts](<../frontend/src/services/notes.ts>) | `getNotes({ subject, search })`, `getNote(id)`, `uploadNote(data)`, `getSubjects()` | Upload is `multipart/form-data` |
| [teams.ts](<../frontend/src/services/teams.ts>) | `getProjects()`, `getProject(id)`, `getMyProjects()`, `getMyApplications()`, `createProject()`, `applyToProject(id, note)`, `respondToApplication(projectId, appId, status, response)` | `toProject()` adds `spotsLeft`, `members`, `myApplication` |
| [chat.ts](<../frontend/src/services/chat.ts>) | `getConversations()`, `getMessages(id)`, `sendMessage(id, text)` | Opening a chat marks it read |
| [trending.ts](<../frontend/src/services/trending.ts>) | `getTrending()` | score = likes + replies + saves (+ applicants) |
| [streak.ts](<../frontend/src/services/streak.ts>) | `getStreak()`, `recordActivity(type)` | Mock keeps days in localStorage |
| [notifications.ts](<../frontend/src/services/notifications.ts>) | `getNotifications()`, `markAllNotificationsRead()` | Mock builds them from teams activity |
| [users.ts](<../frontend/src/services/users.ts>) | `getUser(handle)`, `getSuggestedPeople()` | Profile data incl. saved notes |

## [mock/data.ts](<../frontend/src/mock/data.ts>): the fake data

| Export | What |
|---|---|
| `currentUser`, `users` | The logged-in student (Arpan) and 5 classmates |
| `posts` | Feed posts (with `==highlights==`, attached notes/projects, replies) |
| `subjects`, `notes` | Notes library |
| `conversations`, `messages` | Chats |
| `collabPosts`, `applications` | Team projects and requests to join (pending / accepted / rejected) |
| `extraNotifications`, `notificationState` | Extra bell notifications + "read" time |
| `userById()`, `me()`, `withAuthor()` | Small helpers used by the services |

Mock data lives **in memory**: changes (new posts, likes…) reset when you refresh the page.
Only the streak and the login survive a refresh (they're in localStorage).

## Switching to the real backend

1. Your friend's backend implements the endpoints in [API_CONTRACT.md](<../API_CONTRACT.md>) and allows CORS from `http://localhost:3000`.
2. Create `frontend/.env.local` (copy [.env.example](<../frontend/.env.example>)):
   ```
   NEXT_PUBLIC_USE_MOCK=false
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
3. Restart `npm run dev`. Nothing else changes: the same pages now call the real server.

The backend URL is also allowed in the security policy automatically ([next.config.ts](<../frontend/next.config.ts>) reads `NEXT_PUBLIC_API_URL`).

## Adding a new backend call

See [How to add things → a new API call](<09-how-to-add-things.md#add-a-new-backend-call>).
