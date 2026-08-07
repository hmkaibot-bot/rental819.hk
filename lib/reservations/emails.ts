import { ADDON_LABELS, type Reservation } from "./types";
import { site } from "@/lib/site";

function addonList(r: Reservation, lang: "zh" | "en" = "zh"): string {
  const on: string[] = [];
  for (const a of ADDON_LABELS) {
    const label = lang === "en" ? a.en : a.zh;
    const v = r.addons?.[a.key];
    if (typeof v === "number" && v > 0) on.push(`${label} x${v}`);
    else if (v === true) on.push(label);
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

export type EmailLang = "en" | "zh";

function paymentStatus(r: Reservation, lang: EmailLang = "en"): string {
  // 已確認預定 (confirmed) means the customer has paid.
  const paid = !!r.customer_paid_date || r.status === "confirmed";
  if (lang === "zh") return paid ? "已付款" : "待付款";
  return paid ? "Paid" : "Pending";
}

/** Email to Japan Rental819 to request/confirm the booking (step 4). Plain text. */
export function jpReservationEmail(r: Reservation) {
  const subject = `RENTAL819 RESERVATION #${r.booking_ref ?? ""}`;
  const dash = (v: string | null | undefined) => (v && String(v).trim()) || "—";
  const body = `Dear Rental819 team,

This is Helmet King, your agent in Hong Kong and Macau.
We would like to request the following motorcycle rental reservation.

■ Booking ref: ${dash(r.booking_ref)}
■ Shop: ${dash(r.shop)}
■ Rental period: ${period(r)}

[Customer]
- Name: ${dash(r.name_en)} / ${dash(r.name_zh)}
- Gender: ${dash(r.gender)}
- Date of birth: ${dash(r.dob)}
- Email: ${dash(r.email)}
- Japanese level: ${dash(r.japanese_ability)}
- English level: ${dash(r.english_ability)}
- Address in Japan: ${dash(r.jp_address)}
- Phone in Japan: ${dash(r.jp_phone)}

[Preferred motorcycle]
1. ${dash(r.bike_pref_1)}
2. ${dash(r.bike_pref_2)}
3. ${dash(r.bike_pref_3)}

[Add-ons]
${addonList(r, "en")}

Please confirm availability and the reservation.
Thank you very much for your support.

Helmet King × RENTAL819.HK`;
  return { subject, body };
}

/**
 * Confirmation email to the customer (step 8). Returns an HTML body (matching
 * the Helmet King email template — logo, details, required documents,
 * cancellation policy, footer) plus a plain-text fallback.
 */
const CONFIRM_STRINGS = {
  en: {
    subject: (ref: string) => `RENTAL819.HK Japan Motorcycle Self-Drive Reservation #${ref}`,
    dear: (n: string) => `Dear ${n},`,
    fallbackName: "Customer",
    title: "Booking Confirmation",
    tagline: "Your Japan motorcycle self-drive trip is all set!",
    order: "Order No.",
    pickup: "Pick-up time",
    ret: "Return time",
    duration: "Total duration",
    days: (d: number) => `${d} day(s)`,
    shop: "Rental819 shop",
    vehicle: "Vehicle",
    vehicleTbc: "(to be confirmed)",
    addons: "Add-ons",
    notes: "Notes",
    payment: "Payment status",
    docsH: "Required documents",
    docsLead: "Please present on the rental day:",
    docs: [
      "A valid International Driving Permit (IDP)",
      "Your local (HK / Macau) driving licence",
      "Passport",
    ],
    docsNote:
      "Without any of these, or if they are expired, we cannot provide the service. The shop will photocopy your documents for its records.",
    cxlH: "Cancellation policy",
    cxl: [
      "6 days before: 20% of the rental invoice total",
      "2 days before: 30% of the rental invoice total",
      "Same day: 50% of the rental invoice total",
    ],
    cxlNote:
      "A no-show forfeits any refund. Each shop retains final discretion over rentals. Please plan your rental period, time, model and location in advance and avoid cancelling unless necessary.",
    arrive:
      "Please arrive about 30 minutes before departure to receive a briefing from staff and sign the documents. If anything changes before departure, contact us any time.",
    thanks: "Thank you for choosing Rental819.hk — enjoy the ride!",
  },
  zh: {
    subject: (ref: string) => `RENTAL819.HK 日本電單車自駕遊預約確認 #${ref}`,
    dear: (n: string) => `親愛的 ${n}：`,
    fallbackName: "客人",
    title: "預約確認",
    tagline: "你的日本電單車自駕遊已經確認！",
    order: "訂單編號",
    pickup: "取車時間",
    ret: "還車時間",
    duration: "租用日數",
    days: (d: number) => `${d} 日`,
    shop: "出發店",
    vehicle: "車款",
    vehicleTbc: "（待確認）",
    addons: "加購項目",
    notes: "備註",
    payment: "付款狀態",
    docsH: "所需文件",
    docsLead: "租車當日請出示：",
    docs: ["有效國際車牌（IDP）", "本地（香港／澳門）車牌", "護照"],
    docsNote: "如缺少任何一項或已過期，恕不能提供服務。門店會影印你的證件作記錄之用。",
    cxlH: "取消政策",
    cxl: [
      "出發前 6 日：收取租金發票總額 20%",
      "出發前 2 日：收取租金發票總額 30%",
      "當日取消：收取租金發票總額 50%",
    ],
    cxlNote:
      "爽約（No-show）恕不退款。各門店對租賃保留最終決定權。請預先規劃租期、時間、車款及地點，非必要請勿取消。",
    arrive: "請於出發前約 30 分鐘到店，聽取職員講解並簽署文件。出發前如有任何變動，歡迎隨時聯絡我們。",
    thanks: "多謝選用 Rental819.hk，祝旅途愉快！",
  },
} as const;

/**
 * Confirmation email to the customer (step 8). Available in English or
 * Traditional Chinese — staff pick the language in the admin. Returns an HTML
 * body (Helmet King template) plus a plain-text fallback.
 */
export function customerConfirmEmail(r: Reservation, lang: EmailLang = "en") {
  const t = CONFIRM_STRINGS[lang];
  const ref = r.booking_ref ?? "";
  const subject = t.subject(ref);
  const name = r.name_en ?? r.name_zh ?? t.fallbackName;
  const days = rentalDays(r);
  const pickup = [r.pickup_date, r.pickup_time].filter(Boolean).join(" ") || "—";
  const ret = [r.return_date, r.return_time].filter(Boolean).join(" ") || "—";
  const vehicle = r.confirmed_bike ?? t.vehicleTbc;
  const pay = paymentStatus(r, lang);

  const body = `${t.dear(name)}

${t.title} — ${t.tagline}

${t.order}: #${ref}
${t.pickup}: ${pickup}
${t.ret}: ${ret}
${t.duration}: ${t.days(days)}

${t.shop}: ${r.shop ?? "—"}
${t.vehicle}: ${vehicle}
${t.addons}: ${addonList(r)}
${t.notes}: ${r.notes ?? "—"}
${t.payment}: ${pay}

${t.docsH} — ${t.docsLead}
1. ${t.docs[0]}
2. ${t.docs[1]}
3. ${t.docs[2]}
${t.docsNote}

${t.cxlH}:
- ${t.cxl[0]}
- ${t.cxl[1]}
- ${t.cxl[2]}
${t.cxlNote}

${t.arrive}

${t.thanks}

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
      <p style="margin:0 0 16px">${escapeHtml(t.dear(name))}</p>
      <h2 style="margin:0 0 4px;text-align:center;color:${b}">${t.title}</h2>
      <p style="margin:0 0 20px;text-align:center;color:#334155">${t.tagline}</p>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:10px">
        <tbody>
          <tr><td style="padding:14px 16px" colspan="2">
            <div style="font-weight:800;color:${b}">${t.order} #${escapeHtml(ref)}</div>
          </td></tr>
          ${row(t.pickup, pickup)}
          ${row(t.ret, ret)}
          ${row(t.duration, t.days(days))}
        </tbody>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-top:18px">
        <tbody>
          ${row(`▼ ${t.shop}`, r.shop ?? "—")}
          ${row(`▼ ${t.vehicle}`, vehicle)}
          ${row(`▼ ${t.addons}`, addonList(r))}
          ${row(`▼ ${t.notes}`, r.notes ?? "—")}
          ${row(`▼ ${t.payment}`, pay)}
        </tbody>
      </table>

      <h3 style="margin:24px 0 6px;color:${b}">▼ ${t.docsH}</h3>
      <p style="margin:0 0 6px;color:#334155">${t.docsLead}</p>
      <ol style="margin:0 0 8px;padding-left:22px;color:#334155;line-height:1.7">
        <li>${t.docs[0]}</li>
        <li>${t.docs[1]}</li>
        <li>${t.docs[2]}</li>
      </ol>
      <p style="margin:0 0 4px;color:#64748b;font-size:13px">${t.docsNote}</p>

      <h3 style="margin:24px 0 6px;color:${b}">▼ ${t.cxlH}</h3>
      <ul style="margin:0 0 8px;padding-left:22px;color:#334155;line-height:1.7">
        <li>${t.cxl[0]}</li>
        <li>${t.cxl[1]}</li>
        <li>${t.cxl[2]}</li>
      </ul>
      <p style="margin:0 0 4px;color:#64748b;font-size:13px">${t.cxlNote}</p>

      <p style="margin:20px 0 0;color:#334155">${t.arrive}</p>
      <p style="margin:16px 0 0;color:#334155">${t.thanks}</p>
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
