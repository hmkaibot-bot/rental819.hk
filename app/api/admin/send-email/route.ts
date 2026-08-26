import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed, canWrite } from "@/lib/admin/auth";
import { getReservation, setStatus } from "@/lib/reservations/store";
import {
  statusAfterJpEmail,
  statusAfterCustomerEmail,
  confirmNeedsPaidDate,
} from "@/lib/reservations/types";
import { jpReservationEmail, customerConfirmEmail } from "@/lib/reservations/emails";
import { JP_PARTNER_EMAIL, INTERNAL_COPY } from "@/lib/reservations/recipients";
import { isGmailConfigured, sendGmailMessage } from "@/lib/gmail";

export const runtime = "nodejs";

/**
 * Send one of the two reservation emails straight from the company mailbox —
 * staff used to get a Gmail draft to review and send by hand.
 *
 * jp       → Rental819 Japan, with the HK team on Cc (they are all colleagues,
 *            so an open copy is fine and keeps replies on one thread).
 * customer → the customer, with the HK team on Bcc so the customer only ever
 *            sees the company address.
 */
export async function POST(request: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  // Sending is irreversible and reaches a customer or the Japan partner, so it
  // is a write even though it changes no row.
  if (!canWrite()) {
    return NextResponse.json({ ok: false, error: "read_only" }, { status: 403 });
  }
  if (!isGmailConfigured()) {
    return NextResponse.json({ ok: false, error: "gmail_not_configured" }, { status: 400 });
  }

  const { id, kind, lang, staffName } = (await request.json().catch(() => ({}))) as {
    id?: string;
    kind?: string;
    lang?: string;
    staffName?: string;
  };
  const r = id ? await getReservation(id) : null;
  if (!r) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const isJp = kind === "jp";
  const signer = (staffName ?? "").trim();
  // The JP mail is signed by the sending colleague; the UI requires the name
  // before it lets the button fire, and this backs that up server-side.
  if (isJp && !signer) {
    return NextResponse.json({ ok: false, error: "staff_required" }, { status: 400 });
  }
  const mail = isJp
    ? jpReservationEmail(r, signer)
    : customerConfirmEmail(r, lang === "zh" ? "zh" : "en");
  const to = isJp ? JP_PARTNER_EMAIL : (r.email ?? "").trim();
  // Both mails are HTML now. This used to force the JP one to plain text, which
  // meant the table only ever existed in the admin preview — the copy that
  // reached Japan was still the old text body.
  const html = (mail as { html?: string }).html;

  if (!to) {
    // Only reachable for the customer mail — the JP address is a constant.
    return NextResponse.json({ ok: false, error: "no_recipient" }, { status: 400 });
  }

  try {
    await sendGmailMessage({
      to,
      subject: mail.subject,
      body: mail.body,
      html,
      cc: isJp ? INTERNAL_COPY : undefined,
      bcc: isJp ? undefined : INTERNAL_COPY,
    });
    // The Japan mail going out IS the 已通知日本 step, so record it instead of
    // making staff set the same thing by hand right after. Only ever forwards
    // (see statusAfterJpEmail), and a failure here must not report the sent
    // mail as failed — it is already gone.
    // Either mail going out IS a pipeline step, so record it instead of making
    // staff set the same thing by hand right after: the JP mail → 已通知日本,
    // the customer confirmation → 已確認預定. Both only ever move forward, and
    // 已確認預定 still requires 客人付款日期 (the same gate as the two status
    // dropdowns) — without it the status is left alone and the UI says why.
    // A failure here must not report the sent mail as failed — it is gone.
    let statusAdvanced = false;
    let statusSkipped: string | undefined;
    const next = isJp ? statusAfterJpEmail(r.status) : statusAfterCustomerEmail(r.status);
    if (next) {
      if (!isJp && confirmNeedsPaidDate(next, r.customer_paid_date)) {
        statusSkipped = "paid_date_required";
      } else {
        try {
          await setStatus(r.id, next);
          revalidatePath(`/admin/reservations/${r.id}`, "layout");
          revalidatePath("/admin");
          statusAdvanced = true;
        } catch (statusErr) {
          console.error("status advance after email failed", statusErr);
        }
      }
    }
    return NextResponse.json({ ok: true, to, copies: INTERNAL_COPY, statusAdvanced, statusSkipped });
  } catch (err) {
    console.error("reservation email send failed", err);
    const message = err instanceof Error ? err.message : "send_failed";
    return NextResponse.json({ ok: false, error: "send_failed", detail: message }, { status: 500 });
  }
}
