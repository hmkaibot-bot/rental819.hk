import Link from "next/link";
import { listReservations } from "@/lib/reservations/store";
import { invoiceTotal } from "@/lib/reservations/invoice";
import { RT819_EXCHANGE_RATE } from "@/lib/reservations/items";
import { canWrite } from "@/lib/admin/auth";
import { getAdminLang } from "@/lib/admin/lang";
import { adminDict } from "@/lib/admin/i18n";
import { statusMeta, type Reservation } from "@/lib/reservations/types";
import AccountingTable, { type AcctRow } from "./AccountingTable";

export const dynamic = "force-dynamic";

// Post-SI states in the Excel pipeline (an SI/invoice exists): 待付款 + 已確認預定.
const BILLED = ["awaiting_payment", "confirmed"];
const EXCLUDED = ["cancelled"];

// Revenue = the in-app invoice total when there is one, otherwise the imported
// customer price (單價（港幣）) from the master Excel.
function revenue(r: Reservation) {
  const inv = invoiceTotal(r.invoice_items ?? []);
  return inv > 0 ? inv : Number(r.revenue_hkd) || 0;
}
/** Japan's 10% base-rental rebate, in yen (stored positive). */
function rebateJpy(r: Reservation) {
  return Number(r.rebate_jpy) || 0;
}

/**
 * Net supplier cost in HK$ — what we actually pay after Japan's rebate.
 *
 * The imported 單價成本（港元） is ALREADY net: the master Excel computes it as
 * (單價（日元） + 回贈) × rate with 回贈 held as a negative, so the rebate is
 * baked in. Deducting again would double-count it. (Confirmed against the sheet
 * formulas and across 136 imported bookings: net ¥ ÷ cost_hkd is a flat 20.882
 * with a 0.001 spread, whereas gross ¥ ÷ cost_hkd scatters by 0.074.)
 *
 * Only the fallback path needs the deduction: in-app bookings priced in yen have
 * no imported HK$ figure, and their cost_jpy is the gross total.
 */
function netCostHkd(r: Reservation) {
  if (r.cost_hkd != null) return Number(r.cost_hkd) || 0;
  const netJpy = (Number(r.cost_jpy) || 0) - rebateJpy(r);
  return netJpy * RT819_EXCHANGE_RATE;
}

export default async function AccountingPage() {
  const all = await listReservations();
  const readOnly = !canWrite();
  const lang = getAdminLang();
  const t = adminDict(lang);
  // A booking counts toward accounting once it is billed — an in-app pipeline
  // status, an SI number (imported historical bookings), or an in-app invoice —
  // and is never cancelled / no-response.
  const rows: AcctRow[] = all
    .filter(
      (r) =>
        !EXCLUDED.includes(r.status) &&
        (BILLED.includes(r.status) ||
          (r.si_number ?? "") !== "" ||
          (r.invoice_items?.length ?? 0) > 0),
    )
    .map((r) => {
      const m = statusMeta(r.status);
      return {
        id: r.id,
        booking_ref: r.booking_ref,
        name: r.name_en ?? r.name_zh ?? "—",
        si_number: r.si_number,
        status_label: lang === "ja" ? m.ja : m.zh,
        status_tone: m.tone,
        pickup_date: r.pickup_date,
        return_date: r.return_date,
        revenue: revenue(r),
        cost_jpy: r.cost_jpy == null ? null : Number(r.cost_jpy) - rebateJpy(r),
        rebate_jpy: rebateJpy(r),
        cost_hkd: netCostHkd(r),
        paid_to_supplier: r.paid_to_supplier,
        supplier_paid_date: r.supplier_paid_date,
      };
    });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">{t.accounting.title}</h1>
        <Link href="/admin" className="text-sm text-brand-700 hover:underline">
          {t.accounting.toReservations}
        </Link>
      </div>
      <AccountingTable rows={rows} t={t.accounting} readOnly={readOnly} />
    </div>
  );
}
