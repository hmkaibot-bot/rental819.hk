-- Live bike catalogue synced from the official Rental819 fleet.
-- Public visitors may read active catalogue rows. Writes happen only with the
-- service role (the daily sync), which bypasses RLS.

create table if not exists catalogue_shops (
  store_id        int primary key,
  name_ja         text not null,
  name_en         text,
  area_id         int,
  area_ja         text,
  area_en         text,
  prefecture_ja   text,
  prefecture_en   text,
  address_ja      text,
  address_en      text,
  active          boolean not null default true,
  updated_at      timestamptz not null default now()
);

create table if not exists catalogue_models (
  store_id        int not null references catalogue_shops (store_id) on delete cascade,
  master_bike_id  int not null,
  maker           text not null,
  model           text not null,
  bike_class      text,
  bike_type       text,
  displacement_cc numeric(7, 1),
  model_year      int,
  photo_url       text,
  active          boolean not null default true,
  updated_at      timestamptz not null default now(),
  primary key (store_id, master_bike_id)
);

create table if not exists catalogue_units (
  unit_id         int primary key,
  store_id        int not null,
  master_bike_id  int not null,
  colour          text,
  photo_url       text,
  active          boolean not null default true,
  updated_at      timestamptz not null default now(),
  foreign key (store_id, master_bike_id)
    references catalogue_models (store_id, master_bike_id) on delete cascade
);

create index if not exists catalogue_units_model_idx
  on catalogue_units (store_id, master_bike_id);

-- One row per unit per calendar day. status is the official calendar token
-- (reservable, scheduled, store_close, setup_time, not_available_yet, or a
-- future token). can_start is false outside the 4-month pickup window.
create table if not exists catalogue_availability (
  unit_id    int not null references catalogue_units (unit_id) on delete cascade,
  day        date not null,
  status     text not null,
  can_start  boolean not null default false,
  primary key (unit_id, day)
);

create table if not exists catalogue_sync_runs (
  id                uuid primary key default gen_random_uuid(),
  started_at        timestamptz not null default now(),
  finished_at       timestamptz,
  status            text not null default 'running',
  scope             text not null default 'all',
  shops_ok          int not null default 0,
  shops_failed      int not null default 0,
  models            int not null default 0,
  units             int not null default 0,
  availability_rows int not null default 0,
  requests          int not null default 0,
  error_log         jsonb not null default '[]'::jsonb,
  message           text
);

create index if not exists catalogue_sync_runs_started_idx
  on catalogue_sync_runs (started_at desc);

drop trigger if exists catalogue_shops_set_updated_at on catalogue_shops;
create trigger catalogue_shops_set_updated_at
  before update on catalogue_shops
  for each row execute function set_updated_at();

drop trigger if exists catalogue_models_set_updated_at on catalogue_models;
create trigger catalogue_models_set_updated_at
  before update on catalogue_models
  for each row execute function set_updated_at();

drop trigger if exists catalogue_units_set_updated_at on catalogue_units;
create trigger catalogue_units_set_updated_at
  before update on catalogue_units
  for each row execute function set_updated_at();

alter table catalogue_shops enable row level security;
alter table catalogue_models enable row level security;
alter table catalogue_units enable row level security;
alter table catalogue_availability enable row level security;
alter table catalogue_sync_runs enable row level security;

-- No insert/update/delete policies: anon and authenticated cannot write.
-- The service role bypasses RLS and is the only writer.
drop policy if exists catalogue_shops_public_read on catalogue_shops;
create policy catalogue_shops_public_read
  on catalogue_shops for select
  to anon, authenticated
  using (active);

drop policy if exists catalogue_models_public_read on catalogue_models;
create policy catalogue_models_public_read
  on catalogue_models for select
  to anon, authenticated
  using (active);

drop policy if exists catalogue_units_public_read on catalogue_units;
create policy catalogue_units_public_read
  on catalogue_units for select
  to anon, authenticated
  using (active);

drop policy if exists catalogue_availability_public_read on catalogue_availability;
create policy catalogue_availability_public_read
  on catalogue_availability for select
  to anon, authenticated
  using (
    exists (
      select 1
      from catalogue_units u
      where u.unit_id = catalogue_availability.unit_id
        and u.active
    )
  );

-- Sync logs are operational. RLS with no policy hides them from the API.
revoke all on catalogue_sync_runs from anon, authenticated;
revoke insert, update, delete, truncate on catalogue_shops from anon, authenticated;
revoke insert, update, delete, truncate on catalogue_models from anon, authenticated;
revoke insert, update, delete, truncate on catalogue_units from anon, authenticated;
revoke insert, update, delete, truncate on catalogue_availability from anon, authenticated;
