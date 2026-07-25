-- In-app SI invoice fields (replaces external Business Central invoicing).
alter table reservations
  add column if not exists invoice_date date,
  add column if not exists invoice_items jsonb not null default '[]'::jsonb; -- [{description, qty, unit_price, amount}]
