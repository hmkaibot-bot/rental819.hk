-- Japan rebates 10% of the BASE BIKE RENTAL portion back to us, so the supplier
-- cost recorded on a booking (cost_jpy / cost_hkd, both imported from the master
-- Excel as the gross totals) overstates what we actually pay.
--
-- The Excel carries the rebate as its own column (e.g. 基本車租 ¥55,440 →
-- 回贈 -¥5,544). Store that amount here as a positive number; the accounting
-- module subtracts it to get the net cost. It is kept as an explicit figure
-- rather than derived as 10% of the catalogue rate because a third of the
-- historical bookings (multi-bike, packages, negotiated rates) don't match the
-- plain grade × duration calculation.
alter table reservations
  add column if not exists rebate_jpy numeric;

comment on column reservations.rebate_jpy is
  'Supplier rebate in JPY (10% of the base bike rental). Positive number; net cost = cost_jpy - rebate_jpy.';

notify pgrst, 'reload schema';
