-- Standalone CARDO intercom rentals: a Hong Kong-side booking with no Japan
-- bike component. Flagged, not a separate table, so the invoice, the CARDO
-- terms page and accounting keep working off reservations unchanged.
alter table reservations add column if not exists cardo_only boolean not null default false;
