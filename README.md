# PAT AI (Next.js Baseline)

A minimalist black-and-white PAT AI frontend prepared for local development, Supabase integration, and Vercel deployment.

## What is included
- Next.js App Router setup.
- Main chat-style page at `/`.
- Build dashboard page at `/dashboard`.
- Existing dashboard logic moved into reusable component structure.
- Supabase client scaffolding for browser and server usage.

## Project structure

```txt
app/
  dashboard/page.jsx
  globals.css
  layout.jsx
  page.jsx
components/
  chat/ChatShell.jsx
  dashboard/BuildDashboard.jsx
lib/
  supabase/
    client.js
    server.js
.env.example
next.config.js
jsconfig.json
package.json
```

## Local development

### 1) Install
```bash
npm install
```

### 2) Configure env
Create `.env.local` from `.env.example` and set values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 3) Run locally
```bash
npm run dev
```
Then open `http://localhost:3000`.

## Build for production
```bash
npm run build
npm run start
```

## Supabase integration notes
- Use `lib/supabase/client.js` for browser-side reads/writes with anon key.
- Use `lib/supabase/server.js` only in server-side contexts (server actions/route handlers) where service role usage is required.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## Vercel deployment
1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Set the required environment variables in Vercel project settings.
4. Build command: `npm run build`.
5. Output: default Next.js output.
6. Deploy.

## Required environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (only needed for server-side privileged operations)

## Deployment readiness checklist
- `npm install` passes.
- `npm run build` passes.
- No unresolved imports.
- Env vars set in Vercel.


## GitHub + Vercel + Supabase automation
This repo now includes automation glue:
- GitHub Actions CI: `.github/workflows/ci.yml`
- Web deploy workflow: `.github/workflows/deploy-web.yml`
- Supabase worker deploy workflow: `.github/workflows/deploy-workers.yml`
- Vercel cron schedule: `vercel.json` (`/api/workers/sync` every 15 minutes)
- Supabase Edge Function worker: `supabase/functions/sync-worker/index.ts`
- Audit report: `docs/FULL_STACK_AUDIT.md`

### Required GitHub repository secrets
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
