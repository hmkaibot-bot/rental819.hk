import "server-only";
import { addressFromEnv } from "./email-address";

/**
 * Minimal Gmail API integration (no SDK) for sending from the company mailbox.
 *
 * Requires a one-time OAuth setup (see README / .env.example):
 *   GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_SENDER
 * Scope needed: https://www.googleapis.com/auth/gmail.compose (which also
 * grants send).
 */
export function isGmailConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN,
  );
}

async function accessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID!,
      client_secret: process.env.GMAIL_CLIENT_SECRET!,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Gmail token error: ${res.status}`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Gmail token error: no access_token");
  return json.access_token;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** RFC 2047 encode a header value (for CJK subjects). */
function encodeHeader(value: string): string {
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

/**
 * The From: header, or undefined to let Gmail use the authorised account's own
 * address. A GMAIL_SENDER that is not an address is dropped rather than written
 * into the header — production held an OAuth access token there, and sending
 * with `From: ya29.…` fails in a way nothing surfaces.
 */
export function senderHeader(): string | undefined {
  return addressFromEnv("GMAIL_SENDER", null) ?? undefined;
}

export interface GmailMessage {
  to: string;
  subject: string;
  body: string;
  html?: string;
  cc?: string[];
  /** Blind copies — never revealed to the recipient in `to`. */
  bcc?: string[];
}

function addressList(values?: string[]): string | null {
  const list = (values ?? []).map((v) => v.trim()).filter(Boolean);
  return list.length ? list.join(", ") : null;
}

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64");

function buildMime(msg: GmailMessage, from?: string): string {
  const cc = addressList(msg.cc);
  const bcc = addressList(msg.bcc);
  // A fixed boundary is fine — it only has to be absent from the parts, and
  // base64 bodies cannot contain it.
  const boundary = "r819-alt-boundary";

  const headers = [
    from ? `From: ${from}` : null,
    msg.to ? `To: ${msg.to}` : null,
    cc ? `Cc: ${cc}` : null,
    // Gmail strips Bcc from the delivered copy but still delivers to it, so the
    // recipients stay hidden from everyone in To/Cc.
    bcc ? `Bcc: ${bcc}` : null,
    `Subject: ${encodeHeader(msg.subject)}`,
    "MIME-Version: 1.0",
    msg.html
      ? `Content-Type: multipart/alternative; boundary="${boundary}"`
      : 'Content-Type: text/plain; charset="UTF-8"',
    msg.html ? null : "Content-Transfer-Encoding: base64",
  ]
    .filter(Boolean)
    .join("\r\n");

  if (!msg.html) return `${headers}\r\n\r\n${b64(msg.body)}`;

  // multipart/alternative rather than a bare text/html part: this used to send
  // the HTML *instead of* the text, so the plain-text body the callers build
  // never actually went on the wire. Clients that will not render HTML — and
  // anything downstream reading the archived Cc copy — got nothing readable.
  // Least-preferred part first, per RFC 2046.
  return [
    headers,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    b64(msg.body),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    b64(msg.html),
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

/**
 * Send an email. The gmail.compose scope also grants send, so this reuses the
 * same OAuth credentials. Used for the JP reservation and customer confirmation
 * mails, and for internal notifications (e.g. the new-booking alert to the
 * Slack channel address).
 */
export async function sendGmailMessage(opts: GmailMessage): Promise<{ id: string }> {
  const token = await accessToken();
  const raw = base64url(buildMime(opts, senderHeader()));
  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    },
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gmail send error: ${res.status} ${t.slice(0, 200)}`);
  }
  const json = (await res.json()) as { id?: string };
  return { id: json.id ?? "" };
}

export interface GmailAccountInfo {
  /** The mailbox the refresh token belongs to. */
  account: string;
  /** Addresses this account may put in From:, and whether each is verified. */
  sendAs: { address: string; verified: boolean; isDefault: boolean }[];
  /**
   * False when the alias list could not be read at all — the original
   * authorisation only asked for gmail.compose, which does not cover
   * settings.sendAs. An empty list then means "unknown", not "no aliases".
   */
  sendAsReadable: boolean;
}

/**
 * Which mailbox are we actually connected to, and what may it send as? Used by
 * the /api/admin/gmail-status check — `gmail.compose` covers both endpoints, so
 * no extra scope is needed.
 */
export async function gmailAccount(): Promise<GmailAccountInfo> {
  const token = await accessToken();
  const auth = { Authorization: `Bearer ${token}` };

  const profileRes = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/profile",
    { headers: auth },
  );
  if (!profileRes.ok) {
    const t = await profileRes.text();
    throw new Error(`Gmail profile error: ${profileRes.status} ${t.slice(0, 200)}`);
  }
  const profile = (await profileRes.json()) as { emailAddress?: string };

  const sendAsRes = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs",
    { headers: auth },
  );
  // The alias list needs gmail.settings.basic; without it we still report the
  // account rather than failing the whole check.
  const sendAs = sendAsRes.ok
    ? (
        (await sendAsRes.json()) as {
          sendAs?: {
            sendAsEmail?: string;
            verificationStatus?: string;
            isPrimary?: boolean;
            isDefault?: boolean;
          }[];
        }
      ).sendAs ?? []
    : [];

  return {
    account: profile.emailAddress ?? "",
    sendAsReadable: sendAsRes.ok,
    sendAs: sendAs.map((s) => ({
      address: s.sendAsEmail ?? "",
      // The primary address needs no verification; aliases must be "accepted".
      verified: Boolean(s.isPrimary) || s.verificationStatus === "accepted",
      isDefault: Boolean(s.isDefault),
    })),
  };
}
