# Holistic Full-Stack Audit (April 13, 2026)

## Current status found
- Next.js + Supabase SDK baseline exists.
- No Git remote was configured, so GitHub/Vercel auto-deploy could not currently run.
- No CI workflow existed for lint/build gatekeeping.
- No worker deployment automation existed for Supabase Edge Functions.
- No worker heartbeat table schema existed.

## Changes added
1. **GitHub CI guardrail**
   - Added `.github/workflows/ci.yml` to run `npm ci`, `npm run lint`, and `npm run build` on PRs and pushes.
2. **Supabase worker deploy pipeline**
   - Added `.github/workflows/deploy-workers.yml` to deploy `sync-worker` automatically on main branch changes.
3. **Vercel scheduled worker trigger**
   - Added `vercel.json` cron job to run `/api/workers/sync` every 15 minutes.
4. **Server worker endpoint**
   - Added `app/api/workers/sync/route.ts` to write worker heartbeat rows in Supabase.
5. **Supabase edge worker**
   - Added `supabase/functions/sync-worker/index.ts` as deployable Edge Function worker.
6. **Database migration**
   - Added `supabase/migrations/20260413000000_create_worker_heartbeats.sql`.

## Manual setup still required
1. Add Git remote:
   - `git remote add origin <your-github-repo-url>`
   - `git push -u origin work`
2. In GitHub repo secrets, set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ACCESS_TOKEN`
   - `SUPABASE_PROJECT_REF`
3. In Vercel project env vars, set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Apply migrations and deploy workers:
   - `supabase db push`
   - `supabase functions deploy sync-worker --no-verify-jwt`

## Verification checklist
- GitHub Actions CI passes.
- Worker deployment workflow passes.
- Vercel cron is visible and active.
- `worker_heartbeats` table receives rows from:
  - Vercel cron API route (`sync-worker`)
  - Supabase edge worker (`supabase-sync-worker`)
