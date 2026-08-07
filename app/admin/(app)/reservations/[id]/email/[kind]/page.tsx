import Link from "next/link";
import { notFound } from "next/navigation";
import { getReservation } from "@/lib/reservations/store";
import { jpReservationEmail, customerConfirmEmail } from "@/lib/reservations/emails";
import { JP_PARTNER_EMAIL, INTERNAL_COPY } from "@/lib/reservations/recipients";
import { isGmailConfigured } from "@/lib/gmail";
import { getAdminDict } from "@/lib/admin/lang";
import EmailPreview from "@/components/admin/EmailPreview";
import SendEmailButton from "@/components/admin/SendEmailButton";

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

  const t = getAdminDict();
  const isJp = params.kind === "jp";
  const lang: "en" | "zh" = searchParams.lang === "zh" ? "zh" : "en";
  const mail = isJp ? jpReservationEmail(r) : customerConfirmEmail(r, lang);
  const to = isJp ? JP_PARTNER_EMAIL : (r.email ?? "").trim();

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
        {t.invoice.backTo} {r.booking_ref}
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">{isJp ? t.email.jpTitle : t.email.customerTitle}</h1>
        {!isJp && (
          <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 text-sm font-medium">
            {langTab("en", "English")}
            {langTab("zh", "中文")}
          </div>
        )}
      </div>
      <p className="mb-5 mt-1 text-sm text-ink-muted">
        {isJp ? t.email.jpIntro : t.email.customerIntro}
      </p>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        {/* Who this actually goes to — shown before the send button so staff can
            check the address without opening a mail client. */}
        <dl className="mb-4 space-y-1 rounded-lg bg-slate-50 px-3 py-2 text-xs">
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-ink-muted">{t.email.to}</dt>
            <dd className="font-medium text-ink">{to || "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-ink-muted">{isJp ? t.email.cc : t.email.bcc}</dt>
            <dd className="text-ink-soft">{INTERNAL_COPY.join(", ") || "—"}</dd>
          </div>
        </dl>

        <EmailPreview
          subject={mail.subject}
          body={mail.body}
          html={(mail as { html?: string }).html}
          t={t.email}
        />
        <div className="mt-4 border-t border-slate-100 pt-4">
          <SendEmailButton
            id={r.id}
            kind={params.kind as "jp" | "customer"}
            lang={lang}
            enabled={isGmailConfigured()}
            hasRecipient={!!to}
            t={t.email}
          />
        </div>
      </div>
    </div>
  );
}
