-- Convert reservations.status from a Postgres enum to a plain text column with
-- a CHECK constraint.
--
-- Why: migration 0004 dropped and recreated the reservation_status enum type,
-- which churned its OID. PostgREST caches enum type OIDs; after the recreate it
-- could no longer serialise the column over the REST API, so `select=*` returned
-- the status as null. In the app statusMeta(null) falls back to the first state,
-- which made every booking render as 未處理 (and looked like the data had reset
-- on every navigation). Direct SQL was unaffected, which is why the DB looked
-- correct while the UI did not.
--
-- A text column with a CHECK constraint serialises reliably through PostgREST,
-- and the application already treats status as a string union, so this is
-- transparent to the code.
alter table reservations alter column status drop default;
alter table reservations alter column status type text using status::text;
alter table reservations alter column status set default 'new';
alter table reservations add constraint reservations_status_check
  check (status in ('new','notified_jp','awaiting_si','awaiting_payment','confirmed','change_pending','cancelled'));
drop type if exists reservation_status;

notify pgrst, 'reload schema';
