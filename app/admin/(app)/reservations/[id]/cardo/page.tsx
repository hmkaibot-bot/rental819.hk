import Link from "next/link";
import { notFound } from "next/navigation";
import { getReservation } from "@/lib/reservations/store";
import { getAdminDict } from "@/lib/admin/lang";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

const CLAUSES: { n: string; title: string; body: string }[] = [
  { n: "1", title: "出租方 / 地址", body: "出租方：頭盔王\n地址：旺角東安街 43 號地舖" },
  { n: "2", title: "租賃內容", body: "租賃物品：Cardo Packtalk Bold 主機、喇叭、麥克風；免費安裝及拆卸服務。" },
  { n: "4", title: "租金及付款", body: "租金：HKD 200。\n付款方式：FPS 轉數快登記電話：63858830（MOTOBLOG LIMITED）。" },
  { n: "5", title: "借用與歸還", body: "承租方可於租賃期開始前 7 天內向 Helmet King 借用；並須於租賃期結束後 7 天內歸還至旺角東安街 43 號地舖。" },
  { n: "6", title: "逾期費用", body: "如逾期歸還，每日收取 HKD 200。" },
  { n: "7", title: "使用與保管", body: "承租方須妥善保管租賃物品，並不得自行改裝或不當使用。" },
  { n: "8", title: "損壞賠償", body: "如租賃物品於租賃期間因承租方原因造成損壞／遺失／無法使用，承租方須支付補償 HKD 1,000。（正常耗損：視為不屬損壞／需以店方判定為準。）" },
];

export default async function CardoTerms({ params }: { params: { id: string } }) {
  const r = await getReservation(params.id);
  if (!r) notFound();
  // Only the chrome follows the admin language — the terms themselves are the
  // Chinese contract the Hong Kong customer signs, so they are never translated.
  const t = getAdminDict();

  const from = r.pickup_date ?? "____年____月____日";
  const to = r.return_date ?? "____年____月____日";
  const name = r.name_en ?? r.name_zh ?? "";

  const sigRow = (label: string, value = "") => (
    <div className="mt-4 flex items-end gap-3">
      <span className="whitespace-nowrap text-sm">{label}：</span>
      <span className="min-w-[220px] flex-1 border-b border-ink pb-0.5 text-sm">{value}</span>
    </div>
  );

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between">
        <Link href={`/admin/reservations/${r.id}`} className="text-sm text-brand-700 hover:underline">
          {t.cardo.backTo} {r.booking_ref}
        </Link>
        <PrintButton label={t.common.print} />
      </div>

      <div className="print-area mx-auto max-w-[820px] bg-white p-8 text-ink shadow-card print:max-w-none print:p-0 print:shadow-none">
        <h1 className="text-center text-xl font-black">頭盔王 CARDO Packtalk Bold 租賃條款</h1>
        <p className="mt-1 text-center text-sm text-ink-muted">（繁體中文）</p>
        <p className="mt-6 text-sm">本合約由頭盔王（出租方）與承租方訂立。</p>

        <div className="mt-4 space-y-4">
          {CLAUSES.map((c) => (
            <div key={c.n}>
              <div className="text-sm font-bold">{c.n}. {c.title}</div>
              <p className="mt-0.5 whitespace-pre-wrap text-sm leading-6 text-ink-soft">{c.body}</p>
            </div>
          ))}
          <div>
            <div className="text-sm font-bold">3. 租賃期間</div>
            <p className="mt-0.5 text-sm leading-6 text-ink-soft">
              租賃期間：自 <span className="font-medium underline">{from}</span> 起至{" "}
              <span className="font-medium underline">{to}</span> 止。
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="text-sm font-bold">簽署</div>
          {sigRow("承租方姓名", name)}
          {sigRow("身份證")}
          {sigRow("聯絡電話", r.hk_phone ?? "")}
          {sigRow("承租方簽署")}
          {sigRow("日期")}
        </div>
      </div>
    </div>
  );
}
