import Link from "next/link";
import { notFound } from "next/navigation";
import { getReservation } from "@/lib/reservations/store";
import { jpReservationEmail, customerConfirmEmail } from "@/lib/reservations/emails";
import { isGmailConfigured } from "@/lib/gmail";
import EmailPreview from "@/components/admin/EmailPreview";
import GmailDraftButton from "@/components/admin/GmailDraftButton";

export const dynamic = "force-dynamic";

export default async function EmailDraft({
  params,
  searchParams,
}: {
  params: { id: string; kind: string };
  searchParams: { lang?: string };
}) {
  const r = await getReservation(params.id);
  if (!r) notFound();
  if (params.kind !== "jp" && params.kind !== "customer") notFound();

  const isJp = params.kind === "jp";
  const lang: "en" | "zh" = searchParams.lang === "zh" ? "zh" : "en";
  const mail = isJp ? jpReservationEmail(r) : customerConfirmEmail(r, lang);
  const to = isJp ? "" : r.email ?? "";

  const base = `/admin/reservations/${r.id}/email/customer`;
  const langTab = (key: "en" | "zh", label: string) => (
    <Link
      href={`${base}?lang=${key}`}
      className={`px-3 py-1 ${
        lang === key ? "bg-brand-600 text-white" : "bg-white text-ink-soft hover:bg-slate-50"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/admin/reservations/${r.id}`} className="text-sm text-brand-700 hover:underline">
        ← 返回預約 {r.booking_ref}
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">
          {isJp ? "日本 Rental819 預約信" : "客人確認信"}
        </h1>
        {!isJp && (
          <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 text-sm font-medium">
            {langTab("en", "English")}
            {langTab("zh", "中文")}
          </div>
        )}
      </div>
      <p className="mb-5 mt-1 text-sm text-ink-muted">
        {isJp
          ? "複製以下內容，發送給日本 Rental819 確認預約（步驟 4）。"
          : "揀語言後，複製內容或一鍵建立 Gmail 草稿，發送給客人作最終確認。"}
      </p>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <EmailPreview
          subject={mail.subject}
          body={mail.body}
          to={to}
          html={(mail as { html?: string }).html}
        />
        <div className="mt-4 border-t border-slate-100 pt-4">
          <GmailDraftButton
            id={r.id}
            kind={params.kind as "jp" | "customer"}
            lang={lang}
            enabled={isGmailConfigured()}
          />
        </div>
      </div>
    </div>
  );
}
