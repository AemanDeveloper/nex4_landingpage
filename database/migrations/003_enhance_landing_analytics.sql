alter table management.analytics_sources
  drop constraint if exists analytics_sources_system_id_allowed;

alter table management.analytics_sources
  add constraint analytics_sources_system_id_allowed
  check (system_id in ('landing', 'lms-owner', 'crm', 'nutritrack'));

insert into management.analytics_sources (system_id)
values ('landing')
on conflict (system_id) do nothing;

alter table management.traffic_events
  add column if not exists target_id text,
  add column if not exists device_type text not null default 'unknown',
  add column if not exists source text not null default 'unknown';

alter table management.traffic_events
  drop constraint if exists traffic_events_type_allowed;

alter table management.traffic_events
  add constraint traffic_events_type_allowed
  check (event_type in ('page_view', 'section_view', 'button_click'));

alter table management.traffic_events
  drop constraint if exists traffic_events_target_valid,
  drop constraint if exists traffic_events_device_allowed,
  drop constraint if exists traffic_events_source_length;

alter table management.traffic_events
  add constraint traffic_events_target_valid
    check (
      (event_type = 'page_view' and target_id is null)
      or (
        event_type in ('section_view', 'button_click')
        and char_length(target_id) between 1 and 120
      )
    ),
  add constraint traffic_events_device_allowed
    check (device_type in ('desktop', 'tablet', 'mobile', 'unknown')),
  add constraint traffic_events_source_length
    check (char_length(source) between 1 and 120);

create index if not exists traffic_events_system_type_occurred_idx
  on management.traffic_events (system_id, event_type, occurred_at desc);

create index if not exists traffic_events_system_target_occurred_idx
  on management.traffic_events (system_id, target_id, occurred_at desc)
  where target_id is not null;
