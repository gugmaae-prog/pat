create table if not exists public.worker_heartbeats (
  id bigserial primary key,
  worker_name text not null,
  heartbeat_at timestamptz not null default now(),
  inserted_at timestamptz not null default now()
);

create index if not exists worker_heartbeats_worker_name_idx
  on public.worker_heartbeats (worker_name);

create index if not exists worker_heartbeats_heartbeat_at_idx
  on public.worker_heartbeats (heartbeat_at desc);
