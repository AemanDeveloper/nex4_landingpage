alter table management.analytics_sources
  drop constraint if exists analytics_sources_system_id_allowed;

alter table management.analytics_sources
  add constraint analytics_sources_system_id_allowed
  check (system_id in ('landing', 'lms-owner', 'crm', 'nutritrack', 'lensa'));

insert into management.analytics_sources (system_id)
values ('lensa')
on conflict (system_id) do nothing;
