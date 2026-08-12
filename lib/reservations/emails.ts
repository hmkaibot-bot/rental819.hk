import { ADDON_LABELS, type Reservation, type ReservationAddons } from "./types";
import { site } from "@/lib/site";

/** Add-ons as a one-line summary, for the customer's confirmation email. */
function addonList(r: Reservation): string {
  const on: string[] = [];
  for (const a of ADDON_LABELS) {
    const v = r.addons?.[a.key];
    if (typeof v === "number" && v > 0) on.push(`${a.zh} x${v}`);
    else if (v === true) on.push(a.zh);
  }
  return on.length ? on.join(", ") : "—";
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

/** `2026-08-09` → `2026/08/09`, the form the Japan office reads. */
export function slashDate(v: string | null | undefined): string {
  const s = (v ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s.replace(/-/g, "/") : s;
}

/**
 * `14:00:00` → `14:00`. Postgres `time` columns come back with seconds, which
 * the demo fixtures (hand-written as `14:00`) do not reproduce — so this only
 * shows up against real data.
 */
export function hhmm(v: string | null | undefined): string {
  const s = (v ?? "").trim();
  return /^\d{2}:\d{2}(:\d{2})?$/.test(s) ? s.slice(0, 5) : s;
}

/**
 * The OPTION(S) REQUEST rows, in the order the Japan office's own sheet lists
 * them. Helmets get one row per unit rather than a quantity, matching that
 * sheet — two of each are offered, which is the most a booking has ever asked
 * for. ETC is absent by design: it is arranged at the branch on collection, not
 * reserved ahead. CARDO is absent too — that is a Hong Kong-side rental and
 * never involves Japan.
 */
function optionRows(r: Reservation): { label: string; on: boolean }[] {
  const a = r.addons ?? {};
  const full = Number(a.full_face) || 0;
  const open = Number(a.open_face) || 0;
  // Two rows each is what the sheet shows, but the booking form accepts any
  // number — so grow the block rather than silently under-ordering helmets.
  const helmets = (label: string, qty: number) =>
    Array.from({ length: Math.max(2, qty) }, (_, i) => ({ label, on: i < qty }));
  return [
    ...helmets("FULL FACE", full),
    ...helmets("OPEN FACE", open),
    { label: "TOP CASE", on: a.topcase === true },
    { label: "SIDE CASE", on: a.pannier === true },
    { label: "SIDE BAG", on: a.sidebag === true },
    { label: "SHUTTLE BUS", on: a.shuttle_bus === true },
    { label: "LUGGAGE STORAGE", on: a.luggage_storage === true },
    { label: "MAMO RIDE", on: a.mamoride === true },
  ];
}

/** The admin login the Japan office is pointed to for the full booking detail. */
const BOOKING_PANEL_URL = "https://rental819.hk/admin/login";

/**
 * Email to Rental819 Japan requesting the booking (step 4).
 *
 * Laid out as the tables the Japan office already reads off — the same row
 * order and wording as the message the team used to compose by hand. Returns
 * HTML plus a plain-text fallback for clients that will not render it.
 *
 * `staffName` is the responsible colleague, signed under "Best regards,". It is
 * typed on the send screen at the moment of sending, so the preview (called
 * without it) simply shows "Best regards," on its own.
 */
export function jpReservationEmail(r: Reservation, staffName?: string) {
  const subject = `RENTAL819 RESERVATION #${r.booking_ref ?? ""}`;
  const val = (v: string | null | undefined) => (v ?? "").toString().trim();
  const signer = (staffName ?? "").trim();

  const booking: [string, string][] = [
    ["BOOKING REF #", val(r.booking_ref)],
    ["SHOP", val(r.shop)],
    ["RENTAL DATE", slashDate(r.pickup_date)],
    ["RENTAL TIME", hhmm(r.pickup_time)],
    ["RETURNING DATE", slashDate(r.return_date)],
    ["RETURNING TIME", hhmm(r.return_time)],
    ["BIKE PREFERENCE #1", val(r.bike_pref_1)],
    ["BIKE PREFERENCE #2", val(r.bike_pref_2)],
    ["BIKE PREFERENCE #3", val(r.bike_pref_3)],
  ];

  const customer: [string, string][] = [
    ["NAME", [val(r.name_en), val(r.name_zh)].filter(Boolean).join(" / ")],
    ["GENDER", val(r.gender)],
    ["DATE OF BIRTH", slashDate(r.dob)],
    ["EMAIL", val(r.email)],
    ["JAPANESE", val(r.japanese_ability)],
    ["ENGLISH", val(r.english_ability)],
    ["ADDRESS IN JAPAN", val(r.jp_address)],
    ["PHONE IN JAPAN", val(r.jp_phone)],
  ];

  const options = optionRows(r);

  // ---- plain-text fallback ----
  const pad = (s: string) => s.padEnd(20, " ");
  const textRows = (rows: [string, string][]) =>
    rows.map(([k, v]) => `  ${pad(k)}${v || "-"}`).join("\n");
  const body = [
    "Dear Ms Amano & team,",
    "",
    "Greetings from Motoblog HK.",
    "Below please find our new motorcycle rental request.",
    "",
    "[BOOKING]",
    textRows(booking),
    "",
    "[OPTION(S) REQUEST]",
    options.map((o) => `  ${pad(o.label)}${o.on ? "Y" : "-"}`).join("\n"),
    "",
    "[CUSTOMER]",
    textRows(customer),
    "",
    `Please refer to the booking panel (${BOOKING_PANEL_URL}) for more detail.`,
    "Thank you very much for your support.",
    "",
    "Best regards,",
    ...(signer ? [signer] : []),
  ].join("\n");

  // ---- HTML ----
  const border = "1px solid #000000";
  const th = `padding:8px 10px;border:${border};font-weight:700;white-space:nowrap;text-align:left`;
  const td = `padding:8px 10px;border:${border};text-align:center`;
  const row = ([k, v]: [string, string]) =>
    `<tr><td style="${th}">${escapeHtml(k)}</td><td style="${td}">${escapeHtml(v)}</td></tr>`;
  // The legacy `border` / `cellspacing` / `cellpadding` attributes are here on
  // purpose alongside the CSS: when the rendered preview is copied out and
  // pasted into Gmail's compose window, Gmail's sanitiser strips most inline
  // styling — but it keeps these HTML attributes, so the gridlines survive.
  const table = (inner: string) =>
    `<table border="1" cellspacing="0" cellpadding="8" style="border-collapse:collapse;width:100%;max-width:620px;margin:0 0 18px;font-size:14px;border:${border}"><tbody>${inner}</tbody></table>`;
  const heading = (label: string) =>
    `<tr><td colspan="2" style="${th};background:#f1f5f9">${label}</td></tr>`;

  // Font matches the customer confirmation email so the two read as one house.
  const html = `<div style="margin:0;padding:0;background:#ffffff">
  <div style="max-width:680px;margin:0 auto;padding:8px 4px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,'Noto Sans HK',sans-serif;color:#0f172a;line-height:1.6">
    <p style="margin:0 0 14px">Dear Ms Amano &amp; team,</p>
    <p style="margin:0 0 18px">
      Greetings from Motoblog HK.<br />
      Below please find our new motorcycle rental request.
    </p>

    ${table(booking.map(row).join(""))}

    ${table(
      heading("OPTION(S) REQUEST") +
        options
          .map(
            (o) =>
              `<tr><td style="${th}">${o.label}</td><td style="${td}">${o.on ? "Y" : "&nbsp;"}</td></tr>`,
          )
          .join(""),
    )}

    ${table(heading("CUSTOMER") + customer.map(row).join(""))}

    <p style="margin:0 0 14px">Please refer to the booking panel (<a href="${BOOKING_PANEL_URL}" style="color:#005bac">${BOOKING_PANEL_URL}</a>) for more detail.</p>
    <p style="margin:0 0 18px">Thank you very much for your support.</p>
    <p style="margin:0;color:#334155">Best regards,${signer ? `<br />${escapeHtml(signer)}` : ""}</p>
  </div>
</div>`;

  return { subject, body, html };
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

/** The booking data available at the moment the public form is submitted. */
export interface BookingAck {
  booking_ref: string | null;
  name_en?: string | null;
  name_zh?: string | null;
  shop?: string | null;
  pickup_date?: string | null;
  pickup_time?: string | null;
  return_date?: string | null;
  return_time?: string | null;
  bike_pref_1?: string | null;
  bike_pref_2?: string | null;
  bike_pref_3?: string | null;
  addons?: ReservationAddons;
  promo?: string | null;
}

/** Add-ons with both names (English as a parenthesised gloss), for the
 *  bilingual acknowledgement. */
function addonPairs(a?: ReservationAddons): string {
  if (!a) return "—";
  const on: string[] = [];
  for (const x of ADDON_LABELS) {
    const v = a[x.key];
    const label = x.zh === x.en ? x.zh : `${x.zh}（${x.en}）`;
    if (typeof v === "number" && v > 0) on.push(`${label} x${v}`);
    else if (v === true) on.push(label);
  }
  return on.length ? on.join("、") : "—";
}

/**
 * Automatic acknowledgement to the customer the moment the public booking form
 * is submitted — "we have received your request". Deliberately NOT the
 * confirmation email: nothing here promises a vehicle, and staff still verify
 * availability and send customerConfirmEmail by hand. Bilingual (formal
 * written Chinese first, then English) because the form does not reliably
 * capture the customer's preferred language.
 */
export function bookingReceivedEmail(b: BookingAck) {
  const ref = (b.booking_ref ?? "").trim();
  const zhName = b.name_zh ?? b.name_en ?? "客戶";
  const enName = b.name_en ?? b.name_zh ?? "Customer";
  const pickup =
    [slashDate(b.pickup_date), hhmm(b.pickup_time)].filter(Boolean).join(" ") || "—";
  const ret =
    [slashDate(b.return_date), hhmm(b.return_time)].filter(Boolean).join(" ") || "—";
  const bikes =
    [b.bike_pref_1, b.bike_pref_2, b.bike_pref_3].filter(Boolean).join("｜") || "—";

  const subject = `已收到您的租車預約申請${ref ? ` #${ref}` : ""}｜Booking request received — RENTAL819.HK`;

  // Bilingual labels so one summary table serves both language sections.
  const rows: [string, string][] = [
    ["預約編號 Booking Ref", ref ? `#${ref}` : "—"],
    ["取車店舖 Pick-up shop", b.shop ?? "—"],
    ["取車 Pick-up", pickup],
    ["還車 Return", ret],
    ["車款志願 Bike preference", bikes],
    ["加購項目 Add-ons", addonPairs(b.addons)],
    ...(b.promo ? ([["優惠代碼 Promo code", b.promo]] as [string, string][]) : []),
  ];

  const body = [
    `${zhName} 您好：`,
    "",
    "感謝您透過 RENTAL819.HK 提交電單車租賃預約申請，我們已收到以下資料：",
    "",
    ...rows.map(([k, v]) => `${k}：${v}`),
    "",
    "本公司職員將於核實車輛供應及檔期後，盡快向您發出正式確認電郵；屆時預約方為確認。",
    `如資料有任何錯漏，或有其他查詢，歡迎透過 WhatsApp ${site.phone} 或電郵 ${site.email} 與我們聯絡。`,
    "",
    "----------------------------------------",
    "",
    `Dear ${enName},`,
    "",
    "Thank you for your motorcycle rental booking request via RENTAL819.HK. We have received your request with the details listed above.",
    "Our team will verify vehicle availability and send you a formal confirmation email as soon as possible; your booking is confirmed only upon receipt of that confirmation.",
    `For any enquiry, please contact us via WhatsApp ${site.phone} or ${site.email}.`,
    "",
    "此電郵由系統自動發出，請勿直接回覆。",
    "This is an automated message; please do not reply directly to this email.",
    "",
    "Helmet King 頭盔王 × RENTAL819.HK",
    site.url,
  ].join("\n");

  // ---- HTML (house style shared with customerConfirmEmail) ----
  const assetBase = "https://rental819-hk.vercel.app";
  const bl = "#005bac";
  const row = ([label, value]: [string, string]) =>
    `<tr><td style="padding:5px 12px 5px 16px;color:#64748b;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:5px 16px 5px 0;font-weight:600;color:#0f172a">${escapeHtml(value)}</td></tr>`;

  const html = `<div style="margin:0;padding:0;background:#f1f5f9">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;font-family:-apple-system,'Segoe UI',Helvetica,Arial,'Noto Sans HK',sans-serif;color:#0f172a;line-height:1.7">
    <div style="text-align:center;background:${bl};padding:22px">
      <img src="${assetBase}/logo-lg.png" alt="RENTAL819" width="150" style="height:auto;border:0;display:inline-block" />
    </div>
    <div style="padding:28px 28px 8px">
      <h2 style="margin:0 0 4px;text-align:center;color:${bl}">已收到您的預約申請</h2>
      <p style="margin:0 0 20px;text-align:center;color:#334155">We have received your booking request</p>

      <p style="margin:0 0 12px">${escapeHtml(zhName)} 您好：</p>
      <p style="margin:0 0 16px">感謝您透過 RENTAL819.HK 提交電單車租賃預約申請，我們已收到以下資料：</p>

      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:10px">
        <tbody>
          <tr><td style="padding:12px 16px 6px" colspan="2">
            <div style="font-weight:800;color:${bl}">預約申請 Booking Request${ref ? ` #${escapeHtml(ref)}` : ""}</div>
          </td></tr>
          ${rows.map(row).join("")}
          <tr><td style="padding:6px" colspan="2"></td></tr>
        </tbody>
      </table>

      <p style="margin:16px 0 8px">本公司職員將於核實車輛供應及檔期後，盡快向您發出正式確認電郵；屆時預約方為確認。</p>
      <p style="margin:0 0 8px">如資料有任何錯漏，或有其他查詢，歡迎透過 <a href="${site.whatsapp}" style="color:${bl}">WhatsApp ${site.phone}</a> 或電郵 <a href="mailto:${site.email}" style="color:${bl}">${site.email}</a> 與我們聯絡。</p>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />

      <p style="margin:0 0 12px">Dear ${escapeHtml(enName)},</p>
      <p style="margin:0 0 8px">Thank you for your motorcycle rental booking request via RENTAL819.HK. We have received your request with the details listed above.</p>
      <p style="margin:0 0 8px">Our team will verify vehicle availability and send you a formal confirmation email as soon as possible; your booking is confirmed only upon receipt of that confirmation.</p>
      <p style="margin:0 0 16px">For any enquiry, please contact us via <a href="${site.whatsapp}" style="color:${bl}">WhatsApp ${site.phone}</a> or <a href="mailto:${site.email}" style="color:${bl}">${site.email}</a>.</p>

      <p style="margin:0 0 4px;color:#64748b;font-size:12px">此電郵由系統自動發出，請勿直接回覆。<br />This is an automated message; please do not reply directly to this email.</p>
    </div>

    <div style="background:${bl};color:#ffffff;text-align:center;padding:22px 20px;margin-top:24px">
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
