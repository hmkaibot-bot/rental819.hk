import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon, ArrowRight } from "./icons";

/** Bottom-of-page conversion band (Book / WhatsApp). */
export default function CTABand({
  locale,
  dict,
  title,
  subtitle,
  primaryHref,
  primaryLabel,
}: {
  locale: Locale;
  dict: Dictionary;
  title: string;
  subtitle: string;
  /** External URL (e.g. 26adventure.com) — overrides the default /booking link. */
  primaryHref?: string;
  primaryLabel?: string;
}) {
  const external = primaryHref?.startsWith("http");
  return (
    <section className="container-x">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-14 text-center text-white sm:px-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-600/40 blur-3xl" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-black sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">{subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {external ? (
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                {primaryLabel ?? dict.common.bookNow}
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <Link href={localePath(locale, primaryHref ?? "/booking")} className="btn-primary">
                {primaryLabel ?? dict.common.bookNow}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white text-brand-800 hover:bg-brand-50"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              {dict.common.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
