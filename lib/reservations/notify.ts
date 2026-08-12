import "server-only";
import { isGmailConfigured, sendGmailMessage } from "@/lib/gmail";
import { site } from "@/lib/site";
import { slashDate, hhmm } from "./emails";
import { ADDON_LABELS, type ReservationAddons } from "./types";

// Slack "email to channel" address for the 電單車旅行 group. Override in the
// environment to change the destination or keep it out of source control.
const SLACK_BOOKING_EMAIL =
  process.env.SLACK_BOOKING_EMAIL ||
  "x-aaaahpopmmhckqsibirbgkotua@helmetkinghk.slack.com";

export interface BookingNotice {
  id: string;
  booking_ref?: string | null;
  name: string | null;
  name_zh?: string | null;
  shop?: string | null;
  pickup_date?: string | null;
  pickup_time?: string | null;
  return_date?: string | null;
  return_time?: string | null;
  bike_pref_1?: string | null;
  bike_pref_2?: string | null;
  bike_pref_3?: string | null;
  email?: string | null;
  hk_phone?: string | null;
  addons?: ReservationAddons;
  promo?: string | null;
  /** Whether the automatic customer acknowledgement went out, so the channel
   *  knows when a manual follow-up is needed. */
  ackEmailSent?: boolean;
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

/** Pure builder for the 新預約提示, exported so a preview renders exactly
 *  what will be sent. */
export function buildBookingNotice(b: BookingNotice): {
  subject: string;
  body: string;
} {
  const ref = (b.booking_ref ?? "").trim();
  const who = [b.name, b.name_zh].filter(Boolean).join(" / ") || "客人";
  const pickup =
    [slashDate(b.pickup_date), hhmm(b.pickup_time)].filter(Boolean).join(" ") || "—";
  const ret =
    [slashDate(b.return_date), hhmm(b.return_time)].filter(Boolean).join(" ") || "—";
  const bikes =
    [b.bike_pref_1, b.bike_pref_2, b.bike_pref_3].filter(Boolean).join("｜") || "—";

  const subject = `🏍️【新預約提示】${ref ? `#${ref} ` : ""}${who}${b.shop ? `（${b.shop}）` : ""}`;
  const body = [
    "【新預約提示】RENTAL819.HK 網站收到新預約申請",
    "",
    ref && `預約編號：#${ref}`,
    `姓名：${who}`,
    b.email && `電郵：${b.email}`,
    b.hk_phone && `電話：${b.hk_phone}`,
    b.shop && `取車店舖：${b.shop}`,
    `取車：${pickup}`,
    `還車：${ret}`,
    `車款志願：${bikes}`,
    `加購項目：${addonList(b.addons)}`,
    b.promo && `優惠代碼：${b.promo}`,
    "",
    b.ackEmailSent
      ? "系統已自動向客人發出「已收到申請」通知電郵。"
      : "注意：未能向客人發出自動通知電郵，請人手跟進。",
    `▶ 後台處理：${site.url}/admin/reservations/${b.id}`,
  ]
    // Keep "" spacer lines; drop only the conditional entries that are off.
    .filter((line): line is string => typeof line === "string")
    .join("\n");

  return { subject, body };
}

/**
 * 「新預約提示」to the Slack 電單車旅行 channel, sent by emailing the
 * channel's email-to-channel address. Soft-fails: a notification problem must
 * never break the customer's booking submission.
 */
export async function notifyNewBooking(b: BookingNotice): Promise<void> {
  if (!isGmailConfigured()) {
    console.warn(
      "[notifyNewBooking] Gmail API not configured — skipping Slack notification",
    );
    return;
  }

  const { subject, body } = buildBookingNotice(b);
  try {
    await sendGmailMessage({ to: SLACK_BOOKING_EMAIL, subject, body });
  } catch (err) {
    console.error("[notifyNewBooking] Slack email failed", err);
  }
}
