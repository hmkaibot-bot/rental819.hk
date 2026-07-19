import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface BookingPayload {
  service?: string;
  name?: string;
  email?: string;
  phone?: string;
  region?: string;
  dates?: string;
  bike?: string;
  message?: string;
  locale?: string;
}

/**
 * Booking-request endpoint.
 *
 * With no mail backend configured this validates the payload and returns ok
 * (the form also offers a WhatsApp hand-off). Set BOOKING_WEBHOOK_URL to
 * forward each request to email/Slack/CRM in production.
 */
export async function POST(request: Request) {
  let body: BookingPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const contact = (body.email ?? body.phone ?? "").trim();
  if (!name || !contact) {
    return NextResponse.json(
      { ok: false, error: "missing_required_fields" },
      { status: 422 },
    );
  }

  const webhook = process.env.BOOKING_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "rental819.hk booking form",
          receivedAt: new Date().toISOString(),
          ...body,
        }),
      });
    } catch (err) {
      // Non-fatal: never lose the lead just because the webhook is down.
      console.error("booking webhook failed", err);
    }
  } else {
    console.info("[booking] new request", { name, contact, service: body.service });
  }

  return NextResponse.json({ ok: true });
}
