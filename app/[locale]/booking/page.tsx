import type { Metadata } from "next";
import { pageAlternates } from "@/lib/seo";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { site } from "@/lib/site";
import PageHero from "@/components/PageHero";
import BookingForm from "@/components/BookingForm";
import { WhatsAppIcon } from "@/components/icons";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return {
    alternates: pageAlternates(params.locale, "/booking"),
    title: isEn ? "Book / Enquire" : "預約查詢",
    description: isEn
      ? "Send a booking enquiry for a Japan motorcycle rental, guided tour or self-drive package."
      : "提交日本電單車租車、旅行團或自駕套票的預約查詢。",
  };
}

export default function BookingPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const isEn = locale === "en";

  const points = isEn
    ? [
        "18 or older with a valid International Driving Permit (IDP)",
        "Pick-up and return must be at the same branch",
        "Book 1 week to 1 month ahead (first-come, first-served)",
        "We reply within 3–5 working days in Chinese or English",
        "Payment by bank transfer / FPS within 3 working days of the invoice",
        "Cancellation: 20% 6 days before · 30% 2 days before · 50% same day · no-show non-refundable",
      ]
    : [
        "須年滿 18 歲並持有效國際駕駛執照（IDP）",
        "租車及還車必須於同一分店",
        "建議提前 1 星期至 1 個月預約（先到先得）",
        "我們會於 3–5 個工作天內以中文或英文回覆",
        "以銀行匯款／轉數快於發票後 3 個工作天內付款",
        "取消：6 天前 20%・2 天前 30%・當日 50%・NO SHOW 不退款",
      ];

  return (
    <>
      <PageHero
        image="/images/tours/hokkaido-2026-07-30.jpg"
        eyebrow={dict.nav.book}
        title={isEn ? "Booking enquiry" : "預約查詢"}
        intro={
          isEn
            ? "Tell us what you'd like to ride and when. Our Hong Kong team handles the rest — in your language."
            : "話俾我哋知你想租咩車、幾時出發，其餘交俾香港團隊，以你熟悉的語言為你安排。"
        }
      />

      <section className="container-x py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="order-2 lg:order-1">
            <div className="card p-6 sm:p-8">
              <BookingForm locale={locale} />
            </div>
          </div>

          <aside className="order-1 space-y-6 lg:order-2">
            <div className="rounded-2xl bg-brand-950 p-6 text-white">
              <h2 className="text-lg font-bold">
                {isEn ? "Prefer to chat?" : "想直接傾？"}
              </h2>
              <p className="mt-2 text-sm text-brand-100">
                {isEn
                  ? "Message our team on WhatsApp for the fastest reply."
                  : "WhatsApp 我們的團隊，回覆最快。"}
              </p>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white hover:brightness-95"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {site.phone}
              </a>
            </div>

            <ul className="space-y-3">
              {points.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm text-ink-soft">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600" />
                  {p}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
