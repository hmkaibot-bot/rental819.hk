import type { Metadata } from "next";
import { pageAlternates } from "@/lib/seo";
import { isLocale, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import PageHero from "@/components/PageHero";
import GuideArticle from "@/components/GuideArticle";
import type { Block } from "@/lib/content/blocks";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return {
    alternates: pageAlternates(params.locale, "/privacy"),
    title: isEn ? "Privacy Policy" : "私隱政策",
    description: isEn
      ? "How RENTAL819 Hong Kong collects and uses your personal data."
      : "RENTAL819 香港如何收集及使用你的個人資料。",
  };
}

const content: Record<Locale, { title: string; blocks: Block[] }> = {
  "zh-hk": {
    title: "私隱政策",
    blocks: [
      { type: "p", text: `本私隱政策說明 RENTAL819 香港（頭盔王集團）如何收集、使用及保護你透過本網站提供的個人資料。` },
      { type: "h", text: "我們收集的資料" },
      { type: "p", text: "當你透過預約或查詢表格與我們聯絡時，我們可能會收集你的稱呼、電話／WhatsApp、電郵，以及你提供的行程需求（如地區、日期、車款、備註）。" },
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
      { type: "p", text: "When you contact us via the booking or enquiry form, we may collect your name, phone/WhatsApp, email and the trip details you provide (region, dates, bike preference, notes)." },
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
  const c = content[locale];
  return (
    <>
      <PageHero title={c.title} />
      <section className="container-x py-14 lg:py-16">
        <GuideArticle blocks={c.blocks} />
      </section>
    </>
  );
}
