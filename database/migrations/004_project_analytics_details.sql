alter table management.traffic_events
  add column if not exists destination text;

alter table management.traffic_events
  drop constraint if exists traffic_events_destination_length;

alter table management.traffic_events
  add constraint traffic_events_destination_length
    check (destination is null or char_length(destination) between 1 and 500);

create table if not exists management.analytics_visitors (
  system_id text not null references management.analytics_sources (system_id),
  visitor_hash text not null,
  first_seen_at timestamptz not null,
  last_seen_at timestamptz not null,
  first_source text not null default 'unknown',
  first_device_type text not null default 'unknown',
  primary key (system_id, visitor_hash),
  constraint analytics_visitors_hash_format
    check (visitor_hash ~ '^[a-f0-9]{64}$'),
  constraint analytics_visitors_source_length
    check (char_length(first_source) between 1 and 120),
  constraint analytics_visitors_device_allowed
    check (first_device_type in ('desktop', 'tablet', 'mobile', 'unknown'))
);

insert into management.analytics_visitors (
  system_id,
  visitor_hash,
  first_seen_at,
  last_seen_at
)
select
  system_id,
  visitor_hash,
  min(occurred_at),
  max(occurred_at)
from management.traffic_events
group by system_id, visitor_hash
on conflict (system_id, visitor_hash) do update
set
  first_seen_at = least(
    management.analytics_visitors.first_seen_at,
    excluded.first_seen_at
  ),
  last_seen_at = greatest(
    management.analytics_visitors.last_seen_at,
    excluded.last_seen_at
  );

create index if not exists traffic_events_system_session_occurred_idx
  on management.traffic_events (system_id, session_hash, occurred_at)
  where session_hash is not null;

create index if not exists traffic_events_system_visitor_occurred_idx
  on management.traffic_events (system_id, visitor_hash, occurred_at desc);

create index if not exists traffic_events_system_path_occurred_idx
  on management.traffic_events (system_id, path, occurred_at desc);

alter table management.analytics_visitors enable row level security;
alter table management.analytics_visitors force row level security;

revoke all on table management.analytics_visitors
  from public, anon, authenticated, service_role;
