-- Rental819 HK — rental reservation pipeline
-- Models the "2026 FIT" reservation tracker (replaces the manual Excel + email flow).

create type reservation_status as enum (
  'new',               -- 新預約 (form submitted)
  'sent_to_jp',        -- 已向日本 Rental819 發出預約
  'confirmed',         -- 日本已確認 (confirmed_bike filled)
  'invoiced',          -- 已開單 (si_number filled)
  'paid',              -- 客人已付款
  'customer_confirmed',-- 已發客人確認信
  'settled',           -- 日本月結已對帳
  'cancelled',         -- 已取消
  'no_response'        -- 客人無反應
);

create table if not exists reservations (
  id                uuid primary key default gen_random_uuid(),
  booking_ref       text unique,                    -- 預約編號 e.g. 2026-047
  status            reservation_status not null default 'new',
  request_date      date not null default (now() at time zone 'Asia/Hong_Kong')::date, -- 提交日期

  -- Customer 客人資料
  name_zh           text,                           -- 中文姓名
  name_en           text,                           -- 英文姓名
  gender            text,                           -- 性別
  dob               date,                           -- 出生年月日
  email             text,                           -- 電郵
  hk_phone          text,                           -- 香港聯絡電話
  hk_address        text,                           -- 原國籍居住地址
  jp_address        text,                           -- 日本住宿地址
  jp_phone          text,                           -- 日本手提電話
  japanese_ability  text,                           -- 日語能力
  english_ability   text,                           -- 英語能力
  emergency_contact text,                           -- 緊急聯絡人
  emergency_phone   text,                           -- 緊急聯絡人號碼

  -- Rental 租車詳情
  shop              text,                           -- 出發店
  bike_pref_1       text,                           -- 首選
  bike_pref_2       text,                           -- 次選
  bike_pref_3       text,                           -- 第三選
  confirmed_bike    text,                           -- 確認車款 (from JP)
  pickup_date       date,
  pickup_time       time,
  return_date       date,
  return_time       time,
  addons            jsonb not null default '{}'::jsonb, -- CARDO/尾箱/側袋/側箱/頭盔/MamoRide/ETC/穿梭巴士/行李寄存…
  promo             text,                           -- 優惠

  -- Billing & settlement 單據與月結
  si_number         text,                           -- Business Central 單號
  customer_paid_date date,                          -- 客人付款日期
  paid_to_supplier  boolean not null default false, -- 向供應商付款
  supplier_paid_date date,                          -- 向供應商付款日期
  cost_jpy          numeric,                        -- 日本成本價 (¥)
  settlement        jsonb not null default '{}'::jsonb, -- margin / 折扣 / 保險 明細

  notes             text,
  source            text default 'website',         -- website / manual
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists reservations_status_idx on reservations (status);
create index if not exists reservations_pickup_idx on reservations (pickup_date);
create index if not exists reservations_request_idx on reservations (request_date desc);

-- keep updated_at fresh
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger reservations_set_updated_at
  before update on reservations
  for each row execute function set_updated_at();

-- RLS: locked down. All access goes through server-side code using the
-- service-role key (admin backend); no direct client access.
alter table reservations enable row level security;

-- Auto-number booking_ref as YYYY-NNN per calendar year when not supplied.
create or replace function assign_booking_ref() returns trigger as $$
declare
  yr text := to_char((now() at time zone 'Asia/Hong_Kong'), 'YYYY');
  seq int;
begin
  if new.booking_ref is null or new.booking_ref = '' then
    select coalesce(max(split_part(booking_ref, '-', 2)::int), 0) + 1
      into seq
      from reservations
      where booking_ref like yr || '-%';
    new.booking_ref := yr || '-' || lpad(seq::text, 3, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create trigger reservations_assign_ref
  before insert on reservations
  for each row execute function assign_booking_ref();
