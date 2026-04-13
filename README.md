# PAT AI (Next.js Scaffold)

Minimal project scaffold for PAT with a clean black-and-white UI direction, a chat-style homepage on `/`, and the existing dashboard on `/dashboard`.

## Included foundation
- Next.js App Router setup.
- PAT homepage route: `/`.
- Dashboard route: `/dashboard`.
- Supabase scaffolding (`client` + `server` helpers).
- Vercel-ready defaults.

## Project structure

```txt
app/
  dashboard/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  chat/ChatShell.tsx
  dashboard/BuildDashboard.tsx
lib/
  supabase/
    client.ts
    server.ts
.env.example
next.config.js
tsconfig.json
package.json
```

## Local run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` from `.env.example`.
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

## Environment variables
Set these in `.env.local` (and in Vercel project settings):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Notes:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used by browser-safe client access.
- `SUPABASE_SERVICE_ROLE_KEY` is only for server-side privileged operations.

## Build and deploy
- Local production build:
  ```bash
  npm run build
  npm run start
  ```
- Vercel build command: `npm run build`.
- Node version: `>=20` (declared in `package.json`).

## Routes
- `/` → PAT chat shell.
- `/dashboard` → existing PAT dashboard prototype.
