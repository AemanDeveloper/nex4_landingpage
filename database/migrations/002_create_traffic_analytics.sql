create table if not exists management.analytics_sources (
  system_id text primary key,
  secret_hash text unique,
  is_active boolean not null default true,
  connected_at timestamptz,
  last_event_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint analytics_sources_system_id_allowed
    check (system_id in ('lms-owner', 'crm', 'nutritrack')),
  constraint analytics_sources_secret_hash_format
    check (secret_hash is null or secret_hash ~ '^[a-f0-9]{64}$')
);

insert into management.analytics_sources (system_id)
values ('lms-owner'), ('crm'), ('nutritrack')
on conflict (system_id) do nothing;

create table if not exists management.traffic_events (
  id bigint generated always as identity primary key,
  system_id text not null references management.analytics_sources (system_id),
  event_type text not null default 'page_view',
  path text not null,
  visitor_hash text not null,
  session_hash text,
  occurred_at timestamptz not null default now(),
  constraint traffic_events_type_allowed
    check (event_type = 'page_view'),
  constraint traffic_events_path_length
    check (char_length(path) between 1 and 500),
  constraint traffic_events_visitor_hash_format
    check (visitor_hash ~ '^[a-f0-9]{64}$'),
  constraint traffic_events_session_hash_format
    check (session_hash is null or session_hash ~ '^[a-f0-9]{64}$')
);

create index if not exists traffic_events_system_occurred_idx
  on management.traffic_events (system_id, occurred_at desc);

alter table management.analytics_sources enable row level security;
alter table management.analytics_sources force row level security;
alter table management.traffic_events enable row level security;
alter table management.traffic_events force row level security;

revoke all on table management.analytics_sources
  from public, anon, authenticated, service_role;
revoke all on table management.traffic_events
  from public, anon, authenticated, service_role;
revoke all on sequence management.traffic_events_id_seq
  from public, anon, authenticated, service_role;
