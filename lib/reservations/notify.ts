import "server-only";
import { isGmailConfigured, sendGmailMessage } from "@/lib/gmail";
import { site } from "@/lib/site";
import { ADDON_LABELS, type ReservationAddons } from "./types";

// Slack "email to channel" address for the 電單車旅行 group. Override in the
// environment to change the destination or keep it out of source control.
const SLACK_BOOKING_EMAIL =
  process.env.SLACK_BOOKING_EMAIL ||
  "x-aaaahpopmmhckqsibirbgkotua@helmetkinghk.slack.com";

export interface BookingNotice {
  id: string;
  name: string | null;
  name_zh?: string | null;
  shop?: string | null;
  pickup_date?: string | null;
  pickup_time?: string | null;
  return_date?: string | null;
  return_time?: string | null;
  bike_pref_1?: string | null;
  email?: string | null;
  hk_phone?: string | null;
  addons?: ReservationAddons;
  promo?: string | null;
}

function addonList(a?: ReservationAddons): string {
  if (!a) return "—";
  const on: string[] = [];
  for (const x of ADDON_LABELS) {
    const v = a[x.key];
    if (typeof v === "number" && v > 0) on.push(`${x.zh}×${v}`);
    else if (v === true) on.push(x.zh);
  }
  return on.length ? on.join("、") : "—";
}

/**
 * Notify the Slack 電單車旅行 channel of a new rental booking, by emailing its
 * email-to-channel address. Soft-fails: a notification problem must never break
 * the customer's booking submission.
 */
export async function notifyNewBooking(b: BookingNotice): Promise<void> {
  if (!isGmailConfigured()) {
    console.warn(
      "[notifyNewBooking] Gmail API not configured — skipping Slack notification",
    );
    return;
  }

  const who = [b.name, b.name_zh].filter(Boolean).join(" / ") || "客人";
  const period = `${[b.pickup_date, b.pickup_time].filter(Boolean).join(" ") || "?"} → ${
    [b.return_date, b.return_time].filter(Boolean).join(" ") || "?"
  }`;
  const subject = `🏍️ 新租車預約 — ${who}${b.shop ? `（${b.shop}）` : ""}`;
  const body = [
    "🏍️ 新租車預約",
    `姓名：${who}`,
    b.shop && `出發店：${b.shop}`,
    `租期：${period}`,
    b.bike_pref_1 && `車款首選：${b.bike_pref_1}`,
    b.email && `電郵：${b.email}`,
    b.hk_phone && `電話：${b.hk_phone}`,
    `加購：${addonList(b.addons)}`,
    b.promo && `優惠：${b.promo}`,
    `後台：${site.url}/admin/reservations/${b.id}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await sendGmailMessage({ to: SLACK_BOOKING_EMAIL, subject, body });
  } catch (err) {
    console.error("[notifyNewBooking] Slack email failed", err);
  }
}
