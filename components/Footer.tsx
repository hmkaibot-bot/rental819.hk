import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { buildNav, guidePages } from "@/lib/nav";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from "./icons";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const lp = (href: string) => localePath(locale, href);
  const primary = buildNav(dict).filter(
    (i) => !["/", "/guide"].includes(i.href),
  );
  const guides = guidePages(dict).slice(0, 6);
  const year = 2026;
  const isEn = locale === "en";
  const licenceLine = isEn
    ? `Guided tours & self-drive packages are operated by ${site.travelAgent.name} · Travel Agent Licence No. ${site.travelAgent.licence}.`
    : `自駕團及自駕套票由 ${site.travelAgent.name} 提供，旅行代理商牌照號碼：${site.travelAgent.licence}。`;

  return (
    <footer className="mt-24 border-t border-slate-100 bg-brand-950 text-brand-100">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Image
            src="/logo-lg.png"
            alt="RENTAL819 レンタルバイク"
            width={768}
            height={488}
            className="h-12 w-auto rounded-md"
          />
          <p className="mt-4 max-w-xs text-sm leading-6 text-brand-200">
            {dict.footer.about}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            {dict.footer.quickLinks}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {primary.map((item) => (
              <li key={item.href}>
                <Link
                  href={lp(item.href)}
                  className="text-brand-200 transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Guide links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            {dict.footer.guideLinks}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {guides.map((item) => (
              <li key={item.href}>
                <Link
                  href={lp(item.href)}
                  className="text-brand-200 transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            {dict.footer.contact}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-brand-200">
            <li>
              <span className="block text-xs uppercase tracking-wide text-brand-300">
                WhatsApp
              </span>
              <a href={whatsappLink()} className="transition hover:text-white">
                {site.phone}
              </a>
            </li>
            <li>
              <span className="block text-xs uppercase tracking-wide text-brand-300">
                {dict.footer.hours}
              </span>
              {dict.footer.hoursValue}
            </li>
          </ul>
        </div>
      </div>

      {/* Sister brands */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-brand-300 sm:flex-row sm:items-center">
          <span className="font-semibold uppercase tracking-wide text-brand-200">
            {dict.footer.sisterBrands}
          </span>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {site.sisters.map((b) => (
              <li key={b.url}>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  {b.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Travel-agency licence disclosure (HK Travel Agents Ordinance) */}
      <div className="border-t border-white/10">
        <div className="container-x py-4 text-xs leading-5 text-brand-300">
          {licenceLine}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-brand-300 sm:flex-row">
          <p>
            © {year} {site.name} HK. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <Link href={lp("/privacy")} className="hover:text-white">
              {dict.footer.privacy}
            </Link>
            <span className="text-brand-400">{dict.footer.partnership}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
