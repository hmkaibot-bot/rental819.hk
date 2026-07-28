-- Align reservation_status with the master Excel 狀態 dropdown (data-validation list).
-- The customer-facing pipeline has exactly seven states, in this order:
--   未處理 / 已通知日本 / 待SI / 待付款 / 已確認預定 / 變更溝通中 / 顧客無反應·已取消
-- The previous enum carried finer accounting-derived states (invoiced/paid/settled…)
-- that never existed in the Excel; those concerns now live in the SI number, the
-- customer-paid date and the supplier-paid columns instead of the status.

alter table reservations alter column status drop default;
alter table reservations alter column status type text using status::text;

-- Remap any pre-existing rows onto the new vocabulary.
update reservations set status = case status
  when 'sent_to_jp'         then 'notified_jp'
  when 'invoiced'           then 'awaiting_payment' -- SI issued, awaiting customer payment
  when 'paid'               then 'confirmed'        -- customer paid = 已確認預定
  when 'customer_confirmed' then 'confirmed'
  when 'settled'            then 'confirmed'        -- supplier settlement tracked separately
  when 'no_response'        then 'cancelled'
  else status
end;

drop type reservation_status;
create type reservation_status as enum (
  'new',              -- 未處理
  'notified_jp',      -- 已通知日本
  'awaiting_si',      -- 待SI
  'awaiting_payment', -- 待付款
  'confirmed',        -- 已確認預定
  'change_pending',   -- 變更溝通中
  'cancelled'         -- 顧客無反應/已取消
);

alter table reservations
  alter column status type reservation_status using status::reservation_status,
  alter column status set default 'new';
