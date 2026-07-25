import Link from "next/link";
import { notFound } from "next/navigation";
import { getReservation } from "@/lib/reservations/store";
import { jpReservationEmail, customerConfirmEmail } from "@/lib/reservations/emails";
import EmailPreview from "@/components/admin/EmailPreview";

export const dynamic = "force-dynamic";

export default async function EmailDraft({
  params,
}: {
  params: { id: string; kind: string };
}) {
  const r = await getReservation(params.id);
  if (!r) notFound();
  if (params.kind !== "jp" && params.kind !== "customer") notFound();

  const isJp = params.kind === "jp";
  const mail = isJp ? jpReservationEmail(r) : customerConfirmEmail(r);
  const to = isJp ? "" : r.email ?? "";

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/admin/reservations/${r.id}`} className="text-sm text-brand-700 hover:underline">
        ← 返回預約 {r.booking_ref}
      </Link>
      <h1 className="mt-2 text-xl font-bold">
        {isJp ? "日本 Rental819 預約信" : "客人確認信"}
      </h1>
      <p className="mb-5 text-sm text-ink-muted">
        {isJp
          ? "複製以下內容，發送給日本 Rental819 確認預約（步驟 4）。"
          : "複製以下內容，發送給客人作最終確認（步驟 8）。"}
      </p>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <EmailPreview subject={mail.subject} body={mail.body} to={to} />
      </div>
    </div>
  );
}
