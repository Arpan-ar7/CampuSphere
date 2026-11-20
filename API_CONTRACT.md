# CampuSphere – API contract (frontend ↔ backend)

The frontend talks to the backend **only** through `frontend/src/api/` (one file per feature).
Right now it uses fake data from `frontend/src/mock/data.js`. To switch to the real backend, create `frontend/.env`:

```
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5000/api
```

All requests send/receive JSON (except note upload, which is `multipart/form-data`).
After login, the frontend sends `Authorization: Bearer <token>` on every request.
On error, return a non-2xx status with `{ "message": "what went wrong" }`; the UI shows that message.

## Shapes

```js
User         { id, name, handle, email, department, year, bio, skills: [string], followers, following, online }

Post         { id, author: User, type: "update" | "question", content, createdAt,
               likes, comments, saves, liked, saved,
               recentComments: Comment[],   // latest 2–3 replies
               note: Note | null,           // attached note
               project: CollabPost | null } // attached team project
Comment      { id, author: User, text, createdAt }
// In `content`, ==words== are shown highlighted and #tags bold. Store the text as-is.

Note         { id, title, subject, semester, author: User, pages, fileType, downloads,
               likes, saves, liked, saved, uploadedAt, summary, tags: [string], preview: [string], fileUrl }

Conversation { id, withUser: User, lastMessage, updatedAt, unread }
Message      { id, senderId, text, createdAt }

TrendingItem { type: "post" | "note" | "project", id, text, author: User, createdAt,
               likes, comments, saves, applicants, score }

CollabPost   { id, author: User, title, description, skillsNeeded: [string], category, createdAt,
               spots,            // people needed in total
               spotsLeft,        // spots minus accepted applicants
               applicantsCount,
               members: User[],  // owner + accepted applicants
               saves, saved,
               myApplication: Application | null }   // the logged-in user's request, if any
Application  { id, projectId, applicant: User, note, status: "pending" | "accepted" | "rejected",
               response, appliedAt, respondedAt }    // response = owner's message to the applicant

Streak       { current, best, todayCounted, week: [{ date: "YYYY-MM-DD", label, active, isToday }],
               justCounted?, countedBy? }            // only on POST /streak/activity

Notification { id, author: User, text, target, link, createdAt, read }
```

`liked` / `saved` / `myApplication` / `read` are for **the logged-in user**. Dates are ISO strings.

## Endpoints

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | `{ token, user: User }` |
| POST | `/auth/signup` | `{ name, email, password, department, year }` | `{ token, user: User }` |
| GET | `/posts` | – | `Post[]` (newest first) |
| POST | `/posts` | `{ content, type, noteId? }` | `Post` |
| POST | `/posts/:id/comments` | `{ text }` | `Comment` |
| POST | `/posts/:id/like` | – | `{ liked, likes }` (toggles) |
| POST | `/posts/:id/save` | – | `{ saved, saves }` (toggles) |
| GET | `/trending` | – | `TrendingItem[]`, top 5 (see below) |
| GET | `/notes?subject=&search=` | – | `Note[]` (`subject=All` means no filter) |
| GET | `/notes/:id` | – | `Note` |
| POST | `/notes` | form-data: `title, subject, semester, summary, file` | `Note` |
| GET | `/notes/subjects` | – | `string[]` (first item `"All"`) |
| POST | `/notes/:id/like` | – | `{ liked, likes }` |
| POST | `/notes/:id/save` | – | `{ saved, saves }` |
| GET | `/conversations` | – | `Conversation[]` (most recent first) |
| GET | `/conversations/:id/messages` | – | `Message[]` (oldest first); also marks the chat as read |
| POST | `/conversations/:id/messages` | `{ text }` | `Message` |
| GET | `/collabs` | – | `CollabPost[]`, newest first (Explore tab) |
| GET | `/collabs/:id` | – | `CollabPost` |
| POST | `/collabs` | `{ title, description, skillsNeeded, spots, category }` | `CollabPost` |
| POST | `/collabs/:id/save` | – | `{ saved, saves }` |
| GET | `/collabs/mine` | – | `(CollabPost & { applications: Application[] })[]` ("Posted by you" tab) |
| GET | `/collabs/applied` | – | `(Application & { project: CollabPost })[]` ("Applied" tab) |
| POST | `/collabs/:id/apply` | `{ note }` | `Application` (status `pending`) |
| PATCH | `/collabs/:id/applications/:applicationId` | `{ status: "accepted" \| "rejected", response }` | `Application` (owner only) |
| GET | `/streak` | – | `Streak` |
| POST | `/streak/activity` | `{ type }` | `Streak` with `justCounted` |
| GET | `/notifications` | – | `Notification[]` (newest first) |
| POST | `/notifications/read` | – | `204`, marks all as read |
| GET | `/users/:handle` | – | `{ user, posts: Post[], notes: Note[], projects: CollabPost[], savedNotes: Note[] }` (`savedNotes` only for yourself) |
| GET | `/users/suggested` | – | `User[]` ("People to meet") |

### Trending
Return the **top 5** posts, notes and team projects, highest `score` first.
Suggested: only the **last 7 days**, `score = likes + comments + saves + applicants`.

### Streak
- A day counts when the student is active for **5 minutes** (the frontend sends `type: "active_5min"`) **or** does any action:
  `post`, `comment`, `message`, `upload_note`, `open_note`, `like`, `save`, `apply`, `create_project`.
- Store one row per (user, day). Use the **student's local date** (e.g. send/keep their timezone) so midnight is right.
- `current` = days in a row ending today (or yesterday if today isn't counted yet). Missing a day resets it.
- `justCounted: true` only on the first activity of the day (the UI shows a 🔥 message).

### Teams rules
- A user can apply to a project **once**, and not to their own project.
- Don't allow accepting when `spotsLeft` is 0.
- When rejecting, the owner writes a message (`response`); the applicant sees it in their **Applied** tab.

### Not wired up yet (UI exists, no API call)
Follow, Edit profile, starting a new chat. Real-time chat (WebSockets) can come later; for now messages load when a chat opens.
