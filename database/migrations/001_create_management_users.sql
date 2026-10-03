create schema if not exists management;

revoke all on schema management from public, anon, authenticated, service_role;

create table if not exists management.users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  password_hash text not null,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint management_users_username_format
    check (username = lower(username) and char_length(username) between 3 and 100),
  constraint management_users_password_hash_format
    check (password_hash like '$scrypt$%')
);

create unique index if not exists management_users_username_unique
  on management.users (lower(username));

alter table management.users enable row level security;
alter table management.users force row level security;

revoke all on table management.users from public, anon, authenticated, service_role;
