-- 收款渠道 for the customer payment (picked next to 客人付款日期).
-- Free text at the column level; the UI offers a fixed dropdown (LIVI / AW /
-- BOC MAC) and keeps any legacy value selectable.
alter table reservations add column if not exists payment_channel text;
