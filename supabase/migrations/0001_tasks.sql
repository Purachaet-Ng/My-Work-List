-- My Work List: tasks table, owner-only access enforced by RLS.
-- Run once in Supabase Dashboard -> SQL Editor (or `supabase db push`).

create type public.task_status as enum ('todo', 'doing', 'done');

create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null check (length(btrim(title)) between 1 and 200),
  description text check (description is null or length(description) <= 2000),
  status      public.task_status not null default 'todo',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index tasks_owner_created_idx on public.tasks (owner_id, created_at desc);

-- Keep updated_at honest regardless of what the client sends.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- Privileges: logged-out callers (anon) get nothing, so they are refused with a
-- permission error rather than an empty list. Logged-in callers get CRUD, narrowed by RLS.
revoke all on public.tasks from anon, authenticated;
grant select, insert, update, delete on public.tasks to authenticated;

alter table public.tasks enable row level security;

-- (select auth.uid()) is evaluated once per statement instead of once per row.
create policy "tasks_select_own" on public.tasks
  for select to authenticated
  using (owner_id = (select auth.uid()));

create policy "tasks_insert_own" on public.tasks
  for insert to authenticated
  with check (owner_id = (select auth.uid()));

-- with check blocks handing a task over to another user (owner_id = B).
create policy "tasks_update_own" on public.tasks
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "tasks_delete_own" on public.tasks
  for delete to authenticated
  using (owner_id = (select auth.uid()));
