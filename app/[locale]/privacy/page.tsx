import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { site, waEnquiry } from "@/lib/site";
import { breadcrumbLd } from "@/lib/jsonld";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import GuideArticle from "@/components/GuideArticle";
import JsonLd from "@/components/JsonLd";
import type { Block } from "@/lib/content/blocks";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return pageMeta(
    params.locale,
    "/privacy",
    isEn ? "Privacy Policy" : "私隱政策",
    isEn
      ? "How RENTAL819 Hong Kong collects and uses your personal data."
      : "RENTAL819 香港（頭盔王集團）私隱政策：說明我們透過預約及查詢表格收集哪些個人資料、如何使用及與日本 Rental819 等夥伴分享，以及你查閱和更正資料的權利。",
  );
}

const content: Record<Locale, { title: string; blocks: Block[] }> = {
  "zh-hk": {
    title: "私隱政策",
    blocks: [
      { type: "p", text: `本私隱政策說明 RENTAL819 香港（頭盔王集團）如何收集、使用及保護你透過本網站提供的個人資料。` },
      { type: "h", text: "我們收集的資料" },
      { type: "p", text: "當你透過預約或查詢表格與我們聯絡時，我們可能會收集你的稱呼、電話／WhatsApp、電郵，以及你提供的行程需求（如地區、日期、車款、備註）。當你提交預約表格時，我們亦會記錄你進入本網站的首個頁面、來源網站（只記錄網域名稱），以及連結上的廣告活動標籤（utm_source／utm_medium／utm_campaign）和連結是否帶有 Google／Facebook 點擊識別碼（不記錄識別碼本身），以了解哪些內容對騎士有幫助；本網站使用不設 Cookie 的流量統計。未提交的預約表格內容只會暫存在你的裝置上：行程資料（分店、日期、車款、頭盔、附加項目及優惠碼）由最後一次填寫起計 24 小時後不再還原，並會在你之後再瀏覽本網站時刪除；姓名、性別、出生日期、聯絡方式、地址、語言能力及備註只暫存於同一個瀏覽器分頁，關閉分頁即清除。成功提交預約後，以上暫存資料會即時刪除。" },
      { type: "h", text: "資料用途" },
      { type: "ul", items: [
        "處理及回覆你的租車、旅行團或套票查詢",
        "為你確認報價、安排預約及提供行程建議",
        "在你同意下向你發送相關優惠或資訊",
      ] },
      { type: "h", text: "資料分享" },
      { type: "p", text: "為完成你的預約，我們可能需要將必要資料轉交日本 Rental819 及相關合作夥伴（如酒店、旅行社）。除法律要求外，我們不會將你的個人資料出售予第三方。" },
      { type: "h", text: "資料保安" },
      { type: "p", text: "我們採取合理措施保護你的個人資料，防止未經授權的存取、披露或損毀。" },
      { type: "h", text: "你的權利" },
      { type: "p", text: `你有權查閱及更正我們持有的個人資料。如有任何私隱相關查詢，請電郵 ${site.email} 或 WhatsApp ${site.phone}。` },
      { type: "note", text: "使用本網站即表示你同意本私隱政策。政策如有更新，將於本頁公佈。" },
    ],
  },
  en: {
    title: "Privacy Policy",
    blocks: [
      { type: "p", text: `This policy explains how RENTAL819 Hong Kong (Helmet King group) collects, uses and protects the personal data you provide through this website.` },
      { type: "h", text: "Information we collect" },
      { type: "p", text: "When you contact us via the booking or enquiry form, we may collect your name, phone/WhatsApp, email and the trip details you provide (region, dates, bike preference, notes). When you submit the booking form we also record the first page you visited on this site, the referring website (domain only), any campaign tags on the link (utm_source/utm_medium/utm_campaign) and whether the link carried a Google or Facebook click ID (not the ID itself), so we can see which content helps riders; the site uses cookieless visitor statistics. An unsent booking form is kept only on your device: trip details (branch, dates, bikes, helmets, add-ons and promo code) are no longer restored 24 hours after you last edit them and are deleted on your next visit to this site; your name, gender, date of birth, contact details, addresses, language ability and notes are kept only in the same browser tab and are cleared when you close it. Once your booking is submitted, all of this is deleted straight away." },
      { type: "h", text: "How we use it" },
      { type: "ul", items: [
        "To process and respond to your rental, tour or package enquiry",
        "To confirm quotes, arrange bookings and offer itinerary advice",
        "To send you relevant offers or information, with your consent",
      ] },
      { type: "h", text: "Sharing" },
      { type: "p", text: "To fulfil your booking we may pass necessary details to Rental819 Japan and relevant partners (such as hotels and travel agencies). We do not sell your personal data to third parties except where required by law." },
      { type: "h", text: "Security" },
      { type: "p", text: "We take reasonable measures to protect your personal data against unauthorised access, disclosure or loss." },
      { type: "h", text: "Your rights" },
      { type: "p", text: `You may access and correct the personal data we hold about you. For any privacy enquiry, email ${site.email} or WhatsApp ${site.phone}.` },
      { type: "note", text: "By using this website you agree to this privacy policy. Any updates will be posted on this page." },
    ],
  },
};

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const c = content[locale];
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: dict.nav.home, url: localePath(locale, "/") },
          { name: dict.footer.privacy, url: localePath(locale, "/privacy") },
        ])}
      />
      <PageHero image="/images/tours/kansai-sakura-2026-04-08.jpg" title={c.title}>
        <Breadcrumb
          locale={locale}
          items={[{ label: dict.nav.home, href: "/" }, { label: dict.footer.privacy }]}
        />
      </PageHero>
      <section className="container-x py-14 lg:py-16">
        <GuideArticle blocks={c.blocks} locale={locale} waHref={waEnquiry(locale, "general", c.title)} />
      </section>
    </>
  );
}
