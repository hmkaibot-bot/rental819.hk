import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { isGmailConfigured, gmailAccount } from "@/lib/gmail";

export const runtime = "nodejs";

/**
 * Read-only check of the Gmail connection: which mailbox the refresh token
 * belongs to, and which addresses that account may send as.
 *
 * Gmail silently rewrites the From: header to the account's own address unless
 * the account owns GMAIL_SENDER or has it as a verified "send mail as" alias,
 * so this answers "will our mail actually go out as info@helmetking.com?"
 * without having to send one to find out.
 */
export async function GET() {
  if (!isAuthed()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!isGmailConfigured()) {
    return NextResponse.json(
      { ok: false, error: "gmail_not_configured", hint: "Set GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET / GMAIL_REFRESH_TOKEN." },
      { status: 400 },
    );
  }

  try {
    const info = await gmailAccount();
    const configured = process.env.GMAIL_SENDER ?? "";
    // GMAIL_SENDER may be "Name <addr>" — compare on the address alone.
    const wanted = (configured.match(/<([^>]+)>/)?.[1] ?? configured).trim().toLowerCase();
    const match = info.sendAs.find((s) => s.address.toLowerCase() === wanted);

    return NextResponse.json({
      ok: true,
      account: info.account,
      sendAs: info.sendAs,
      configuredSender: configured || null,
      // null when GMAIL_SENDER is unset — mail then goes out as `account`.
      senderUsable: wanted ? Boolean(match && match.verified) : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "status_failed";
    return NextResponse.json({ ok: false, error: "status_failed", detail: message }, { status: 500 });
  }
}
