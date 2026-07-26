-- Accounting: imported historical financials + editable fee-item registry.

-- Per-reservation figures carried over from the master Excel (customer price
-- and the real HK$ cost), so the accounting module shows revenue/profit for
-- historical bookings that have no in-app invoice.
alter table reservations
  add column if not exists revenue_hkd numeric,   -- 單價（港幣） customer price
  add column if not exists cost_hkd    numeric;   -- 單價成本（港元） real HK$ cost

-- Editable fee/charge catalogue (售價 + 成本). Seeded from the RT819 item list;
-- staff can adjust unit price and cost, and invoices read prices from here.
create table if not exists fee_items (
  id         uuid primary key default gen_random_uuid(),
  code       text unique not null,
  grp        text not null,              -- bike/insurance/mamoride/helmet/case/hk/other
  desc_en    text not null,
  desc_zh    text,
  unit_price numeric not null default 0, -- 售價 (HK$, charged to customer)
  cost_hkd   numeric not null default 0, -- 成本 (HK$)
  yen_cost   numeric not null default 0, -- 成本 (¥, supplier)
  sort       int not null default 0,
  active     boolean not null default true,
  updated_at timestamptz not null default now()
);

create trigger fee_items_set_updated_at
  before update on fee_items
  for each row execute function set_updated_at();

alter table fee_items enable row level security;

