"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import type { Reservation, InvoiceItem } from "@/lib/reservations/types";
import {
  ISSUER,
  BANKS,
  fmtAmount,
  invoiceTotal,
  invoiceInfoRows,
  autoSiNumber,
  readInvoiceDiscount,
  invoiceDiscountAmount,
  invoiceDiscountBadge,
  type DiscountMode,
} from "@/lib/reservations/invoice";
import {
  RT819_ITEMS,
  RT819_GROUP_LABELS,
  rt819Label,
  type Rt819Item,
} from "@/lib/reservations/items";
import type { AdminDict } from "@/lib/admin/i18n";
import { saveInvoice } from "@/app/admin/(app)/reservations/[id]/invoice/actions";

const GROUP_ORDER: Rt819Item["group"][] = [
  "bike",
  "insurance",
  "mamoride",
  "helmet",
  "case",
  "hk",
  "other",
];

export default function InvoiceEditor({
  reservation,
  seed,
  catalog = RT819_ITEMS,
  t,
  groupLabels = RT819_GROUP_LABELS,
  readOnly = false,
}: {
  reservation: Reservation;
  seed: InvoiceItem[];
  catalog?: Rt819Item[];
  t: AdminDict["invoice"];
  groupLabels?: Record<Rt819Item["group"], string>;
  readOnly?: boolean;
}) {
  const r = reservation;
  const settlement = (r.settlement ?? {}) as Record<string, unknown>;
  const [si, setSi] = useState(autoSiNumber(r));
  const [date, setDate] = useState(r.invoice_date ?? new Date().toISOString().slice(0, 10));
  const [paymentDate, setPaymentDate] = useState(
    (settlement.invoice_payment_date as string) ?? "",
  );
  const [deposit, setDeposit] = useState<number>(
    Number(settlement.invoice_deposit ?? 0) || 0,
  );
  const savedDiscount = readInvoiceDiscount(settlement);
  const [discountMode, setDiscountMode] = useState<DiscountMode>(savedDiscount.mode);
  const [discountValue, setDiscountValue] = useState<number>(savedDiscount.value);
  const [items, setItems] = useState<InvoiceItem[]>(
    r.invoice_items?.length ? r.invoice_items : seed,
  );
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  const subtotal = useMemo(() => invoiceTotal(items), [items]);
  const discount = useMemo(
    () => invoiceDiscountAmount(subtotal, { mode: discountMode, value: discountValue }),
    [subtotal, discountMode, discountValue],
  );
  const discountBadge = invoiceDiscountBadge({ mode: discountMode, value: discountValue });
  // Discount comes off the price; the deposit comes off what is still owed. Both
  // are floored at zero so a mistyped rate can never print a negative balance.
  const netTotal = Math.max(0, subtotal - discount);
  const remaintance = Math.max(0, netTotal - (Number(deposit) || 0));
  const infoRows = invoiceInfoRows(r);

  const update = (i: number, patch: Partial<InvoiceItem>) =>
    setItems((prev) =>
      prev.map((it, idx) => {
        if (idx !== i) return it;
        const next = { ...it, ...patch };
        next.amount = Number((Number(next.qty) * Number(next.unit_price)).toFixed(2));
        return next;
      }),
    );

  const addRow = () =>
    setItems((prev) => [...prev, { description: "", qty: 1, unit_price: 0, amount: 0 }]);
  const removeRow = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const addCatalogItem = (code: string) => {
    const it = catalog.find((x) => x.code === code);
    if (!it) return;
    setItems((prev) => [
      ...prev,
      {
        description: rt819Label(it),
        qty: 1,
        unit_price: it.unit_price,
        amount: it.unit_price,
      },
    ]);
  };

  const save = (markInvoiced: boolean) =>
    start(async () => {
      await saveInvoice({
        id: r.id,
        si_number: si || null,
        invoice_date: date || null,
        invoice_items: items,
        settlement: {
          ...settlement,
          invoice_payment_date: paymentDate || null,
          invoice_deposit: Number(deposit) || 0,
          invoice_discount_mode: discountMode,
          invoice_discount_value: Number(discountValue) || 0,
        },
        markInvoiced,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });

  const cell = "rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500";

  return (
    <div>
      {/* ---- Editor (hidden when printing) ---- */}
      <div className="no-print mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        {/* A read-only session can still read and print the invoice, but every
            field is inert — leaving them live would let someone type a whole
            invoice that vanishes with no error. */}
        <fieldset disabled={readOnly} className="contents">
        <div className="grid gap-3 sm:grid-cols-4">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink-soft">{t.siNo}</span>
            <input value={si} onChange={(e) => setSi(e.target.value)} placeholder="SI-26-xxxxx" className={`${cell} w-full`} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink-soft">{t.date}</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${cell} w-full`} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink-soft">{t.paymentDate}</span>
            <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className={`${cell} w-full`} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink-soft">{t.deposit}</span>
            <input type="number" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} className={`${cell} w-full`} />
          </label>
          {/* Discount spans two columns so the mode picker and the number sit on
              one line, with the resolved HK$ shown live underneath — whichever
              convention the agent typed, they see the money before saving. */}
          <div className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium text-ink-soft">{t.discount}</span>
            <div className="flex gap-2">
              <select
                aria-label={t.discountMode}
                value={discountMode}
                onChange={(e) => setDiscountMode(e.target.value as DiscountMode)}
                className={`${cell} min-w-0 flex-1`}
              >
                <option value="percent">{t.discountPercent}</option>
                <option value="rate">{t.discountRate}</option>
                <option value="amount">{t.discountAmount}</option>
              </select>
              <input
                type="number"
                min={0}
                step="0.01"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className={`${cell} w-24 shrink-0`}
              />
            </div>
            <span className="mt-1 block text-xs text-ink-muted">
              {discount > 0
                ? `${t.discountOff} −HK$${fmtAmount(discount)}${discountBadge ? ` (${discountBadge})` : ""}`
                : t.discountHint}
            </span>
          </div>
        </div>

        {/* Item picker from the RT819 catalog */}
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-ink-soft">
            {t.fromCatalog}
          </label>
          <select
            className={`${cell} w-full sm:max-w-md`}
            value=""
            onChange={(e) => {
              if (e.target.value) addCatalogItem(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">{t.pickItem}</option>
            {GROUP_ORDER.map((g) => (
              <optgroup key={g} label={groupLabels[g]}>
                {catalog.filter((it) => it.group === g).map((it) => (
                  <option key={it.code} value={it.code}>
                    {rt819Label(it)} — HK${it.unit_price}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="py-1 pr-2">{t.colDesc}</th>
                <th className="w-28 py-1 px-2">{t.colUnitPrice}</th>
                <th className="w-16 py-1 px-2">{t.colQty}</th>
                <th className="w-28 py-1 px-2 text-right">{t.colAmount}</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td className="py-1 pr-2">
                    <input value={it.description} onChange={(e) => update(i, { description: e.target.value })} className={`${cell} w-full`} />
                  </td>
                  <td className="py-1 px-2">
                    <input type="number" value={it.unit_price} onChange={(e) => update(i, { unit_price: Number(e.target.value) })} className={`${cell} w-full`} />
                  </td>
                  <td className="py-1 px-2">
                    <input type="number" value={it.qty} onChange={(e) => update(i, { qty: Number(e.target.value) })} className={`${cell} w-full`} />
                  </td>
                  <td className="py-1 px-2 text-right font-medium">{fmtAmount(it.amount)}</td>
                  <td className="py-1 text-center">
                    <button onClick={() => removeRow(i)} className="text-slate-400 hover:text-rose-600" aria-label={t.deleteAria}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button onClick={addRow} className="text-sm font-medium text-brand-700 hover:underline">{t.addRow}</button>
          <div className="text-right">
            {discount > 0 && (
              <div className="text-xs text-ink-muted">
                {t.subtotal} HK${fmtAmount(subtotal)}
                <span className="ml-2 text-rose-600">
                  {t.discountOff} −HK${fmtAmount(discount)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <span className="text-sm text-ink-muted">{t.total}</span>
              <span className="text-lg font-black text-ink">HK${fmtAmount(remaintance)}</span>
            </div>
          </div>
        </div>

        </fieldset>

        <div className="mt-4 flex flex-wrap gap-2">
          {!readOnly && (
            <>
              <button onClick={() => save(true)} disabled={pending} className="btn-primary text-sm disabled:opacity-60">
                {pending ? t.saving : saved ? t.savedOk : t.saveAndInvoice}
              </button>
              <button onClick={() => save(false)} disabled={pending} className="btn-outline text-sm">
                {t.saveOnly}
              </button>
            </>
          )}
          {/* Printing is read-only and stays available to everyone. */}
          <button onClick={() => window.print()} className="btn-brand text-sm">
            {t.print}
          </button>
        </div>
      </div>

      {/* ---- Print-ready invoice (matches the SI-24 template) ---- */}
      <div className="print-area mx-auto max-w-[820px] bg-white p-8 text-ink shadow-card print:max-w-none print:p-0 print:shadow-none">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-3xl font-black">Invoice</div>
            <div className="text-2xl font-bold">發票</div>
          </div>
          <Image src={ISSUER.logo} alt="HELMET KING" width={1182} height={425} className="h-16 w-auto" />
        </div>

        {/* Address */}
        <div className="mt-6">
          <div className="border-b-2 border-ink pb-1 text-sm font-bold">ADDRESS 地址</div>
          <div className="mt-2 text-sm leading-6 text-ink-soft">
            <div>{ISSUER.name}</div>
            {ISSUER.addressLines.map((l) => (
              <div key={l}>{l}</div>
            ))}
            <div>{ISSUER.email}</div>
          </div>
        </div>

        {/* Bill to + date/no */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <div className="border-b-2 border-ink pb-1 text-sm font-bold">BILL TO 發票資料</div>
            <table className="mt-2 text-sm">
              <tbody>
                <tr>
                  <td className="py-1 pr-4 font-semibold">CUSTOMER 客戶名稱：</td>
                  <td className="py-1">{r.name_en ?? r.name_zh ?? "—"}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-semibold">CONTACT 聯絡電話：</td>
                  <td className="py-1">{r.hk_phone ?? "—"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="self-start">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 pr-4 font-bold">DATE 日期</td>
                  <td className="py-1.5 text-right">{date || "—"}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 pr-4 font-bold">INVOICE NO. 發票號碼</td>
                  <td className="py-1.5 text-right">{si || "—"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Line items */}
        <table className="mt-8 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-500 text-white">
              <th className="px-3 py-2 text-center font-bold">DESCRIPTION<br />貨品</th>
              <th className="w-28 px-3 py-2 text-center font-bold">UNIT PRICE<br />單價</th>
              <th className="w-24 px-3 py-2 text-center font-bold">QUANTITY<br />數量</th>
              <th className="w-28 px-3 py-2 text-center font-bold">TOTAL<br />總額</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b border-slate-200">
                <td className="px-3 py-1.5">{it.description || "—"}</td>
                <td className="px-3 py-1.5 text-right">{fmtAmount(it.unit_price)}</td>
                <td className="px-3 py-1.5 text-right">{fmtAmount(it.qty)}</td>
                <td className="px-3 py-1.5 text-right">{fmtAmount(it.amount)}</td>
              </tr>
            ))}
            {infoRows.map((row, i) => (
              <tr key={`info-${i}`} className="border-b border-slate-100">
                <td className="whitespace-pre-wrap px-3 py-1.5 text-ink-soft">{row}</td>
                <td /><td /><td />
              </tr>
            ))}
          </tbody>
        </table>

        {/* Payment instruction + totals */}
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div className="text-xs leading-5 text-ink-soft">
            <div className="mb-2 text-sm font-bold underline">
              REMARK/ PAYMENT INSTRUCTION 備註/付款指示
            </div>
            {[BANKS.hk, BANKS.macau].map((bank) => (
              <div key={bank.label} className="mt-3">
                <div className="font-semibold underline">{bank.label}</div>
                <table className="mt-1">
                  <tbody>
                    {bank.lines.map(([k, v]) => (
                      <tr key={k}>
                        <td className="py-0.5 pr-3 align-top">{k}</td>
                        <td className="py-0.5 font-medium">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="text-sm">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 pr-4 text-right font-bold">PAYMENT DATE 付款日期</td>
                  <td className="py-1.5 text-right">{paymentDate || "—"}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 pr-4 text-right font-bold">SUBTOTAL 小計</td>
                  <td className="py-1.5 text-right">{fmtAmount(subtotal)}</td>
                </tr>
                {discount > 0 && (
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 pr-4 text-right font-bold">
                      DISCOUNT 折扣{discountBadge ? ` (${discountBadge})` : ""}
                    </td>
                    <td className="py-1.5 text-right">-{fmtAmount(discount)}</td>
                  </tr>
                )}
                {(Number(deposit) || 0) > 0 && (
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 pr-4 text-right font-bold">DEPOSIT 訂金</td>
                    <td className="py-1.5 text-right">-{fmtAmount(deposit)}</td>
                  </tr>
                )}
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 pr-4 text-right font-bold">REMAINTANCE 餘數</td>
                  <td className="py-1.5 text-right">{fmtAmount(remaintance)}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-right text-base font-black">BALANCE DUE (HKD) 總額(港幣)</td>
                  <td className="py-2 text-right text-base font-black">{fmtAmount(remaintance)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-8 text-center text-base font-bold">SIGN 客戶簽署</div>
            <div className="mt-8 border-t border-ink" />
          </div>
        </div>
      </div>
    </div>
  );
}
