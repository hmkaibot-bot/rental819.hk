import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { getReservation } from "@/lib/reservations/store";
import { jpReservationEmail, customerConfirmEmail } from "@/lib/reservations/emails";
import { isGmailConfigured, createGmailDraft } from "@/lib/gmail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!isGmailConfigured()) {
    return NextResponse.json({ ok: false, error: "gmail_not_configured" }, { status: 400 });
  }

  const { id, kind } = (await request.json().catch(() => ({}))) as {
    id?: string;
    kind?: string;
  };
  const r = id ? await getReservation(id) : null;
  if (!r) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const isJp = kind === "jp";
  const mail = isJp ? jpReservationEmail(r) : customerConfirmEmail(r);
  const to = isJp ? process.env.RENTAL819_JP_EMAIL ?? "" : r.email ?? "";

  try {
    const { draftId } = await createGmailDraft({ to, subject: mail.subject, body: mail.body });
    return NextResponse.json({ ok: true, draftId });
  } catch (err) {
    console.error("gmail draft failed", err);
    return NextResponse.json({ ok: false, error: "draft_failed" }, { status: 500 });
  }
}
