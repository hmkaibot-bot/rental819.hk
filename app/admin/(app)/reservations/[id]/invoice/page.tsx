import Link from "next/link";
import { notFound } from "next/navigation";
import { getReservation } from "@/lib/reservations/store";
import { getCatalog } from "@/lib/reservations/items-store";
import { defaultInvoiceItems } from "@/lib/reservations/invoice";
import { getAdminLang } from "@/lib/admin/lang";
import { adminDict } from "@/lib/admin/i18n";
import { rt819GroupLabels } from "@/lib/reservations/items";
import InvoiceEditor from "@/components/admin/InvoiceEditor";

export const dynamic = "force-dynamic";

export default async function InvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const r = await getReservation(params.id);
  if (!r) notFound();
  const catalog = await getCatalog();
  const lang = getAdminLang();
  const t = adminDict(lang);

  return (
    <div>
      <div className="no-print mb-4">
        <Link href={`/admin/reservations/${r.id}`} className="text-sm text-brand-700 hover:underline">
          {t.invoice.backTo} {r.booking_ref}
        </Link>
        <h1 className="mt-1 text-xl font-bold">
          {t.invoice.title} — {r.name_en ?? r.name_zh}
        </h1>
        <p className="text-sm text-ink-muted">{t.invoice.intro}</p>
      </div>
      <InvoiceEditor
        reservation={r}
        seed={defaultInvoiceItems(r, catalog)}
        catalog={catalog}
        t={t.invoice}
        groupLabels={rt819GroupLabels(lang)}
      />
    </div>
  );
}
