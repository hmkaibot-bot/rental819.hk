import { ADDON_LABELS, type Reservation } from "./types";

function addonList(r: Reservation): string {
  const on: string[] = [];
  for (const a of ADDON_LABELS) {
    const v = r.addons?.[a.key];
    if (typeof v === "number" && v > 0) on.push(`${a.zh} x${v}`);
    else if (v === true) on.push(a.zh);
  }
  return on.length ? on.join(", ") : "None";
}

function period(r: Reservation): string {
  const a = [r.pickup_date, r.pickup_time].filter(Boolean).join(" ");
  const b = [r.return_date, r.return_time].filter(Boolean).join(" ");
  return `${a || "?"}  →  ${b || "?"}`;
}

/** Email to Japan Rental819 to request/confirm the booking (step 4). */
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

/** Confirmation email to the customer (step 8). */
export function customerConfirmEmail(r: Reservation) {
  const subject = `RENTAL819.HK 日本電單車出租自駕遊預約 #${r.booking_ref ?? ""}`;
  const body = `${r.name_zh ?? r.name_en ?? "客人"} 你好，

多謝你經 RENTAL819.HK 預約日本電單車自駕遊！以下是你的預約確認：

預約編號：${r.booking_ref ?? ""}
出發店：${r.shop ?? ""}
租車期間：${period(r)}
確認車款：${r.confirmed_bike ?? "（待確認）"}
額外裝備：${addonList(r)}

取車當日請帶備：
• 護照
• 香港／澳門駕駛執照 ＋ 國際駕駛執照（IDP）
• 一張或以上信用卡

如需更改行程或有任何疑問，歡迎隨時 WhatsApp 我們：+852 9868 6569。
祝你旅途愉快，一路順風！

Helmet King × RENTAL819.HK
日本電單車自駕遊`;
  return { subject, body };
}
