"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/site";
import { ATTR_KEY, trackEvent } from "@/lib/track";
import { readStored, removeStored, writeStored } from "@/lib/storage";
import {
  SHOP_AREAS,
  JP_ABILITY_OPTIONS,
  EN_ABILITY_OPTIONS,
} from "@/lib/reservations/types";
import { WhatsAppIcon, CheckIcon } from "./icons";

type Status = "idle" | "submitting" | "done" | "error";

const t = {
  "zh-hk": {
    // choose-a-bike link (opens /rental in a new tab)
    chooseBike: "選擇車款",
    chooseBikeHint: "想先睇下有咩車？",
    // section headings
    secRental: "租車詳情",
    secBike: "車款偏好",
    secRider: "駕駛人資料",
    secJapan: "在日聯絡資料",
    secEmergency: "緊急聯絡人",
    secAddons: "配件及加購",
    secConsent: "資格及同意",
    secNotes: "其他備註",
    // rental
    shop: "取車分店",
    shopHint: "租車及還車須於同一分店。",
    shopPlaceholder: "請選擇分店",
    pickupDate: "取車日期",
    pickupTime: "取車時間",
    returnDate: "還車日期",
    returnTime: "還車時間",
    // bike
    bikePref: "車款偏好（首選）",
    bikePref2: "車款偏好（次選）",
    bikePref3: "車款偏好（第三選）",
    bikeHint: "請填首選；如當地缺車，我們會按次序為你安排替換車款。",
    bikePh: "例如 CB400 / NC750X / Harley",
    // rider
    nameZh: "中文姓名",
    nameEn: "英文姓名",
    nameEnHint: "須與護照／國際車牌一致。",
    gender: "性別",
    genders: ["", "男", "女", "不透露"],
    dob: "出生日期",
    dobHint: "須年滿 18 歲。",
    email: "電郵",
    emailConfirm: "確認電郵",
    hkPhone: "電話 / WhatsApp",
    hkAddress: "居住地址（原居地）",
    jpAbility: "日語能力",
    enAbility: "英語能力",
    abilityPlaceholder: "請選擇",
    // japan
    jpAddress: "在日住宿地址",
    jpAddressHint: "供緊急聯絡用，請填實際住宿地址而非酒店名稱。",
    jpPhone: "在日聯絡電話",
    // emergency
    emName: "緊急聯絡人姓名",
    emPhone: "緊急聯絡人電話",
    // addons
    helmetFull: "全罩頭盔（數量）",
    helmetOpen: "開面頭盔（數量）",
    helmetSize: "頭盔尺碼",
    helmetSizePh: "例如 M / L（可多個）",
    addonsLabel: "加購配件",
    addons: {
      topcase: "尾箱",
      sidebag: "側袋",
      pannier: "側箱",
      cardo: "CARDO 對講機",
      shuttle_bus: "穿梭巴士",
      luggage_storage: "行李寄存",
    },
    shuttleNote: "只適用於部份分店",
    etcNote: "ETC 卡因供應有限，請到店取車時向職員查詢。",
    mamoride: "加購 MamoRide 補償（只限 15 日內預約）",
    promo: "優惠碼（如有）",
    promoPh: "例如 CARDO88",
    // consent
    idp: "本人已滿 18 歲，並持有正式電單車駕駛執照、有效國際駕駛執照（IDP）及護照。",
    idpHint: "沒有有效 IDP 恕無法租車。",
    consentPay:
      "本人已明白繳費詳情：須於租車發票發出後三個工作天內以銀行匯款／轉數快繳付。",
    consentCancel:
      "本人已明白取消政策：6 天前取消收 20%、2 天前收 30%、當日收 50%，NO SHOW 不設退款。",
    consentPrivacy: "本人已閱讀並同意",
    privacyLink: "私隱政策",
    // notes
    notes: "備註",
    notesPh: "行程、人數、團體預約或其他特別需求…",
    // actions
    submit: "提交租車預約",
    submitting: "提交中…",
    orWhatsapp: "或直接 WhatsApp 我們",
    done: "已收到你的租車預約！我們的香港團隊會於 3–5 個工作天內向你確認報價及可租車款。",
    refLabel: "預約編號：",
    ackPre: "我們已將收件通知電郵寄往 ",
    ackPost: "（如未收到，請檢查垃圾郵件）。",
    errRequired: "請填寫所有必填欄位（標示 * 者）。",
    missingPre: "請填寫：",
    listSep: "、",
    errEmail: "兩個電郵欄位不相符，請檢查。",
    errAge: "租車人須年滿 18 歲。",
    errDates: "還車日期／時間必須在取車之後。",
    errIdp: "必須持有有效國際駕駛執照（IDP）方可租車。",
    errConsent: "請剔選所有同意項目後方可提交。",
    errSubmit: "提交失敗，請稍後再試或直接 WhatsApp 我們。",
    required: "必填",
    optional: "可選",
  },
  en: {
    chooseBike: "Choose a bike",
    chooseBikeHint: "Want to see the bikes first?",
    secRental: "Rental details",
    secBike: "Bike preference",
    secRider: "Rider details",
    secJapan: "Contact in Japan",
    secEmergency: "Emergency contact",
    secAddons: "Accessories & add-ons",
    secConsent: "Eligibility & consent",
    secNotes: "Other notes",
    shop: "Pick-up branch",
    shopHint: "Pick-up and return must be at the same branch.",
    shopPlaceholder: "Select a branch",
    pickupDate: "Pick-up date",
    pickupTime: "Pick-up time",
    returnDate: "Return date",
    returnTime: "Return time",
    bikePref: "Bike preference (1st choice)",
    bikePref2: "Bike preference (2nd choice)",
    bikePref3: "Bike preference (3rd choice)",
    bikeHint: "1st choice required; if it's unavailable locally we arrange a substitute in your order of preference.",
    bikePh: "e.g. CB400 / NC750X / Harley",
    nameZh: "Name (Chinese)",
    nameEn: "Name (English)",
    nameEnHint: "Must match your passport / International Driving Permit.",
    gender: "Gender",
    genders: ["", "Male", "Female", "Prefer not to say"],
    dob: "Date of birth",
    dobHint: "Must be 18 or older.",
    email: "Email",
    emailConfirm: "Confirm email",
    hkPhone: "Phone / WhatsApp",
    hkAddress: "Home address (country of residence)",
    jpAbility: "Japanese ability",
    enAbility: "English ability",
    abilityPlaceholder: "Please choose",
    jpAddress: "Accommodation address in Japan",
    jpAddressHint: "For emergency contact — the actual address, not the hotel name.",
    jpPhone: "Contact number in Japan",
    emName: "Emergency contact name",
    emPhone: "Emergency contact phone",
    helmetFull: "Full-face helmets (qty)",
    helmetOpen: "Open-face helmets (qty)",
    helmetSize: "Helmet size(s)",
    helmetSizePh: "e.g. M / L (multiple allowed)",
    addonsLabel: "Add-on accessories",
    addons: {
      topcase: "Tail box",
      sidebag: "Side bag",
      pannier: "Side box",
      cardo: "CARDO intercom",
      shuttle_bus: "Shuttle bus",
      luggage_storage: "Luggage storage",
    },
    shuttleNote: "available at selected branches only",
    etcNote: "ETC cards are limited in supply — please ask staff at the branch when you collect the bike.",
    mamoride: "Add MamoRide compensation (reservations of 15 days or less)",
    promo: "Promo code (if any)",
    promoPh: "e.g. CARDO88",
    idp: "I am 18 or older and hold a full motorcycle licence, a valid International Driving Permit (IDP) and a passport.",
    idpHint: "We cannot rent without a valid IDP.",
    consentPay:
      "I understand payment is due to Helmet King within three working days of the rental invoice, by bank transfer / FPS.",
    consentCancel:
      "I understand the cancellation policy: 20% 6 days before, 30% 2 days before, 50% same day; no refund for a no-show.",
    consentPrivacy: "I have read and agree to the",
    privacyLink: "Privacy Policy",
    notes: "Notes",
    notesPh: "Itinerary, group size, group booking or other special needs…",
    submit: "Submit rental booking",
    submitting: "Submitting…",
    orWhatsapp: "or WhatsApp us directly",
    done: "Got your rental booking! Our Hong Kong team will confirm your quote and available bikes within 3–5 working days.",
    refLabel: "Reference: ",
    ackPre: "We've emailed an acknowledgement to ",
    ackPost: " (check your spam folder if it isn't there).",
    errRequired: "Please fill in all required fields (marked *).",
    missingPre: " Please complete: ",
    listSep: ", ",
    errEmail: "The two email fields don't match — please check.",
    errAge: "The renter must be 18 or older.",
    errDates: "Return date/time must be after pick-up.",
    errIdp: "A valid International Driving Permit (IDP) is required to rent.",
    errConsent: "Please tick all consent items before submitting.",
    errSubmit: "Submission failed — please try again or WhatsApp us.",
    required: "required",
    optional: "optional",
  },
} as const;

