# CampuSphere – Frontend

Next.js 16 (App Router) + React 19 + **TypeScript (strict)** + Tailwind CSS 4. A campus notebook where students share notes, post, chat and find teammates.
This folder is **only the frontend**; the backend is a separate project.

📒 **Full documentation (every file explained, with links): [../notes/README.md](../notes/README.md)**

## Run it

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

In demo mode any email and password logs you in. Copy `.env.example` to `.env.local` to change settings.

| Command | What it does |
|---|---|
| `npm run dev` | start the app while you work (auto-reloads) |
| `npm run build` | make the production version (also checks for errors) |
| `npm start` | run the production version after `build` |
| `npm run typecheck` | check all TypeScript types |
| `npm run lint` | check the code for mistakes |
| `npm run check` | typecheck + lint + build in one go |

## Folder map

```
src/
├── app/                      PAGES — the folder path is the web address
│   ├── layout.tsx                 the <html>, fonts, site title (every page)
│   ├── globals.css               Tailwind + design colours, fonts, shadows
│   ├── providers.tsx             login + pop-up messages for the whole app
│   ├── not-found.tsx              "page not found"
│   ├── error.tsx / global-error.tsx friendly crash pages
│   ├── icon.svg                  the browser-tab icon
│   ├── login/                    /login
│   └── (main)/                   pages that need you to be logged in
│       ├── layout.tsx                 adds the top bar, sidebars and phone menu
│       ├── page.tsx + FeedView.tsx    /            the campus feed
│       ├── notes/                    /notes       notes library
│       ├── teams/                    /teams       Explore / Posted by you / Applied
│       ├── messages/[[...chat]]/     /messages and /messages/c1
│       └── u/[handle]/               /u/arpan     a student's profile
│
├── components/
│   ├── ui/          small building blocks: Button, Card, Chip, Modal, Avatar, FormFields…
│   ├── layout/      AppShell (frame + login check), TopBar, sidebars, MobileNav, background
│   ├── feed/        PostCard, PostComposer, RichText (==highlights==)
│   ├── notes/       NoteCard, NotePreviewModal, UploadNoteModal
│   ├── teams/       ProjectCard, MyProjectCard, ApplicationCard, Apply/Reject/Create pop-ups
│   ├── streak/      StreakChip (top bar), StreakCard (sidebar), StreakDetails
│   └── trending/    TrendingCard (top 5)
│
├── services/        frontend calls TO the backend, one file per feature (api.getFeed() …)
├── mock/data.ts     fake data used until the backend is ready
├── context/         app-wide state: Auth, Streak, Toast, Unread messages
├── hooks/           useFocusFromUrl (?focus=post-p1 → scroll to that post)
├── types/           TypeScript types for all data (match API_CONTRACT.md)
├── utils/           cn, colors, time, links (safe URLs), session (saved login), upload checks
├── assets/          the campus photo
└── config.ts        app name, university, streak rules, campus photos
```

In every route folder, **`page.tsx`** is the small Next.js file (page title + which view to show) and
**`…View.tsx`** is the actual screen. Next.js tags interactive files with `'use client'` at the top.

**Where do I change…**
- a colour, font or shadow → `src/app/globals.css` (`@theme`)
- the university name, streak minutes, background photo → `src/config.ts`
- what a page shows → `src/app/(main)/<page>/…View.tsx`
- a page's browser-tab title → that folder's `page.tsx` (`metadata`)
- how a card looks → `src/components/<feature>/…Card.tsx`
- the fake data → `src/mock/data.ts`

## Next.js features used

- **App Router**: folders in `src/app` are the pages; `(main)` groups the logged-in pages under one shared layout.
- **`next/font`**: Bricolage Grotesque, DM Sans and Caveat are downloaded at build time (no flash, no Google request from the browser).
- **`next/image`**: the campus photo is resized and compressed automatically, with a blurred preview while it loads.
- **Metadata**: every page has its own tab title, e.g. "Notes Library · CampuSphere".
- **Cache Components + Partial Prefetching** (`next.config.ts`): recently visited pages stay alive in the background, so going back is instant.

The login is saved in the browser (localStorage), so the server first sends a loading screen and the browser fills in the page.
That's why `next.config.ts` only runs Next's "instant navigation" checks on pages that opt in.

## Design: "Campus Notebook"

Grid paper, 2px ink outlines, hard shadows, highlighter colours (`hl-yellow`, `hl-pink`, `hl-mint`, `hl-blue`, `hl-peach`, `hl-lilac`),
Bricolage Grotesque headings (`font-display`), DM Sans text and Caveat handwriting (`font-hand`). Everything is styled with Tailwind classes.

## Daily streak

A day counts when the student **uses the app for 5 minutes** (tab open, and they moved the mouse or typed in the last minute)
**or does any action**: post, reply, message, upload or open a note, like, save, apply to a team.
The rules are in `src/config.ts`; the tracking is in `src/context/StreakContext.tsx`.

## Connecting the backend

The endpoints and data shapes are in [`../API_CONTRACT.md`](../API_CONTRACT.md). When the backend is running, create `frontend/.env.local`:

```
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Then restart `npm run dev`.
