import type { Dictionary } from "@/lib/dictionaries";

export interface NavItem {
  href: string; // path WITHOUT locale prefix, e.g. "/rental"
  label: string;
  children?: NavItem[];
}

/** Build the primary nav from a resolved dictionary. */
export function buildNav(d: Dictionary): NavItem[] {
  return [
    { href: "/", label: d.nav.home },
    { href: "/rental", label: d.nav.rental },
    { href: "/tours", label: d.nav.tours },
    { href: "/packages", label: d.nav.packages },
    {
      href: "/guide",
      label: d.nav.guide,
      children: [
        { href: "/guide/plan-trip", label: d.guideMenu.planTrip },
        { href: "/guide/route", label: d.guideMenu.route },
        { href: "/guide/how-many-days", label: d.guideMenu.howManyDays },
        { href: "/guide/budget", label: d.guideMenu.budget },
        { href: "/guide/fees", label: d.guideMenu.fees },
        { href: "/guide/insurance", label: d.guideMenu.insurance },
        { href: "/guide/etc", label: d.guideMenu.etc },
        { href: "/guide/traffic-rules", label: d.guideMenu.trafficRules },
        { href: "/guide/pickup", label: d.guideMenu.pickup },
      ],
    },
    { href: "/about", label: d.nav.about },
    { href: "/faq", label: d.nav.faq },
    { href: "/contact", label: d.nav.contact },
  ];
}

/** The ordered list of guide sub-pages (used for the guide index + prev/next). */
export function guidePages(d: Dictionary): NavItem[] {
  return buildNav(d).find((i) => i.href === "/guide")?.children ?? [];
}