const emptyForm = {
  shop: "",
  pickup_date: "",
  pickup_time: "",
  return_date: "",
  return_time: "",
  bike_pref_1: "",
  bike_pref_2: "",
  bike_pref_3: "",
  name_zh: "",
  name_en: "",
  gender: "",
  dob: "",
  email: "",
  email_confirm: "",
  hk_phone: "",
  hk_address: "",
  japanese_ability: "",
  english_ability: "",
  jp_address: "",
  jp_phone: "",
  emergency_contact: "",
  emergency_phone: "",
  helmet_full: "0",
  helmet_open: "0",
  helmet_size: "",
  addon_topcase: false,
  addon_sidebag: false,
  addon_pannier: false,
  addon_cardo: false,
  addon_etc: false,
  addon_shuttle_bus: false,
  addon_luggage_storage: false,
  addon_mamoride: false,
  promo: "",
  notes: "",
  idp: false,
  consent_pay: false,
  consent_cancel: false,
  consent_privacy: false,
};

type Form = typeof emptyForm;
type Copy = (typeof t)[Locale];
type Problem = { key: keyof Copy; fields: (keyof Form)[] };

const REQUIRED = [
  "shop",
  "pickup_date",
  "pickup_time",
  "return_date",
  "return_time",
  "bike_pref_1",
  "name_zh",
  "name_en",
  "dob",
  "email",
  "hk_phone",
  "emergency_contact",
  "emergency_phone",
] as const;
const CONSENTS = ["consent_pay", "consent_cancel", "consent_privacy"] as const;

