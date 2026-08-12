import { NextResponse } from "next/server";
import { createReservation } from "@/lib/reservations/store";
import { notifyNewBooking } from "@/lib/reservations/notify";
import { bookingReceivedEmail } from "@/lib/reservations/emails";
import { INTERNAL_COPY } from "@/lib/reservations/recipients";
import { isGmailConfigured, sendGmailMessage } from "@/lib/gmail";
import type { ReservationAddons } from "@/lib/reservations/types";

export const runtime = "nodejs";

interface BookingPayload {
  locale?: string;
  // rental
  shop?: string;
  pickup_date?: string;
  pickup_time?: string;
  return_date?: string;
  return_time?: string;
  // bike
  bike_pref_1?: string;
  bike_pref_2?: string;
  bike_pref_3?: string;
  // rider
  name_zh?: string;
  name_en?: string;
  gender?: string;
  dob?: string;
  email?: string;
  email_confirm?: string;
  hk_phone?: string;
  hk_address?: string;
  japanese_ability?: string;
  english_ability?: string;
  // japan
  jp_address?: string;
  jp_phone?: string;
  // emergency
  emergency_contact?: string;
  emergency_phone?: string;
  // add-ons
  helmet_full?: string;
  helmet_open?: string;
  helmet_size?: string;
  addon_topcase?: boolean;
  addon_sidebag?: boolean;
  addon_pannier?: boolean;
  addon_cardo?: boolean;
  addon_etc?: boolean;
  addon_shuttle_bus?: boolean;
  addon_luggage_storage?: boolean;
  addon_mamoride?: boolean;
  promo?: string;
  notes?: string;
  // consent
  idp?: boolean;
  consent_pay?: boolean;
  consent_cancel?: boolean;
  consent_privacy?: boolean;
}

const clean = (v?: string) => (v && v.trim() ? v.trim() : null);
const count = (v?: string) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

/**
 * Rental booking-request endpoint.
 *
 * Persists a structured reservation record (the rental pipeline picks it up in
 * the admin backend). Fields without a dedicated column (IDP declaration,
 * consents, helmet sizes) are recorded in the notes so nothing is lost. In demo
 * mode this validates and acknowledges; a BOOKING_WEBHOOK_URL can additionally
 * forward the raw payload to email/Slack.
 */
export async function POST(request: Request) {
  let body: BookingPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Core required fields (mirrors the client-side gate).
  const name = clean(body.name_en) ?? clean(body.name_zh);
  const email = clean(body.email);
  if (!name || !email || !clean(body.shop) || !clean(body.bike_pref_1) || !clean(body.hk_phone)) {
    return NextResponse.json(
      { ok: false, error: "missing_required_fields" },
      { status: 422 },
    );
  }
  if (!body.idp || !body.consent_pay || !body.consent_cancel || !body.consent_privacy) {
    return NextResponse.json(
      { ok: false, error: "eligibility_or_consent_missing" },
      { status: 422 },
    );
  }

  const addons: ReservationAddons = {
    topcase: body.addon_topcase || undefined,
    sidebag: body.addon_sidebag || undefined,
    pannier: body.addon_pannier || undefined,
    cardo: body.addon_cardo || undefined,
    etc: body.addon_etc || undefined,
    shuttle_bus: body.addon_shuttle_bus || undefined,
    luggage_storage: body.addon_luggage_storage || undefined,
    mamoride: body.addon_mamoride || undefined,
    full_face: count(body.helmet_full),
    open_face: count(body.helmet_open),
  };

  const notes = [
    body.helmet_size?.trim() && `頭盔尺碼：${body.helmet_size.trim()}`,
    "已確認持有效國際駕駛執照（IDP）",
    "已同意繳費詳情、取消政策及私隱聲明",
    body.notes?.trim() && `備註：${body.notes.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

  let created: { id: string; booking_ref: string | null };
  try {
    created = await createReservation({
      name_zh: clean(body.name_zh),
      name_en: clean(body.name_en),
      gender: clean(body.gender),
      dob: clean(body.dob),
      email,
      hk_phone: clean(body.hk_phone),
      hk_address: clean(body.hk_address),
      jp_address: clean(body.jp_address),
      jp_phone: clean(body.jp_phone),
      japanese_ability: clean(body.japanese_ability),
      english_ability: clean(body.english_ability),
      emergency_contact: clean(body.emergency_contact),
      emergency_phone: clean(body.emergency_phone),
      shop: clean(body.shop),
      bike_pref_1: clean(body.bike_pref_1),
      bike_pref_2: clean(body.bike_pref_2),
      bike_pref_3: clean(body.bike_pref_3),
      pickup_date: clean(body.pickup_date),
      pickup_time: clean(body.pickup_time),
      return_date: clean(body.return_date),
      return_time: clean(body.return_time),
      addons,
      promo: clean(body.promo),
      notes: notes || null,
      source: "website",
    });
  } catch (err) {
    console.error("createReservation failed", err);
    return NextResponse.json({ ok: false, error: "store_failed" }, { status: 500 });
  }

  // Acknowledge to the customer right away — 已收到申請, not a confirmation.
  // Soft-fail: a mail problem must never break the submission, but its outcome
  // is reported in the Slack notice so staff know to follow up by hand.
  let ackEmailSent = false;
  if (isGmailConfigured()) {
    try {
      const ack = bookingReceivedEmail({
        booking_ref: created.booking_ref,
        name_en: clean(body.name_en),
        name_zh: clean(body.name_zh),
        shop: clean(body.shop),
        pickup_date: clean(body.pickup_date),
        pickup_time: clean(body.pickup_time),
        return_date: clean(body.return_date),
        return_time: clean(body.return_time),
        bike_pref_1: clean(body.bike_pref_1),
        bike_pref_2: clean(body.bike_pref_2),
        bike_pref_3: clean(body.bike_pref_3),
        addons,
        promo: clean(body.promo),
      });
      await sendGmailMessage({
        to: email,
        subject: ack.subject,
        body: ack.body,
        html: ack.html,
        bcc: INTERNAL_COPY,
      });
      ackEmailSent = true;
    } catch (err) {
      console.error("booking acknowledgement email failed", err);
    }
  }

  // 新預約提示 to the Slack 電單車旅行 channel (soft-fail — never blocks booking).
  await notifyNewBooking({
    id: created.id,
    booking_ref: created.booking_ref,
    name: name,
    name_zh: clean(body.name_zh),
    shop: clean(body.shop),
    pickup_date: clean(body.pickup_date),
    pickup_time: clean(body.pickup_time),
    return_date: clean(body.return_date),
    return_time: clean(body.return_time),
    bike_pref_1: clean(body.bike_pref_1),
    bike_pref_2: clean(body.bike_pref_2),
    bike_pref_3: clean(body.bike_pref_3),
    email,
    hk_phone: clean(body.hk_phone),
    addons,
    promo: clean(body.promo),
    ackEmailSent,
  });

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
