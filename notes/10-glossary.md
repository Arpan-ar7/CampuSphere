# 10. Glossary

[← Back to notes](<README.md>)

| Word | Plain-English meaning | Example in this project |
|---|---|---|
| **Frontend** | The part that runs in the student's browser: screens, buttons | Everything in [`frontend/`](<../frontend/>) |
| **Backend** | The server: database, real logins, stored files | Your friend's project |
| **API / endpoint** | An address on the backend the frontend calls for data | `GET /posts` in [API_CONTRACT.md](<../API_CONTRACT.md>) |
| **Mock data** | Fake data used until the backend is ready | [mock/data.ts](<../frontend/src/mock/data.ts>) |
| **Next.js** | A framework on top of React: pages from folders, fonts, images, speed | [next.config.ts](<../frontend/next.config.ts>) |
| **React** | A library for building UIs from components | Every `.tsx` file |
| **Component** | A reusable piece of UI (a function returning JSX) | [Button.tsx](<../frontend/src/components/ui/Button.tsx>) |
| **JSX / TSX** | HTML-like code inside JavaScript / TypeScript (`.tsx` files) | `<Button color="mint">Save</Button>` |
| **TypeScript** | JavaScript plus *types*: it checks your code before it runs | every `.ts` / `.tsx` file |
| **Type / interface** | A description of the shape of some data | `interface Post { id: string; content: string … }` in [types/index.ts](<../frontend/src/types/index.ts>) |
| **Strict mode** | TypeScript's strongest checks (no hidden `any`, null checks) | `"strict": true` in [tsconfig.json](<../frontend/tsconfig.json>) |
| **Type-check** | Running TypeScript to find mistakes | `npm run typecheck` |
| **Props** | Options you pass to a component | `color="mint"` |
| **State** | Data that changes while the app runs | `useState([])` for a list of posts |
| **Hook** | A React function starting with `use` | `useState`, `useAuth`, `useFocusFromUrl` |
| **Effect** | Code that runs after the screen updates (e.g. load data) | `useEffect(() => { api.getFeed()… }, [])` |
| **Context** | State shared by many components without passing props | [AuthContext.tsx](<../frontend/src/context/AuthContext.tsx>) |
| **Provider** | The component that holds a context's state | `<AuthProvider>` in [providers.tsx](<../frontend/src/app/providers.tsx>) |
| **Route** | A web address and the page it shows | `/notes` → `app/(main)/notes/page.tsx` |
| **App Router** | Next.js's folder-based routing (`app/` folder) | [`frontend/src/app/`](<../frontend/src/app/>) |
| **Layout** | Wrapper shared by several pages (menus) | [(main)/layout.tsx](<../frontend/src/app/(main)/layout.tsx>) |
| **Route group** | A folder in brackets that groups pages without changing the URL | `(main)` |
| **Dynamic segment** | A variable part of a URL | `[handle]` in `/u/[handle]` |
| **Server component** | Runs on the server; can't use state or clicks | `page.tsx` files |
| **Client component** | Runs in the browser; starts with `'use client'` | every `…View.tsx` |
| **Metadata** | Page info like the browser-tab title | `export const metadata = { title: 'Notes Library' }` |
| **Cache Components** | Next.js 16 feature: pre-built pages, recent pages kept alive | `cacheComponents: true` in next.config.ts |
| **Tailwind CSS** | Styling with small class names | `className="rounded-2xl border-2"` |
| **Design token** | A named style value used everywhere | `--color-hl-yellow` in [globals.css](<../frontend/src/app/globals.css>) |
| **Toast** | A small pop-up message that disappears | [ToastContext.tsx](<../frontend/src/context/ToastContext.tsx>) |
| **Modal** | A pop-up window over the page | [Modal.tsx](<../frontend/src/components/ui/Modal.tsx>) |
| **localStorage** | Small storage in the browser that survives refreshes | the saved login, the streak days |
| **Token** | A "ticket" from the backend proving who you are | sent as `Authorization: Bearer …` |
| **401** | Backend answer: "not logged in / token expired" | client.ts logs you out |
| **XSS** | An attack that injects code into a page | prevented by React + [RichText.tsx](<../frontend/src/components/feed/RichText.tsx>) |
| **CSP** | Content Security Policy: the browser's allow-list for scripts and connections | [next.config.ts](<../frontend/next.config.ts>) |
| **CORS** | Backend setting that says which sites may call it | backend must allow `localhost:3000` |
| **Environment variable** | A setting that differs per computer/server | `NEXT_PUBLIC_API_URL` in `.env.local` |
| **Lint** | Automatic code checking | `npm run lint` |
| **Build** | Turning the code into the fast production version | `npm run build` |
