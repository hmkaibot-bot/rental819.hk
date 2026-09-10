-- Refund record for cancelled bookings: when the money went back and through
-- which channel. Mirrors customer_paid_date / payment_channel — free text at
-- the column level, a fixed dropdown (PAYMENT_CHANNELS) in the UI.
alter table reservations
  add column if not exists refund_date date,
  add column if not exists refund_channel text;
