import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { faq } from "@/lib/content/faq";
import { whatsappLink } from "@/lib/site";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { ChevronDown, WhatsAppIcon } from "@/components/icons";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return {
    title: "FAQ",
    description: isEn
      ? "Common questions about renting a motorcycle in Japan — eligibility, payment, insurance, pick-up and cancellation."
      : "日本租車常見問題：租車資格、付款、保險、取車還車及取消政策。",
  };
}

export default function FaqPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const isEn = locale === "en";
  const groups = faq[locale];

  return (
    <>
      <PageHero
        eyebrow={dict.nav.faq}
        title={isEn ? "Frequently asked questions" : "常見問題"}
        intro={
          isEn
            ? "Everything riders ask before booking. Can't find your answer? WhatsApp our team."
            : "租車前最常見的疑問。找不到答案？歡迎 WhatsApp 我們的團隊。"
        }
      />

      <section className="container-x py-16 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-12">
          {groups.map((group) => (
            <div key={group.category}>
              <h2 className="mb-4 text-lg font-bold text-brand-700">{group.category}</h2>
              <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100">
                {group.items.map((item, i) => (
                  <details key={i} className="group bg-white">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium text-ink hover:bg-slate-50">
                      {item.q}
                      <ChevronDown className="h-5 w-5 shrink-0 text-brand-500 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-5 pb-5 text-sm leading-7 text-ink-muted">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-slate-50 p-6 text-center">
            <p className="text-sm text-ink-soft">
              {isEn ? "Still have a question?" : "還有其他問題嗎？"}
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-3"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {dict.common.whatsapp}
            </a>
          </div>
        </div>
      </section>

      <div className="pb-20">
        <CTABand
          locale={locale}
          dict={dict}
          title={isEn ? "Ready when you are" : "隨時為你安排"}
          subtitle={
            isEn
              ? "Book a rental or plan a tour with our Hong Kong team."
              : "立即預約租車，或與香港團隊規劃行程。"
          }
        />
      </div>
    </>
  );
}
