import { ADDON_LABELS, type Reservation } from "./types";
import { site } from "@/lib/site";

function addonList(r: Reservation): string {
  const on: string[] = [];
  for (const a of ADDON_LABELS) {
    const v = r.addons?.[a.key];
    if (typeof v === "number" && v > 0) on.push(`${a.zh} x${v}`);
    else if (v === true) on.push(a.zh);
  }
  return on.length ? on.join(", ") : "—";
}

function period(r: Reservation): string {
  const a = [r.pickup_date, r.pickup_time].filter(Boolean).join(" ");
  const b = [r.return_date, r.return_time].filter(Boolean).join(" ");
  return `${a || "?"}  →  ${b || "?"}`;
}

function rentalDays(r: Reservation): number {
  if (!r.pickup_date || !r.return_date) return 1;
  const d =
    (new Date(r.return_date).getTime() - new Date(r.pickup_date).getTime()) / 86400000;
  return Math.max(1, Math.round(d));
}

function paymentStatus(r: Reservation): string {
  // 已確認預定 (confirmed) means the customer has paid.
  return r.customer_paid_date || r.status === "confirmed" ? "Paid" : "Pending";
}

/** Email to Japan Rental819 to request/confirm the booking (step 4). Plain text. */
export function jpReservationEmail(r: Reservation) {
  const subject = `RENTAL819 RESERVATION #${r.booking_ref ?? ""}`;
  const body = `Rental819 御中

いつもお世話になっております。Helmet King (香港・マカオ代理) です。
下記のお客様のレンタル予約をお願いいたします。

■ 予約番号 (Booking Ref): ${r.booking_ref ?? ""}
■ 店舗 (Shop): ${r.shop ?? ""}
■ レンタル期間 (Rental): ${period(r)}

【お客様 / Customer】
・お名前 (Name): ${r.name_en ?? ""} / ${r.name_zh ?? ""}
・性別 (Gender): ${r.gender ?? ""}
・生年月日 (DOB): ${r.dob ?? ""}
・メール (Email): ${r.email ?? ""}
・日本語 (JP): ${r.japanese_ability ?? ""}
・英語 (EN): ${r.english_ability ?? ""}
・日本の宿泊先 (JP address): ${r.jp_address ?? ""}
・日本の電話 (JP phone): ${r.jp_phone ?? ""}

【ご希望のバイク / Bike preference】
1. ${r.bike_pref_1 ?? ""}
2. ${r.bike_pref_2 ?? ""}
3. ${r.bike_pref_3 ?? ""}

【オプション / Add-ons】
${addonList(r)}

空車状況とご確認をお願いいたします。
どうぞよろしくお願いいたします。

Helmet King × RENTAL819.HK`;
  return { subject, body };
}

/**
 * Confirmation email to the customer (step 8). Returns an HTML body (matching
 * the Helmet King email template — logo, details, required documents,
 * cancellation policy, footer) plus a plain-text fallback.
 */
