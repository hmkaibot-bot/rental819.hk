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
    const configured = (process.env.GMAIL_SENDER ?? "").trim();
    // GMAIL_SENDER may be "Name <addr>" — compare on the address alone.
    const wanted = (configured.match(/<([^>]+)>/)?.[1] ?? configured).trim().toLowerCase();
    const account = info.account.trim().toLowerCase();
    const match = info.sendAs.find((s) => s.address.toLowerCase() === wanted);

    // A value that is not an address at all is worth calling out on its own —
    // it lands in the From: header verbatim and breaks the send.
    const looksLikeAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wanted);

    let senderUsable: boolean | null;
    let note: string | null = null;
    if (!wanted) {
      // Unset is fine: with no From: header the mail goes out as `account`.
      senderUsable = true;
      note = `GMAIL_SENDER is unset — mail goes out as ${info.account}.`;
    } else if (!looksLikeAddress) {
      senderUsable = false;
      note = "GMAIL_SENDER is not an email address. Set it to \"Name <addr>\" or unset it.";
    } else if (wanted === account) {
      // The account's own address never needs a send-as alias.
      senderUsable = true;
    } else if (!info.sendAsReadable) {
      senderUsable = null;
      note =
        "Cannot verify: the alias list needs the gmail.settings.basic scope, which this token does not have.";
    } else {
      senderUsable = Boolean(match && match.verified);
    }

    return NextResponse.json({
      ok: true,
      account: info.account,
      sendAs: info.sendAs,
      sendAsReadable: info.sendAsReadable,
      // Never echo the raw value — a misconfigured GMAIL_SENDER has held a
      // credential before now, and this response gets pasted around.
      configuredSender: wanted && looksLikeAddress ? configured : wanted ? "(set, but not an email address)" : null,
      effectiveSender: senderUsable && wanted && looksLikeAddress ? wanted : info.account,
      senderUsable,
      note,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "status_failed";
    return NextResponse.json({ ok: false, error: "status_failed", detail: message }, { status: 500 });
  }
}
