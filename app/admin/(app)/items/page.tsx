import Link from "next/link";
import { listFeeItems } from "@/lib/reservations/items-store";
import { getAdminLang } from "@/lib/admin/lang";
import { adminDict } from "@/lib/admin/i18n";
import { rt819GroupLabels } from "@/lib/reservations/items";
import FeeItemsEditor from "@/components/admin/FeeItemsEditor";

export const dynamic = "force-dynamic";

export default async function FeeItemsPage() {
  const items = await listFeeItems();
  const lang = getAdminLang();
  const t = adminDict(lang);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{t.items.title}</h1>
          <p className="text-sm text-ink-muted">{t.items.intro}</p>
        </div>
        <Link href="/admin/accounting" className="text-sm text-brand-700 hover:underline">
          {t.items.toAccounting}
        </Link>
      </div>

      <FeeItemsEditor items={items} t={t.items} groupLabels={rt819GroupLabels(lang)} />
    </div>
  );
}
