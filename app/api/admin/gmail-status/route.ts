import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { isGmailConfigured, gmailAccount, senderHeader } from "@/lib/gmail";
import { isEmailAddress } from "@/lib/email-address";
import { JP_PARTNER_EMAIL, INTERNAL_COPY } from "@/lib/reservations/recipients";

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

    // A value that is not an address at all is worth calling out on its own.
    const looksLikeAddress = isEmailAddress(configured);

    let senderUsable: boolean | null;
    let note: string | null = null;
    if (!wanted) {
      // Unset is fine: with no From: header the mail goes out as `account`.
      senderUsable = true;
      note = `GMAIL_SENDER is unset — mail goes out as ${info.account}.`;
    } else if (!looksLikeAddress) {
      // Sending still works: senderHeader() drops the bad value, so the mail
      // goes out as the authorised account. Worth fixing for the display name.
      senderUsable = true;
      note =
        `GMAIL_SENDER is not an email address, so it is ignored and mail goes out as ${info.account}. ` +
        'Set it to "Name <addr>" to control the display name, or remove it.';
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
      configuredSender: looksLikeAddress ? configured : wanted ? "(set, but not an email address)" : null,
      // What the From: header will really say — senderHeader() applies exactly
      // this rule, so the two can never disagree.
      effectiveSender: senderHeader() ?? info.account,
      senderUsable,
      note,
      jpPartnerEmail: JP_PARTNER_EMAIL,
      internalCopy: INTERNAL_COPY,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "status_failed";
    return NextResponse.json({ ok: false, error: "status_failed", detail: message }, { status: 500 });
  }
}
