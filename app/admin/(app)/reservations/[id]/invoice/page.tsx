import Link from "next/link";
import { notFound } from "next/navigation";
import { getReservation } from "@/lib/reservations/store";
import { defaultInvoiceItems } from "@/lib/reservations/invoice";
import InvoiceEditor from "@/components/admin/InvoiceEditor";

export const dynamic = "force-dynamic";

export default async function InvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const r = await getReservation(params.id);
  if (!r) notFound();

  return (
    <div>
      <div className="no-print mb-4">
        <Link href={`/admin/reservations/${r.id}`} className="text-sm text-brand-700 hover:underline">
          ← 返回預約 {r.booking_ref}
        </Link>
        <h1 className="mt-1 text-xl font-bold">開單 — {r.name_en ?? r.name_zh}</h1>
        <p className="text-sm text-ink-muted">
          填入項目與金額，儲存後可列印或儲存為 PDF 發給客人。
        </p>
      </div>
      <InvoiceEditor reservation={r} seed={defaultInvoiceItems(r)} />
    </div>
  );
}
