import "server-only";

/**
 * Minimal Gmail API integration (no SDK) to create a DRAFT in the user's
 * mailbox — the user then reviews and sends it themselves ("用家控制發送").
 *
 * Requires a one-time OAuth setup (see README / .env.example):
 *   GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_SENDER
 * Scope needed: https://www.googleapis.com/auth/gmail.compose
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

function buildMime(to: string, subject: string, body: string, from?: string): string {
  const headers = [
    from ? `From: ${from}` : null,
    to ? `To: ${to}` : null,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
  ]
    .filter(Boolean)
    .join("\r\n");
  const encodedBody = Buffer.from(body, "utf8").toString("base64");
  return `${headers}\r\n\r\n${encodedBody}`;
}

/** Create a Gmail draft; returns the draft id. */
export async function createGmailDraft(opts: {
  to: string;
  subject: string;
  body: string;
}): Promise<{ draftId: string }> {
  const token = await accessToken();
  const raw = base64url(buildMime(opts.to, opts.subject, opts.body, process.env.GMAIL_SENDER));
  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/drafts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: { raw } }),
    },
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gmail draft error: ${res.status} ${t.slice(0, 200)}`);
  }
  const json = (await res.json()) as { id?: string };
  return { draftId: json.id ?? "" };
}
