-- Supplier cost is entered per line item, not as one lump sum, so the admin
-- mirrors the master Excel's cost columns (基本車租 / 保險 / MAMO RIDE / 頭盔 /
-- 尾箱 / 側袋 / 側箱 / ETC). cost_jpy stays the gross total of those items —
-- the Excel's 單價（日元） likewise excludes the rebate — and rebate_jpy is
-- always 10% of the base bike rental, per Rental819's agreement.
alter table reservations
  add column if not exists cost_items jsonb not null default '{}'::jsonb;

comment on column reservations.cost_items is
  'Per-item supplier cost in JPY: {base_rental, insurance, mamoride, helmet, topcase, sidebag, pannier, etc}. cost_jpy = sum; rebate_jpy = base_rental * 0.1.';

notify pgrst, 'reload schema';
