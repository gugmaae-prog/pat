# PAT AI Assistant

A clean, minimalist ChatGPT-style AI assistant that learns from your habits, thought process, and workflow to continuously improve.

## Core principles
- Strictly black-and-white UI, no emojis, no bright colors.
- Button-first interactions for choices.
- Subtle, data-driven learning loop.
- Transparent about limitations, concise communication.

## Core features
- Smart planner and execution support.
- Voice support via Mistral.
- Photo/image processing.
- Google Drive integration.
- Email monitoring and response assistance.
- Botspace integration for campaign/workflow learning.
- CRM management and client communication support.

## Learning behavior
- Quietly logs topics and repeated interests.
- Builds patterns from recurring behavior.
- Uses internet research when required.
- Processes Google Drive data and conversation context.
- Learns from outcomes and improves over time.

## UI behavior guidelines
- Minimal ChatGPT-style interface in black/white.
- Translucent card design.
- Pinterest-like card interaction (tap/click to expand).
- Decision cards should show:
  - pros and cons,
  - probability,
  - expected outcomes,
  - next steps.

## Tech stack
- Frontend: Next.js + React (Vercel)
- Backend: Flask Python (Alibaba Cloud ECS)
- Database & memory: Supabase
- Voice: Mistral
- APIs: Mistral, Groq, Gemini (round-robin), Botspace API

---

# PAT AI (Next.js Baseline)

A minimal Next.js baseline prepared for local development, Supabase integration, and Vercel deployment.

## What is included
- App Router setup.
- Main chat page at `/`.
- Build dashboard page at `/dashboard`.
- Reusable component structure for chat + dashboard.
- Chat-integrated planning flow that can generate a project dashboard tool from user-provided details.
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
  dashboard/ProjectDashboardTool.jsx
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

### 2) Configure environment
Create `.env.local` from `.env.example` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 3) Run
```bash
npm run dev
```
Then open `http://localhost:3000`.

## Build for production
```bash
npm run build
npm run start
```

## Supabase notes
- Use `lib/supabase/client.js` in browser contexts.
- Use `lib/supabase/server.js` in trusted server contexts only.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code.

## Vercel deployment
1. Push repo to GitHub.
2. Import project into Vercel.
3. Set required environment variables.
4. Build command: `npm run build`.
5. Deploy.

## Required environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Deployment readiness checklist
- `npm install` executes successfully in your environment.
- `npm run build` executes successfully in your environment.
- No unresolved imports.
- Environment variables configured.

## GitHub + Vercel + Supabase automation
- GitHub CI: `.github/workflows/ci.yml`
- Worker deploy workflow: `.github/workflows/deploy-workers.yml`
- Vercel cron schedule: `vercel.json`
- Supabase worker: `supabase/functions/sync-worker/index.ts`
- Audit report: `docs/FULL_STACK_AUDIT.md`

## Build Dashboard Draft
The build dashboard is available in `components/dashboard/BuildDashboard.jsx`.

It includes:
- track cards (A/B/C/D/E/F/G + KB),
- dependencies and fallbacks per track,
- task lists with expand/collapse interaction,
- deployment order for `espacios.me`.