insert into fee_items (code, grp, desc_en, desc_zh, unit_price, cost_hkd, yen_cost, sort) values
  ('RT819-HM-1D','helmet','RENTAL 819 HELMET RENT 1ST DAY','首天費用',60,55,1100,0),
  ('RT819-HM-2D','helmet','RENTAL 819 HELMET RENT DAY','第二天或以後每天費用',10,11,220,1),
  ('RT819-INS-P1P2-1D','insurance','RENTAL 819 INSURANCE P1 P2 CLASS 1ST DAY','首天費用',85,77,1540,2),
  ('RT819-INS-P1P2-2D','insurance','RENTAL 819 INSURANCE P1 P2 CLASS DAY','第二天或以後每天費用',50,44,880,3),
  ('RT819-INS-P3-1D','insurance','RENTAL 819 INSURANCE P3 CLASS 1ST DAY','首天費用',140,126.5,2530,4),
  ('RT819-INS-P3-2D','insurance','RENTAL 819 INSURANCE P3 CLASS DAY','第二天或以後每天費用',75,66,1320,5),
  ('RT819-INS-P4-1D','insurance','RENTAL 819 INSURANCE P4 CLASS 1ST DAY','首天費用',195,176,3520,6),
  ('RT819-INS-P4-2D','insurance','RENTAL 819 INSURANCE P4 CLASS DAY','第二天或以後每天費用',105,93.5,1870,7),
  ('RT819-INS-P5-1D','insurance','RENTAL 819 INSURANCE P5 CLASS 1ST DAY','首天費用',195,176,3520,8),
  ('RT819-INS-P5-2D','insurance','RENTAL 819 INSURANCE P5 CLASS DAY','第二天或以後每天費用',105,93.5,1870,9),
  ('RT819-INS-P6-1D','insurance','RENTAL 819 INSURANCE P6 CLASS 1ST DAY','首天費用',215,192.5,3850,10),
  ('RT819-INS-P6-2D','insurance','RENTAL 819 INSURANCE P6 CLASS DAY','第二天或以後每天費用',115,104.5,2090,11),
  ('RT819-INS-P7-1D','insurance','RENTAL 819 INSURANCE P7 CLASS 1ST DAY','首天費用',245,220,4400,12),
  ('RT819-INS-P7-2D','insurance','RENTAL 819 INSURANCE P7 CLASS DAY','第二天或以後每天費用',130,115.5,2310,13),
  ('RT819-MAMO-P1P2-1D','mamoride','RENTAL 819 MAMO RIDE P1P2 CLASS 1ST DAY','首天費用',110,100,2000,14),
  ('RT819-MAMO-P1P2-2D','mamoride','RENTAL 819 MAMO RIDE P1P2 CLASS DAY','第二天或以後每天費用',40,32.5,650,15),
  ('RT819-MAMO-P3-1D','mamoride','RENTAL 819 MAMO RIDE P3 CLASS 1ST DAY','首天費用',150,135,2700,16),
  ('RT819-MAMO-P3-2D','mamoride','RENTAL 819 MAMO RIDE P3 CLASS DAY','第二天或以後每天費用',55,50,1000,17),
  ('RT819-MAMO-P4P5-1D','mamoride','RENTAL 819 MAMO RIDE P4P5 CLASS 1ST DAY','首天費用',160,145,2900,18),
  ('RT819-MAMO-P4P5-2D','mamoride','RENTAL 819 MAMO RIDE P4P5 CLASS DAY','第二天或以後每天費用',65,55,1100,19),
  ('RT819-MAMO-P6-1D','mamoride','RENTAL 819 MAMO RIDE P6 CLASS 1ST DAY','首天費用',175,155,3100,20),
  ('RT819-MAMO-P6-2D','mamoride','RENTAL 819 MAMO RIDE P6 CLASS DAY','第二天或以後每天費用',70,60,1200,21),
  ('RT819-MAMO-P7-1D','mamoride','RENTAL 819 MAMO RIDE P7 CLASS 1ST DAY','首天費用',185,165,3300,22),
  ('RT819-MAMO-P7-2D','mamoride','RENTAL 819 MAMO RIDE P7 CLASS DAY','第二天或以後每天費用',75,65,1300,23),
  ('RT819-P1-1D','bike','RENTAL 819 BIKE RENT P1 CLASS 1ST DAY','首天費用',295,237.6,5280,24),
  ('RT819-P1-2D','bike','RENTAL 819 BIKE RENT P1 CLASS DAY','第二天或以後每天費用',195,158.4,3520,25),
  ('RT819-P1-4H','bike','RENTAL 819 BIKE RENT P1 CLASS 4 HOURS','4小時',220,178.2,3960,26),
  ('RT819-P1-8H','bike','RENTAL 819 BIKE RENT P1 CLASS 8 HOURS','8小時',245,198,4400,27),
  ('RT819-P2-1D','bike','RENTAL 819 BIKE RENT P2 CLASS 1ST DAY','首天費用',440,356.4,7920,28),
  ('RT819-P2-2D','bike','RENTAL 819 BIKE RENT P2 CLASS DAY','第二天或以後每天費用',295,237.6,5280,29),
  ('RT819-P2-4H','bike','RENTAL 819 BIKE RENT P2 CLASS 4 HOURS','4小時',330,267.3,5940,30),
  ('RT819-P2-8H','bike','RENTAL 819 BIKE RENT P2 CLASS 8 HOURS','8小時',365,297,6600,31),
  ('RT819-P3-1D','bike','RENTAL 819 BIKE RENT P3 CLASS 1ST DAY','首天費用',810,653.4,14520,32),
  ('RT819-P3-2D','bike','RENTAL 819 BIKE RENT P3 CLASS DAY','第二天或以後每天費用',540,435.6,9680,33),
  ('RT819-P3-4H','bike','RENTAL 819 BIKE RENT P3 CLASS 4 HOURS','4小時',605,490.05,10890,34),
  ('RT819-P3-8H','bike','RENTAL 819 BIKE RENT P3 CLASS 8 HOURS','8小時',675,544.5,12100,35),
  ('RT819-P4-1D','bike','RENTAL 819 BIKE RENT P4 CLASS 1ST DAY','首天費用',1030,831.6,18480,36),
  ('RT819-P4-2D','bike','RENTAL 819 BIKE RENT P4 CLASS DAY','第二天或以後每天費用',685,554.4,12320,37),
  ('RT819-P4-4H','bike','RENTAL 819 BIKE RENT P4 CLASS 4 HOURS','4小時',770,623.7,13860,38),
  ('RT819-P4-8H','bike','RENTAL 819 BIKE RENT P4 CLASS 8 HOURS','8小時',855,693,15400,39),
  ('RT819-P5-1D','bike','RENTAL 819 BIKE RENT P5 CLASS 1ST DAY','首天費用',1175,950.4,21120,40),
  ('RT819-P5-2D','bike','RENTAL 819 BIKE RENT P5 CLASS DAY','第二天或以後每天費用',785,633.6,14080,41),
  ('RT819-P5-4H','bike','RENTAL 819 BIKE RENT P5 CLASS 4 HOURS','4小時',880,712.8,15840,42),
  ('RT819-P5-8H','bike','RENTAL 819 BIKE RENT P5 CLASS 8 HOURS','8小時',980,792,17600,43),
  ('RT819-P6-1D','bike','RENTAL 819 BIKE RENT P6 CLASS 1ST DAY','首天費用',1320,1069.2,23760,44),
  ('RT819-P6-2D','bike','RENTAL 819 BIKE RENT P6 CLASS DAY','第二天或以後每天費用',880,712.8,15840,45),
  ('RT819-P6-4H','bike','RENTAL 819 BIKE RENT P6 CLASS 4 HOURS','4小時',990,801.9,17820,46),
  ('RT819-P6-8H','bike','RENTAL 819 BIKE RENT P6 CLASS 8 HOURS','8小時',1100,891,19800,47),
  ('RT819-P7-1D','bike','RENTAL 819 BIKE RENT P7 CLASS 1ST DAY','首天費用',1765,1425.6,31680,48),
  ('RT819-P7-2D','bike','RENTAL 819 BIKE RENT P7 CLASS DAY','第二天或以後每天費用',1175,950.4,21120,49),
  ('RT819-P7-4H','bike','RENTAL 819 BIKE RENT P7 CLASS 4 HOURS','4小時',1320,1069.2,23760,50),
  ('RT819-P7-8H','bike','RENTAL 819 BIKE RENT P7 CLASS 8 HOURS','8小時',1470,1188,26400,51),
  ('RT819-PH','other','RENTAL 819 PHONE MOUNT RENT',NULL,0,0,0,52),
  ('RT819-SB-1D','case','RENTAL 819 SIDE BAG RENT 1ST DAY','首天費用',60,55,1100,53),
  ('RT819-SB-2D','case','RENTAL 819 SIDE BAG RENT DAY','第二天或以後每天費用',10,11,220,54),
  ('RT819-SC-1D','case','RENTAL 819 SIDE CASE RENT 1ST DAY','首天費用',90,82.5,1650,55),
  ('RT819-SC-2D','case','RENTAL 819 SIDE CASE RENT DAY','第二天或以後每天費用',20,16.5,330,56),
  ('RT819-TC-1D','case','RENTAL 819 TOP CASE RENT 1ST DAY','首天費用',90,82.5,1650,57),
  ('RT819-TC-2D','case','RENTAL 819 TOP CASE RENT DAY','第二天或以後每天費用',20,16.5,330,58),
  ('HK-CARDO','hk','CARDO PACKTALK BOLD INTERCOM RENTAL','對講機租賃',200,0,0,59)
on conflict (code) do nothing;