export function customerConfirmEmail(r: Reservation) {
  const ref = r.booking_ref ?? "";
  const subject = `RENTAL819.HK Japan Motorcycle Self-Drive Reservation #${ref}`;
  const name = r.name_en ?? r.name_zh ?? "Customer";
  const days = rentalDays(r);
  const pickup = [r.pickup_date, r.pickup_time].filter(Boolean).join(" ") || "—";
  const ret = [r.return_date, r.return_time].filter(Boolean).join(" ") || "—";

  const body = `Dear ${name},

BOOKING CONFIRMATION — your Japan motorcycle self-drive trip is all set!

Order No.: #${ref}
Pick-up:  ${pickup}
Return:   ${ret}
Duration: ${days} day(s)

Rental819 shop: ${r.shop ?? "—"}
Vehicle: ${r.confirmed_bike ?? "(to be confirmed)"}
Add-ons: ${addonList(r)}
Notes: ${r.notes ?? "—"}
Payment status: ${paymentStatus(r)}

Required documents (please present on the rental day):
1. A valid International Driving Permit (IDP)
2. Your local (HK/Macau) driving licence
3. Passport
Without any of these, or if they are expired, we cannot provide the service. The shop will photocopy your documents for its records.

Cancellation policy:
- 6 days before: 20% of the rental invoice total
- 2 days before: 30% of the rental invoice total
- Same day: 50% of the rental invoice total
- A no-show forfeits any refund. Each shop retains final discretion over rentals. Please plan your rental period, time, model and location in advance and avoid cancelling unless necessary.

Please arrive about 30 minutes before departure to receive a briefing from staff and sign the documents. If anything changes before departure, contact us any time.

Thank you for choosing Rental819.hk — enjoy the ride!

Helmet King × RENTAL819.HK
WhatsApp: ${site.phone}`;

  // Public asset host that resolves regardless of DNS cut-over state (the
  // customer's mail client must be able to fetch the logo).
  const assetBase = "https://rental819-hk.vercel.app";
  const b = "#005bac";
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#64748b;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:4px 0;font-weight:600;color:#0f172a">${escapeHtml(value)}</td></tr>`;

  const html = `<div style="margin:0;padding:0;background:#f1f5f9">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;font-family:-apple-system,'Segoe UI',Helvetica,Arial,'Noto Sans HK',sans-serif;color:#0f172a">
    <div style="text-align:center;background:${b};padding:22px">
      <img src="${assetBase}/logo-lg.png" alt="RENTAL819" width="150" style="height:auto;border:0;display:inline-block" />
    </div>
    <div style="padding:28px 28px 8px">
      <p style="margin:0 0 16px">Dear ${escapeHtml(name)},</p>
      <h2 style="margin:0 0 4px;text-align:center;color:${b}">Booking Confirmation</h2>
      <p style="margin:0 0 20px;text-align:center;color:#334155">Your Japan motorcycle self-drive trip is all set!</p>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:10px">
        <tbody>
          <tr><td style="padding:14px 16px" colspan="2">
            <div style="font-weight:800;color:${b}">Order No. #${escapeHtml(ref)}</div>
          </td></tr>
          ${row("Pick-up time", pickup)}
          ${row("Return time", ret)}
          ${row("Total duration", `${days} day(s)`)}
        </tbody>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-top:18px">
        <tbody>
          ${row("▼ Rental819 shop", r.shop ?? "—")}
          ${row("▼ Vehicle", r.confirmed_bike ?? "(to be confirmed)")}
          ${row("▼ Add-ons", addonList(r))}
          ${row("▼ Notes", r.notes ?? "—")}
          ${row("▼ Payment status", paymentStatus(r))}
        </tbody>
      </table>

      <h3 style="margin:24px 0 6px;color:${b}">▼ Required documents</h3>
      <p style="margin:0 0 6px;color:#334155">Please present on the rental day:</p>
      <ol style="margin:0 0 8px;padding-left:22px;color:#334155;line-height:1.7">
        <li>A valid International Driving Permit (IDP)</li>
        <li>Your local (HK / Macau) driving licence</li>
        <li>Passport</li>
      </ol>
      <p style="margin:0 0 4px;color:#64748b;font-size:13px">Without any of these, or if they are expired, we cannot provide the service. The shop will photocopy your documents for its records.</p>

      <h3 style="margin:24px 0 6px;color:${b}">▼ Cancellation policy</h3>
      <ul style="margin:0 0 8px;padding-left:22px;color:#334155;line-height:1.7">
        <li>6 days before: 20% of the rental invoice total</li>
        <li>2 days before: 30% of the rental invoice total</li>
        <li>Same day: 50% of the rental invoice total</li>
      </ul>
      <p style="margin:0 0 4px;color:#64748b;font-size:13px">A no-show forfeits any refund. Each shop retains final discretion over rentals. Please plan your rental period, time, model and location in advance and avoid cancelling unless necessary.</p>

      <p style="margin:20px 0 0;color:#334155">Please arrive about 30 minutes before departure to receive a briefing from staff and sign the documents. If anything changes before departure, contact us any time.</p>
      <p style="margin:16px 0 0;color:#334155">Thank you for choosing Rental819.hk — enjoy the ride!</p>
    </div>

    <div style="background:${b};color:#ffffff;text-align:center;padding:22px 20px;margin-top:24px">
      <div style="font-weight:800;font-size:16px">Helmet King 頭盔王 × RENTAL819.HK</div>
      <div style="margin-top:8px;font-size:13px;opacity:.9">Shop address: 香港旺角東安街43號地舖</div>
      <div style="margin-top:4px;font-size:13px;opacity:.9">Business hours: Mon–Sun 11:00 – 20:30</div>
      <div style="margin-top:10px;font-size:13px">
        <a href="${site.whatsapp}" style="color:#ffffff;text-decoration:underline">WhatsApp ${site.phone}</a>
        &nbsp;·&nbsp;
        <a href="mailto:${site.email}" style="color:#ffffff;text-decoration:underline">${site.email}</a>
      </div>
    </div>
  </div>
</div>`;

  return { subject, body, html };
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
