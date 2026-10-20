# My Work List

A personal task manager: sign up, then create, edit, change the status of and delete your own tasks. Each user sees only their own tasks, and the database enforces that.

Live: https://my-work-list-ten.vercel.app

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 with the Thunder Design System theme · Supabase (Auth, Postgres, Row Level Security) via `@supabase/ssr` · `react-hook-form` · `lucide-react`.

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run [`supabase/migrations/0001_tasks.sql`](supabase/migrations/0001_tasks.sql). It creates the `tasks` table and its RLS policies.
3. In **Authentication → Providers → Email**, turn **off** "Confirm email" (sign-up must log you in straight away) and set the minimum password length to 8.
4. In **Authentication → URL Configuration**, set the Site URL to your deployed URL and add `http://localhost:3000` and the deployed URL to Redirect URLs.
5. Copy the env file and fill it in from **Project Settings → API Keys**:
   ```bash
   cp .env.example .env.local
   ```
   Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Use the anon/publishable key only, never the `service_role` key (it bypasses RLS). This app doesn't use it anywhere.
6. Install and run:
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## How it works (Auth → SDK → database)

- **Register / log in:** `RegisterForm` and `LoginForm` (`src/components/auth`) call Supabase Auth through the browser client, `src/lib/supabase/client.ts`. Supabase returns a session stored in cookies.
- **Session:** `src/proxy.ts` refreshes the session on each request. Logged-out users go from `/tasks` to `/login`, and logged-in users go from `/login` and `/register` to `/tasks`.
- **Reads and writes:** pages read through `src/app/tasks/queries.ts` and writes go through the server actions in `src/app/tasks/actions.ts`. Both use the cookie-based server client, `src/lib/supabase/server.ts`, so every query runs as the logged-in user. The actions also check the session and validate input (`src/lib/tasks.ts`).
- **Database (the real boundary):** the migration turns on RLS, with `select`, `insert`, `update` and `delete` allowed only where `owner_id = auth.uid()`. The update policy also has `with check`, so you can't hand a task to another user. `owner_id` is filled in by the database, never sent by the client. `anon` has no privileges on `tasks`, so logged-out calls are refused. The title and description limits are also enforced by `check` constraints.

Hiding buttons or filtering in the UI is not the protection; the policies are.

## Design system

The Thunder theme is `src/design-system/t1-tailwind-v4.css`, copied verbatim and not edited. It is imported first in `src/app/globals.css`, because its Google Fonts `@import` has to come before other rules. Components use the theme's token classes (`bg-card`, `text-muted-foreground`, `rounded-pill`, …). Shared pieces are in `src/components/ui`, and `/components` shows them.

## Security check

Run `node --env-file=.env.local scripts/rls-check.mjs`. It signs up two throwaway users (so "Confirm email" must be off), checks that neither can read, change, delete or take over the other's tasks and that a logged-out client can do nothing, then exits non-zero on any leak. The two users stay in Supabase Auth afterwards; delete them in the dashboard if you like.

## Deployment

Vercel is connected to the GitHub repo, and a push to `main` deploys to production. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel project (Production and Preview).

| Commit | Vercel deployment |
|---|---|
| _to be filled in at handoff_ | _to be filled in at handoff_ |
