"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon, CheckIcon } from "./icons";

type Status = "idle" | "submitting" | "done" | "error";

const copy = {
  "zh-hk": {
    service: "服務類型",
    services: ["租車自駕", "電單車旅行團", "自駕套票", "其他查詢"],
    name: "稱呼",
    email: "電郵",
    phone: "電話 / WhatsApp",
    region: "想去的地區（可選）",
    dates: "預計日期（可選）",
    bike: "心儀車款（可選）",
    message: "備註（可選）",
    submit: "提交預約查詢",
    submitting: "提交中…",
    orWhatsapp: "或直接 WhatsApp 我們",
    required: "請填寫稱呼及聯絡方法。",
    done: "已收到你的查詢！我們的香港團隊會盡快聯絡你。",
    error: "提交失敗，請稍後再試或直接 WhatsApp 我們。",
    namePh: "你的稱呼",
    emailPh: "you@example.com",
    phonePh: "例如 9xxx xxxx",
    regionPh: "例如 關東 / 北海道",
    datesPh: "例如 2026 年 9 月",
    bikePh: "例如 CB400 / Harley",
    messagePh: "行程、人數或其他需求…",
  },
  en: {
    service: "Service type",
    services: ["Rent & self-drive", "Guided tour", "Self-drive package", "Other enquiry"],
    name: "Name",
    email: "Email",
    phone: "Phone / WhatsApp",
    region: "Region of interest (optional)",
    dates: "Approx. dates (optional)",
    bike: "Preferred bike (optional)",
    message: "Notes (optional)",
    submit: "Submit booking enquiry",
    submitting: "Submitting…",
    orWhatsapp: "or WhatsApp us directly",
    required: "Please enter your name and a contact method.",
    done: "Got it! Our Hong Kong team will get back to you shortly.",
    error: "Submission failed — please try again or WhatsApp us.",
    namePh: "Your name",
    emailPh: "you@example.com",
    phonePh: "e.g. 9xxx xxxx",
    regionPh: "e.g. Kanto / Hokkaido",
    datesPh: "e.g. September 2026",
    bikePh: "e.g. CB400 / Harley",
    messagePh: "Itinerary, group size or other needs…",
  },
} as const;

export default function BookingForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    service: t.services[0],
    name: "",
    email: "",
    phone: "",
    region: "",
    dates: "",
    bike: "",
    message: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function waMessage() {
    const lines = [
      locale === "en" ? "Rental819 booking enquiry" : "Rental819 預約查詢",
      `${t.service}: ${form.service}`,
      `${t.name}: ${form.name}`,
      form.phone && `${t.phone}: ${form.phone}`,
      form.email && `${t.email}: ${form.email}`,
      form.region && `${t.region}: ${form.region}`,
      form.dates && `${t.dates}: ${form.dates}`,
      form.bike && `${t.bike}: ${form.bike}`,
      form.message && `${t.message}: ${form.message}`,
    ].filter(Boolean);
    return lines.join("\n");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || (!form.email.trim() && !form.phone.trim())) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white">
          <CheckIcon className="h-7 w-7" />
        </div>
        <p className="mt-4 text-lg font-semibold text-ink">{t.done}</p>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
    );
  }

  const field = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
  const label = "mb-1.5 block text-sm font-medium text-ink-soft";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className={label}>{t.service}</label>
        <select className={field} value={form.service} onChange={set("service")}>
          {t.services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>
            {t.name} <span className="text-accent-600">*</span>
          </label>
          <input className={field} value={form.name} onChange={set("name")} placeholder={t.namePh} />
        </div>
        <div>
          <label className={label}>{t.phone}</label>
          <input className={field} value={form.phone} onChange={set("phone")} placeholder={t.phonePh} />
        </div>
        <div>
          <label className={label}>{t.email}</label>
          <input className={field} type="email" value={form.email} onChange={set("email")} placeholder={t.emailPh} />
        </div>
        <div>
          <label className={label}>{t.region}</label>
          <input className={field} value={form.region} onChange={set("region")} placeholder={t.regionPh} />
        </div>
        <div>
          <label className={label}>{t.dates}</label>
          <input className={field} value={form.dates} onChange={set("dates")} placeholder={t.datesPh} />
        </div>
        <div>
          <label className={label}>{t.bike}</label>
          <input className={field} value={form.bike} onChange={set("bike")} placeholder={t.bikePh} />
        </div>
      </div>

      <div>
        <label className={label}>{t.message}</label>
        <textarea className={field} rows={4} value={form.message} onChange={set("message")} placeholder={t.messagePh} />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-accent-50 px-4 py-3 text-sm text-accent-700">
          {!form.name.trim() || (!form.email.trim() && !form.phone.trim()) ? t.required : t.error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === "submitting"} className="btn-primary disabled:opacity-60">
          {status === "submitting" ? t.submitting : t.submit}
        </button>
        <span className="text-sm text-ink-muted">{t.orWhatsapp}:</span>
        <a
          href={whatsappLink(waMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-[#25D366] text-white hover:brightness-95"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
    </form>
  );
}