// Never saved in the draft: the consents must be ticked afresh, and these
// personal details are not left on the device.
const NOT_IN_DRAFT: readonly (keyof Form)[] = [
  "idp",
  ...CONSENTS,
  "dob",
  "hk_address",
  "emergency_contact",
  "emergency_phone",
];

/** The draftable fields of `src`, keeping only values of the expected type. */
function draftFrom(src: unknown): Partial<Form> {
  const out: Record<string, unknown> = {};
  if (src && typeof src === "object") {
    for (const k of Object.keys(emptyForm) as (keyof Form)[]) {
      const v = (src as Record<string, unknown>)[k];
      if (!NOT_IN_DRAFT.includes(k) && typeof v === typeof emptyForm[k]) out[k] = v;
    }
  }
  return out as Partial<Form>;
}

function hkToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Hong_Kong" }).format(new Date());
}

const fieldBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition";
const field = `${fieldBase} border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20`;
const fieldBad = `${fieldBase} border-accent-500 ring-2 ring-accent-500`;
const checkCls = "h-4 w-4 rounded border-slate-300 text-brand-600";
const labelCls = "mb-1.5 block text-sm font-medium text-ink-soft";

// Defined at module scope so it isn't recreated each render (which would remount
// the inputs and drop focus on every keystroke).
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-slate-100 p-5 sm:p-6">
      <legend className="px-2 text-sm font-bold uppercase tracking-wide text-brand-700">
        {title}
      </legend>
      <div className="mt-2 space-y-5">{children}</div>
    </fieldset>
  );
}

