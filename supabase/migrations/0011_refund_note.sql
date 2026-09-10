-- Free-text note entered when recording a refund (reason, amount detail,
-- reference number — whatever the operator wants to remember).
alter table reservations add column if not exists refund_note text;
