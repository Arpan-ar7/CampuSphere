# CampuSphere – Frontend

React + Vite + Tailwind CSS. A campus notebook where students share notes, post, chat and find teammates.
This folder is **only the frontend**; the backend is a separate project.

## Run it

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. In demo mode any email and password logs you in.

## Folder map

```
src/
├── main.jsx            starts the app (router, login, pop-up messages)
├── App.jsx             every page and its web address
├── config.js           app name, university, streak rules, campus photos
│
├── pages/              one file per screen
│   ├── FeedPage.jsx        home: composer + campus feed
│   ├── NotesPage.jsx       notes library
│   ├── TeamsPage.jsx       find teammates: Explore / Posted by you / Applied
│   ├── MessagesPage.jsx    chats
│   ├── ProfilePage.jsx     a student's profile
│   └── LoginPage.jsx       log in / sign up
│
├── components/
│   ├── ui/             small building blocks: Button, Card, Chip, Modal, Avatar, FormFields…
│   ├── layout/         page frame: TopBar, LeftSidebar, RightSidebar, MobileNav, background
│   ├── feed/           PostCard, PostComposer, RichText (==highlights==)
│   ├── notes/          NoteCard, NotePreviewModal, UploadNoteModal
│   ├── teams/          ProjectCard, MyProjectCard, ApplicationCard, Apply/Reject/Create pop-ups
│   ├── streak/         StreakChip (top bar), StreakCard (sidebar), StreakDetails
│   └── trending/       TrendingCard (top 5)
│
├── api/                frontend calls to the backend, one file per feature
│   ├── client.js           fetch helper + the mock switch
│   └── index.js            puts them together as `api.something()`
├── mock/data.js        fake data used until the backend is ready
├── context/            app-wide state: AuthContext, StreakContext, ToastContext
├── hooks/              useScrollToHash (jump to #post-p1 etc.)
├── utils/              cn (join classes), colors, time helpers
└── styles/index.css    Tailwind + design colours, fonts, shadows
```

**Where do I change…**
- a colour, font or shadow → `src/styles/index.css` (`@theme`)
- the university name, streak minutes, background photo → `src/config.js`
- what a page shows → `src/pages/…Page.jsx`
- how a card looks → `src/components/<feature>/…Card.jsx`
- the fake data → `src/mock/data.js`

## Design: "Campus Notebook"

Grid paper, 2px ink outlines, hard shadows, highlighter colours (`hl-yellow`, `hl-pink`, `hl-mint`, `hl-blue`, `hl-peach`, `hl-lilac`),
Bricolage Grotesque headings (`font-display`), DM Sans text and Caveat handwriting (`font-hand`).
Everything is styled with Tailwind classes.

## Daily streak

A day counts when the student **uses the app for 5 minutes** (tab open, and they moved the mouse or typed in the last minute)
**or does any action**: post, reply, message, upload or open a note, like, save, apply to a team.
The rules are in `src/config.js`; the tracking is in `src/context/StreakContext.jsx`.

## Connecting the backend

The endpoints and data shapes are in [`../API_CONTRACT.md`](../API_CONTRACT.md). When the backend is running, create `frontend/.env`:

```
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5000/api
```
