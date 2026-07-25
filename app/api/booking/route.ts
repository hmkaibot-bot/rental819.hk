import { NextResponse } from "next/server";
import { createReservation } from "@/lib/reservations/store";

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

const hasCJK = (s: string) => /[㐀-鿿]/.test(s);

/**
 * Booking-request endpoint.
 *
 * Creates a reservation record (the rental pipeline picks it up in the admin
 * backend). In demo mode this validates and acknowledges. A BOOKING_WEBHOOK_URL
 * can additionally forward the raw payload to email/Slack.
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

  const notes = [
    body.service && `服務類型：${body.service}`,
    body.region && `想去地區：${body.region}`,
    body.dates && `預計日期：${body.dates}`,
    body.message && `備註：${body.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await createReservation({
      name_zh: hasCJK(name) ? name : null,
      name_en: hasCJK(name) ? null : name,
      email: body.email?.trim() || null,
      hk_phone: body.phone?.trim() || null,
      bike_pref_1: body.bike?.trim() || null,
      notes: notes || null,
      source: "website",
    });
  } catch (err) {
    console.error("createReservation failed", err);
    return NextResponse.json({ ok: false, error: "store_failed" }, { status: 500 });
  }

  const webhook = process.env.BOOKING_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "rental819.hk booking form", ...body }),
      });
    } catch (err) {
      console.error("booking webhook failed", err);
    }
  }

  return NextResponse.json({ ok: true });
}
