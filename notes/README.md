# 📒 CampuSphere — Project Notes

These notes explain **every part of the CampuSphere frontend**: what each file does, how the pieces connect,
and how to change or add things. Every file name is a **link**: click it to open the file.

> **CampuSphere** is a campus social app for Marwadi University students: share notes, post updates,
> chat, and find teammates for projects.
> This repository is the **frontend only** (what students see in the browser).
> The **backend** (database, real logins, storing files) is built separately; see [API_CONTRACT.md](<../API_CONTRACT.md>).

## Read in this order

| # | Chapter | What you'll learn |
|---|---|---|
| 1 | [Getting started](<01-getting-started.md>) | Install, run, build, settings (`.env.local`) |
| 2 | [Folder structure: every file](<02-folder-structure.md>) | **What every single file is for**, with links |
| 3 | [Pages & routing](<03-pages-and-routing.md>) | Which file is which web address, what each page does |
| 4 | [Components](<04-components.md>) | Every reusable piece (buttons, cards, pop-ups…) and its options |
| 5 | [Data: services & mock data](<05-data-services-and-mock.md>) | How the app gets data, fake data, switching to the real backend |
| 6 | [State: login, streak, pop-ups](<06-state-login-streak.md>) | App-wide state and how the daily streak works |
| 7 | [Styling & design](<07-styling-and-design.md>) | The "Campus Notebook" look, colours, Tailwind |
| 8 | [Security](<08-security.md>) | What the frontend does to stay safe + what the backend must do |
| 9 | [How to add things](<09-how-to-add-things.md>) | Step-by-step recipes: new page, new API call, new component |
| 10 | [Glossary](<10-glossary.md>) | Plain-English meaning of words like *component*, *hook*, *route* |

## The 30-second tour

```
CampuShpere/
├── frontend/          ← the Next.js app (all the code)
│   └── src/
│       ├── app/           pages (folder = web address)
│       ├── components/    reusable pieces of UI
│       ├── services/      calls to the backend
│       ├── mock/          fake data until the backend exists
│       ├── context/       app-wide state (login, streak, pop-ups)
│       ├── hooks/         small reusable React helpers
│       ├── utils/         plain helper functions
│       ├── types/         TypeScript types: the shape of all data
│       └── config.ts      app settings in one place
├── notes/             ← you are here
└── API_CONTRACT.md    ← the agreement with the backend (endpoints + data shapes)
```

**Tech used:** [Next.js 16](https://nextjs.org) (App Router) · React 19 · Tailwind CSS 4 · lucide-react icons · **TypeScript (strict mode)**.

## Most-used files

- [frontend/src/types/index.ts](<../frontend/src/types/index.ts>): the shape of every piece of data (User, Post, Note, Project…)
- [frontend/src/config.ts](<../frontend/src/config.ts>): university name, streak rules, text limits, upload rules
- [frontend/src/app/globals.css](<../frontend/src/app/globals.css>): colours, fonts, shadows
- [frontend/src/mock/data.ts](<../frontend/src/mock/data.ts>): the fake posts, notes, users, projects
- [frontend/src/services/index.ts](<../frontend/src/services/index.ts>): every backend call the app makes
- [frontend/src/components/layout/AppShell.tsx](<../frontend/src/components/layout/AppShell.tsx>): the frame around every page
