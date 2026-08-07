import "server-only";

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

function buildMime(msg: GmailMessage, from?: string): string {
  const contentType = msg.html
    ? 'text/html; charset="UTF-8"'
    : 'text/plain; charset="UTF-8"';
  const cc = addressList(msg.cc);
  const bcc = addressList(msg.bcc);
  const headers = [
    from ? `From: ${from}` : null,
    msg.to ? `To: ${msg.to}` : null,
    cc ? `Cc: ${cc}` : null,
    // Gmail strips Bcc from the delivered copy but still delivers to it, so the
    // recipients stay hidden from everyone in To/Cc.
    bcc ? `Bcc: ${bcc}` : null,
    `Subject: ${encodeHeader(msg.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: ${contentType}`,
    "Content-Transfer-Encoding: base64",
  ]
    .filter(Boolean)
    .join("\r\n");
  const encodedBody = Buffer.from(msg.html ?? msg.body, "utf8").toString("base64");
  return `${headers}\r\n\r\n${encodedBody}`;
}

/**
 * Send an email. The gmail.compose scope also grants send, so this reuses the
 * same OAuth credentials. Used for the JP reservation and customer confirmation
 * mails, and for internal notifications (e.g. the new-booking alert to the
 * Slack channel address).
 */
export async function sendGmailMessage(opts: GmailMessage): Promise<{ id: string }> {
  const token = await accessToken();
  const raw = base64url(buildMime(opts, process.env.GMAIL_SENDER));
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
