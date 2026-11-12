-- Free and paid equipment fitted on each rental819.com unit.
-- NULL means this unit has not been scraped since the column was added
-- (the form then keeps every add-on selectable). An empty array means the
-- page was scraped and that list is empty.
-- Codes: topcase, sidebag, pannier, phone_holder, usb, usb_c, cigarette,
-- etc_reader, or raw:<official label> when the label is new.

alter table catalogue_units
  add column if not exists free_equipment text[],
  add column if not exists paid_equipment text[];

comment on column catalogue_units.free_equipment is
  'Equipment included with the bike. NULL = not synced yet. Codes, not display labels.';
comment on column catalogue_units.paid_equipment is
  'Paid equipment the bike can be rented with. NULL = not synced yet. Codes, not display labels.';
