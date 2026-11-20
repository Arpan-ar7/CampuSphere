# 8. Security

[← Back to notes](<README.md>)

> **Golden rule:** the frontend can **help** with security, but it can never **enforce** it.
> Anyone can open the browser tools and change frontend code or call the backend directly.
> Every check that really matters (who can do what, limits, file types) **must also be done by the backend**.

## What the frontend does

### 1. No HTML injection (XSS)
- React escapes everything it shows by default. We **never** use `dangerouslySetInnerHTML`.
- Post text goes through [RichText.tsx](<../frontend/src/components/feed/RichText.tsx>), which only outputs plain text
  (highlights and #tags are built from text pieces, never HTML).

### 2. Safe links: [utils/links.ts](<../frontend/src/utils/links.ts>)
- **All in-app links** are built by helpers (`profileHref`, `noteHref`…) that URL-encode ids and handles.
- **Links from the backend** (notifications) go through `safeInternalHref()`: only paths like `/teams` are allowed;
  `javascript:…` or `//other-site.com` are replaced with `/`.
  Used in [NotificationsMenu.tsx](<../frontend/src/components/layout/NotificationsMenu.tsx>).
- **File links** (note downloads) go through `safeExternalUrl()`: only `http(s)` URLs, opened with
  `noopener,noreferrer` so the other site can't control our tab. Used in [NotePreviewModal.tsx](<../frontend/src/components/notes/NotePreviewModal.tsx>).
- `?focus=` values are escaped with `CSS.escape` before being used to find an element ([useFocusFromUrl.ts](<../frontend/src/hooks/useFocusFromUrl.ts>)).

### 3. Security headers: [next.config.ts](<../frontend/next.config.ts>)
Sent with every page:

| Header | Protects against |
|---|---|
| **Content-Security-Policy** | Scripts, styles, images and connections only from our own site + the backend URL. Injected scripts from other sites are blocked |
| `frame-ancestors 'none'` + `X-Frame-Options: DENY` | Click-jacking (putting our site in a hidden iframe) |
| `X-Content-Type-Options: nosniff` | Browsers guessing file types (e.g. running an "image" as a script) |
| `Referrer-Policy: strict-origin-when-cross-origin` | Leaking full URLs to other sites |
| `Permissions-Policy` | Camera, microphone, location, payments: we never use them, so they're switched off |
| `poweredByHeader: false` | Hides "X-Powered-By: Next.js" |

> The CSP allows `'unsafe-inline'` scripts because Next.js needs them unless we use per-request nonces,
> which would turn off static pages. This is the setup the Next.js 16 docs recommend for static apps.

### 4. Input limits & validation
- Every text box has a `maxLength` from [config.ts](<../frontend/src/config.ts>) → `LIMITS` (posts 500, messages 2000…).
- Text is trimmed before sending; project skills are de-duplicated (max 8), "people needed" is kept between 1 and 10.
- Uploads are checked for **type** (PDF, Word, PNG/JPG/WEBP) and **size** (20 MB) by [utils/upload.ts](<../frontend/src/utils/upload.ts>).
- Sign-up requires an 8+ character password; login/sign-up fields use the right `autoComplete` for password managers.

### 5. Login handling
- Only [utils/session.ts](<../frontend/src/utils/session.ts>) reads/writes the saved token, so it's easy to change later.
- The **password is never stored**, only the token the backend returns.
- A **401** from the backend clears the session and returns to `/login` ([client.ts](<../frontend/src/services/client.ts>)).
- Requests time out after 15 s. Raw server errors are never shown, only short friendly messages.

### 6. Errors don't leak details
- [error.tsx](<../frontend/src/app/error.tsx>) / [(main)/error.tsx](<../frontend/src/app/(main)/error.tsx>) show a friendly message;
  the technical error only goes to the browser console. In production Next.js also hides server error details.
- Failed loads show a pink toast and an empty list instead of crashing or spinning forever.

### 7. Secrets & dependencies
- No secrets in the frontend. `NEXT_PUBLIC_*` variables are public by design ([.env.example](<../frontend/.env.example>) warns about this).
- `.env.local` is git-ignored ([.gitignore](<../frontend/.gitignore>)); only `.env.example` is committed.
- `npm audit` currently reports **0 vulnerabilities**. Run it now and then.

---

## What the backend MUST do (tell your friend)

| # | Must | Why |
|---|---|---|
| 1 | **Check permissions on every request** (e.g. only the project owner can accept/reject; only the author can delete a post) | Frontend checks can be bypassed |
| 2 | **Validate & limit all input** (same limits as `LIMITS`), reject unknown fields | Stops huge/abusive data |
| 3 | **Check uploaded files**: real type (not just the name), size, and scan for viruses; serve them from a separate domain or with `Content-Disposition: attachment` | Malicious files |
| 4 | **Only allow university emails** to sign up (`@marwadiuniversity.ac.in`) and verify them | It's a campus-only app |
| 5 | **Hash passwords** (bcrypt / argon2), never store them plainly | Data leaks |
| 6 | **Rate-limit** login, sign-up, posting and messaging | Brute force & spam |
| 7 | **CORS:** allow only the frontend's origin (`http://localhost:3000` in dev, the real domain in production) | Other sites calling your API |
| 8 | **Return 401** for missing/expired tokens (the frontend logs the user out) | Session handling |
| 9 | **Short-lived tokens**, or better: an **httpOnly, Secure, SameSite cookie** instead of a token in localStorage | JavaScript can't read httpOnly cookies, so XSS can't steal them |
| 10 | **Escape/sanitise** anything that is stored and shown again; never return stack traces | Injection & info leaks |
| 11 | Only return **internal paths** (`/teams?tab=mine`) in notification `link`s, and **https** URLs in `fileUrl` | Matches the frontend's checks |
| 12 | Use **HTTPS** in production | Stops eavesdropping |

### If you switch to httpOnly cookies later
Change [utils/session.ts](<../frontend/src/utils/session.ts>) to stop storing the token, and in
[client.ts](<../frontend/src/services/client.ts>) add `credentials: 'include'` to `fetch`. Nothing else needs to change.
