import Link from "next/link";
import { listFeeItems } from "@/lib/reservations/items-store";
import FeeItemsEditor from "@/components/admin/FeeItemsEditor";

export const dynamic = "force-dynamic";

export default async function FeeItemsPage() {
  const items = await listFeeItems();

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">收費項目</h1>
          <p className="text-sm text-ink-muted">
            每個項目的售價（向客人收費）同成本，可即時修改；儲存後會套用到之後開的發票。
          </p>
        </div>
        <Link href="/admin/accounting" className="text-sm text-brand-700 hover:underline">
          會計 →
        </Link>
      </div>

      <FeeItemsEditor items={items} />
    </div>
  );
}