function ageFrom(dob: string): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export default function BookingForm({ locale }: { locale: Locale }) {
  const c = t[locale];
  const isEn = locale === "en";
  const draftKey = `r819_booking_draft_${locale}`;
  const [status, setStatus] = useState<Status>("idle");
  const [errKey, setErrKey] = useState<keyof typeof c | null>(null);
  const [badFields, setBadFields] = useState<(keyof Form)[]>([]);
  const [form, setForm] = useState<Form>(emptyForm);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [ack, setAck] = useState(false);
  // Set after mount: this page is prerendered, so a server-side "today" would
  // be the build date.
  const [todayISO, setTodayISO] = useState<string>();
  // The ?bike= value already merged into the draft, saved alongside it.
  const bikeApplied = useRef<string | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // Restore the draft, then merge /rental's ?bike=… into it. Read from window
  // rather than useSearchParams, which would need a Suspense boundary on this
  // static page.
  useEffect(() => {
    setTodayISO(hkToday());
    const saved = readStored(draftKey);
    const draft = draftFrom(saved);
    const savedBike = (saved as { _bike?: unknown } | null)?._bike;
    let bike: string | null = null;
    try {
      bike = new URLSearchParams(window.location.search).get("bike")?.slice(0, 80) || null;
    } catch {
      // Unparseable query — leave the field as it is.
    }
    // A ?bike= the draft already took in (i.e. this is a reload) must not
    // overwrite what the rider has typed since.
    if (bike && bike !== savedBike) draft.bike_pref_1 = bike;
    bikeApplied.current = bike ?? (typeof savedBike === "string" ? savedBike : null);
    if (Object.keys(draft).length) setForm((f) => ({ ...f, ...draft }));
  }, [draftKey]);

  useEffect(() => {
    // `form` is still the emptyForm object until something is typed or restored.
    if (form === emptyForm || status === "done") return;
    const id = window.setTimeout(
      () => writeStored(draftKey, { ...draftFrom(form), _bike: bikeApplied.current }),
      500,
    );
    return () => window.clearTimeout(id);
  }, [form, status, draftKey]);

  useEffect(() => {
    if (status !== "done") return;
    // Cleared here rather than in onSubmit so a pending draft save has already
    // been cancelled and cannot write the draft back.
    removeStored(draftKey);
    removeStored(ATTR_KEY);
    doneRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [status, draftKey]);

  const clearBad = (k: keyof Form) =>
    setBadFields((b) => (b.includes(k) ? b.filter((x) => x !== k) : b));
  const setText =
    (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const v = e.target.value;
      setForm((f) => ({ ...f, [k]: v }));
      clearBad(k);
    };
  const setCheck = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.checked;
    setForm((f) => ({ ...f, [k]: v }));
    clearBad(k);
  };

  // id and name are the Form key, so each <label htmlFor> and the error focus
  // can find the control.
  const ctl = (k: keyof Form) => ({
    id: k,
    name: k,
    "aria-invalid": badFields.includes(k) || undefined,
    className: badFields.includes(k) ? fieldBad : field,
  });
  const box = (k: keyof Form, extra = "") => ({
    id: k,
    name: k,
    type: "checkbox",
    "aria-invalid": badFields.includes(k) || undefined,
    className: `${checkCls} ${extra} ${badFields.includes(k) ? "ring-2 ring-accent-500" : "focus:ring-brand-500"}`,
    checked: form[k] as boolean,
    onChange: setCheck(k),
  });

  const requiredLabel: Record<(typeof REQUIRED)[number], string> = {
    shop: c.shop,
    pickup_date: c.pickupDate,
    pickup_time: c.pickupTime,
    return_date: c.returnDate,
    return_time: c.returnTime,
    bike_pref_1: c.bikePref,
    name_zh: c.nameZh,
    name_en: c.nameEn,
    dob: c.dob,
    email: c.email,
    hk_phone: c.hkPhone,
    emergency_contact: c.emName,
    emergency_phone: c.emPhone,
  };

  function validate(): Problem | null {
    const missing = REQUIRED.filter((k) => !form[k].trim());
    if (missing.length) return { key: "errRequired", fields: [...missing] };
    if (form.email.trim() !== form.email_confirm.trim())
      return { key: "errEmail", fields: ["email_confirm"] };
    const age = ageFrom(form.dob);
    if (age === null || age < 18) return { key: "errAge", fields: ["dob"] };
    const pickup = `${form.pickup_date}T${form.pickup_time}`;
    const ret = `${form.return_date}T${form.return_time}`;
    if (new Date(ret) <= new Date(pickup))
      return { key: "errDates", fields: ["return_date", "return_time"] };
    if (!form.idp) return { key: "errIdp", fields: ["idp"] };
    const unticked = CONSENTS.filter((k) => !form[k]);
    if (unticked.length) return { key: "errConsent", fields: [...unticked] };
    return null;
  }

  function waMessage() {
    const lines = [
      locale === "en" ? "Rental819 rental booking" : "Rental819 租車預約",
      `${c.shop}: ${form.shop}`,
      `${c.pickupDate}: ${form.pickup_date} ${form.pickup_time}`,
      `${c.returnDate}: ${form.return_date} ${form.return_time}`,
      `${c.bikePref}: ${form.bike_pref_1}`,
      `${c.nameEn}: ${form.name_en}`,
      `${c.hkPhone}: ${form.hk_phone}`,
    ].filter(Boolean);
    return lines.join("\n");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    trackEvent("booking_submit_attempt");
    const problem = validate();
    if (problem) {
      trackEvent("booking_validation_error", { reason: problem.key });
      setErrKey(problem.key);
      setBadFields(problem.fields);
      setStatus("error");
      const el = document.getElementById(problem.fields[0]);
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: "center" });
      return;
    }
    setErrKey(null);
    setBadFields([]);
    setStatus("submitting");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale, attribution: readStored(ATTR_KEY) }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setBookingRef(typeof data.booking_ref === "string" ? data.booking_ref : null);
        setAck(Boolean(data.ack_email));
        trackEvent("booking_submitted", { locale });
        setStatus("done");
      } else {
        trackEvent("booking_submit_failed");
        setErrKey("errSubmit");
        setStatus("error");
      }
    } catch {
      trackEvent("booking_submit_failed");
      setErrKey("errSubmit");
      setStatus("error");
    }
  }

  if (status === "done") {
    const waText = isEn
      ? bookingRef
        ? `Hi, I've just submitted rental booking #${bookingRef} (${form.name_en}).`
        : `Hi, I've just submitted a rental booking (${form.name_en}).`
      : bookingRef
        ? `你好，我啱啱提交咗租車預約 #${bookingRef}（${form.name_en}）`
        : `你好，我啱啱提交咗租車預約（${form.name_en}）`;
    return (
      <div
        ref={doneRef}
        className="scroll-mt-24 rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white">
          <CheckIcon className="h-7 w-7" />
        </div>
        <p className="mt-4 text-lg font-semibold text-ink">{c.done}</p>
        {bookingRef && (
          <p className="mt-2 text-sm">
            {c.refLabel}#{bookingRef}
          </p>
        )}
        {ack && (
          <p className="mt-2 text-sm text-ink-soft">
            {c.ackPre}
            <span className="font-semibold">{form.email.trim()}</span>
            {c.ackPost}
          </p>
        )}
        <a
          href={whatsappLink(waText)}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="booking-done-wa"
          className="btn-primary mt-6"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
    );
  }

  const star = <span className="text-accent-600">*</span>;
  const sp = isEn ? " " : "";
  const missingLabels =
    errKey === "errRequired"
      ? REQUIRED.filter((k) => badFields.includes(k)).map((k) => requiredLabel[k])
      : [];

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* Rental details */}
      <Section title={c.secRental}>
        <div>
          <label htmlFor="shop" className={labelCls}>{c.shop} {star}</label>
          <select {...ctl("shop")} value={form.shop} onChange={setText("shop")}>
            <option value="">{c.shopPlaceholder}</option>
            {SHOP_AREAS.map((a) => (
              <optgroup key={a.area} label={a.area}>
                {a.shops.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="mt-1 text-xs text-ink-muted">{c.shopHint}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="pickup_date" className={labelCls}>{c.pickupDate} {star}</label>
            <input {...ctl("pickup_date")} type="date" min={todayISO} value={form.pickup_date} onChange={setText("pickup_date")} />
          </div>
          <div>
            <label htmlFor="pickup_time" className={labelCls}>{c.pickupTime} {star}</label>
            <input {...ctl("pickup_time")} type="time" value={form.pickup_time} onChange={setText("pickup_time")} />
          </div>
          <div>
            <label htmlFor="return_date" className={labelCls}>{c.returnDate} {star}</label>
            <input {...ctl("return_date")} type="date" min={form.pickup_date || todayISO} value={form.return_date} onChange={setText("return_date")} />
          </div>
          <div>
            <label htmlFor="return_time" className={labelCls}>{c.returnTime} {star}</label>
            <input {...ctl("return_time")} type="time" value={form.return_time} onChange={setText("return_time")} />
          </div>
        </div>
      </Section>

      {/* Bike preference */}
      <Section title={c.secBike}>
        <p className="text-xs text-ink-muted">
          {c.bikeHint}
          {sp}
          {c.chooseBikeHint}
          {sp}
          {/* New tab, so the half-filled form stays open here. */}
          <Link href={localePath(locale, "/rental")} target="_blank" className="font-semibold text-brand-700">
            {c.chooseBike} ↗
          </Link>
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="bike_pref_1" className={labelCls}>{c.bikePref} {star}</label>
            <input {...ctl("bike_pref_1")} value={form.bike_pref_1} onChange={setText("bike_pref_1")} placeholder={c.bikePh} />
          </div>
          <div>
            <label htmlFor="bike_pref_2" className={labelCls}>{c.bikePref2}</label>
            <input {...ctl("bike_pref_2")} value={form.bike_pref_2} onChange={setText("bike_pref_2")} placeholder={c.bikePh} />
          </div>
          <div>
            <label htmlFor="bike_pref_3" className={labelCls}>{c.bikePref3}</label>
            <input {...ctl("bike_pref_3")} value={form.bike_pref_3} onChange={setText("bike_pref_3")} placeholder={c.bikePh} />
          </div>
        </div>
      </Section>

      {/* Rider details */}
      <Section title={c.secRider}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name_zh" className={labelCls}>{c.nameZh} {star}</label>
            <input {...ctl("name_zh")} autoComplete="off" value={form.name_zh} onChange={setText("name_zh")} />
          </div>
          <div>
            <label htmlFor="name_en" className={labelCls}>{c.nameEn} {star}</label>
            <input {...ctl("name_en")} autoComplete="name" value={form.name_en} onChange={setText("name_en")} />
            <p className="mt-1 text-xs text-ink-muted">{c.nameEnHint}</p>
          </div>
          <div>
            <label htmlFor="gender" className={labelCls}>{c.gender}</label>
            <select {...ctl("gender")} value={form.gender} onChange={setText("gender")}>
              {c.genders.map((g, i) => (
                <option key={i} value={g}>{g || "—"}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dob" className={labelCls}>{c.dob} {star}</label>
            <input {...ctl("dob")} type="date" autoComplete="bday" value={form.dob} onChange={setText("dob")} />
            <p className="mt-1 text-xs text-ink-muted">{c.dobHint}</p>
          </div>
          <div>
            <label htmlFor="email" className={labelCls}>{c.email} {star}</label>
            <input {...ctl("email")} type="email" autoComplete="email" value={form.email} onChange={setText("email")} placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="email_confirm" className={labelCls}>{c.emailConfirm} {star}</label>
            <input {...ctl("email_confirm")} type="email" autoComplete="email" value={form.email_confirm} onChange={setText("email_confirm")} placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="hk_phone" className={labelCls}>{c.hkPhone} {star}</label>
            <input {...ctl("hk_phone")} type="tel" inputMode="tel" autoComplete="tel" value={form.hk_phone} onChange={setText("hk_phone")} placeholder="+852 9xxx xxxx" />
          </div>
          <div>
            <label htmlFor="hk_address" className={labelCls}>{c.hkAddress}</label>
            <input {...ctl("hk_address")} autoComplete="street-address" value={form.hk_address} onChange={setText("hk_address")} />
          </div>
          {/* Japanese and English are asked separately and answered from their
              own fixed lists — the shop reads these to decide how to brief the
              rider, so the wording has to be one they recognise. */}
          <div>
            <label htmlFor="japanese_ability" className={labelCls}>{c.jpAbility}</label>
            <select {...ctl("japanese_ability")} value={form.japanese_ability} onChange={setText("japanese_ability")}>
              <option value="">{c.abilityPlaceholder}</option>
              {JP_ABILITY_OPTIONS.map((a) => (
                <option key={a.value} value={a.value}>{isEn ? a.en : a.zh}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="english_ability" className={labelCls}>{c.enAbility}</label>
            <select {...ctl("english_ability")} value={form.english_ability} onChange={setText("english_ability")}>
              <option value="">{c.abilityPlaceholder}</option>
              {EN_ABILITY_OPTIONS.map((a) => (
                <option key={a.value} value={a.value}>{isEn ? a.en : a.zh}</option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {/* In Japan */}
      <Section title={c.secJapan}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="jp_address" className={labelCls}>{c.jpAddress}</label>
            <input {...ctl("jp_address")} value={form.jp_address} onChange={setText("jp_address")} />
            <p className="mt-1 text-xs text-ink-muted">{c.jpAddressHint}</p>
          </div>
          <div>
            <label htmlFor="jp_phone" className={labelCls}>{c.jpPhone}</label>
            <input {...ctl("jp_phone")} type="tel" inputMode="tel" value={form.jp_phone} onChange={setText("jp_phone")} />
          </div>
        </div>
      </Section>

      {/* Emergency */}
      <Section title={c.secEmergency}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="emergency_contact" className={labelCls}>{c.emName} {star}</label>
            <input {...ctl("emergency_contact")} value={form.emergency_contact} onChange={setText("emergency_contact")} />
          </div>
          <div>
            <label htmlFor="emergency_phone" className={labelCls}>{c.emPhone} {star}</label>
            <input {...ctl("emergency_phone")} type="tel" inputMode="tel" value={form.emergency_phone} onChange={setText("emergency_phone")} />
          </div>
        </div>
      </Section>

      {/* Add-ons */}
      <Section title={c.secAddons}>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="helmet_full" className={labelCls}>{c.helmetFull}</label>
            <select {...ctl("helmet_full")} value={form.helmet_full} onChange={setText("helmet_full")}>
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={String(n)}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="helmet_open" className={labelCls}>{c.helmetOpen}</label>
            <select {...ctl("helmet_open")} value={form.helmet_open} onChange={setText("helmet_open")}>
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={String(n)}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="helmet_size" className={labelCls}>{c.helmetSize}</label>
            <input {...ctl("helmet_size")} value={form.helmet_size} onChange={setText("helmet_size")} placeholder={c.helmetSizePh} />
          </div>
        </div>
        <div>
          <p className={labelCls}>{c.addonsLabel}</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {([
              ["addon_topcase", c.addons.topcase],
              ["addon_sidebag", c.addons.sidebag],
              ["addon_pannier", c.addons.pannier],
              ["addon_cardo", c.addons.cardo],
              ["addon_shuttle_bus", c.addons.shuttle_bus],
              ["addon_luggage_storage", c.addons.luggage_storage],
            ] as const).map(([key, label]) => (
              <label key={key} htmlFor={key} className="flex items-center gap-2.5 text-sm text-ink-soft">
                <input {...box(key)} />
                {label}
                {key === "addon_shuttle_bus" && (
                  <span className="text-xs text-ink-muted">（{c.shuttleNote}）</span>
                )}
              </label>
            ))}
          </div>
          {/* ETC is not a customer-selectable add-on: stock is limited and it is
              arranged at the branch on collection. */}
          <p className="mt-2.5 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-ink-muted">
            {c.etcNote}
          </p>
        </div>
        <label htmlFor="addon_mamoride" className="flex items-center gap-2.5 text-sm text-ink-soft">
          <input {...box("addon_mamoride")} />
          {c.mamoride}
        </label>
        <div className="sm:max-w-xs">
          <label htmlFor="promo" className={labelCls}>{c.promo}</label>
          <input {...ctl("promo")} value={form.promo} onChange={setText("promo")} placeholder={c.promoPh} />
        </div>
      </Section>

      {/* Notes */}
      <Section title={c.secNotes}>
        <label htmlFor="notes" className="sr-only">{c.notes}</label>
        <textarea {...ctl("notes")} rows={4} value={form.notes} onChange={setText("notes")} placeholder={c.notesPh} />
      </Section>

      {/* Eligibility & consent */}
      <Section title={c.secConsent}>
        <label htmlFor="idp" className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input {...box("idp", "mt-0.5")} />
          <span>{c.idp} {star}<br /><span className="text-xs text-ink-muted">{c.idpHint}</span></span>
        </label>
        <label htmlFor="consent_pay" className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input {...box("consent_pay", "mt-0.5")} />
          <span>{c.consentPay} {star}</span>
        </label>
        <label htmlFor="consent_cancel" className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input {...box("consent_cancel", "mt-0.5")} />
          <span>{c.consentCancel} {star}</span>
        </label>
        <label htmlFor="consent_privacy" className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input {...box("consent_privacy", "mt-0.5")} />
          <span>
            {c.consentPrivacy}{" "}
            <Link href={localePath(locale, "/privacy")} className="text-brand-700 underline" target="_blank">
              {c.privacyLink}
            </Link>
            {isEn ? "." : "。"} {star}
          </span>
        </label>
      </Section>

      {status === "error" && errKey && (
        <p role="alert" className="rounded-lg bg-accent-50 px-4 py-3 text-sm text-accent-700">
          {c[errKey] as string}
          {missingLabels.length > 0 && `${c.missingPre}${missingLabels.join(c.listSep)}`}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === "submitting"} className="btn-primary disabled:opacity-60">
          {status === "submitting" ? c.submitting : c.submit}
        </button>
        <span className="text-sm text-ink-muted">{c.orWhatsapp}:</span>
        <a
          href={whatsappLink(waMessage())}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="booking-form-wa"
          className="btn bg-[#25D366] text-white hover:brightness-95"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
    </form>
  );
}
