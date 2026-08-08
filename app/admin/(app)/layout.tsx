import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed, canWrite } from "@/lib/admin/auth";
import { getAdminLang } from "@/lib/admin/lang";
import { adminDict } from "@/lib/admin/i18n";
import { isDemoMode } from "@/lib/reservations/store";
import LangToggle from "@/components/admin/LangToggle";

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuthed()) redirect("/admin/login");
  const readOnly = !canWrite();
  const demo = isDemoMode();
  const lang = getAdminLang();
  const t = adminDict(lang);

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo-lg.png" alt="RENTAL819" width={768} height={488} className="h-8 w-auto rounded" />
            <span className="text-xs font-semibold text-ink-muted">{t.nav.badge}</span>
            {readOnly && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                {t.nav.viewerBadge}
              </span>
            )}
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/admin" className="rounded-lg px-3 py-1.5 font-medium text-ink-soft hover:bg-slate-100">
              {t.nav.reservations}
            </Link>
            <Link href="/admin/accounting" className="rounded-lg px-3 py-1.5 font-medium text-ink-soft hover:bg-slate-100">
              {t.nav.accounting}
            </Link>
            <Link href="/admin/items" className="rounded-lg px-3 py-1.5 font-medium text-ink-soft hover:bg-slate-100">
              {t.nav.feeItems}
            </Link>
            <LangToggle lang={lang} ariaLabel={t.nav.langAria} />
            <form action="/api/admin/login" method="post">
              <input type="hidden" name="_method" value="delete" />
              <button
                formAction="/api/admin/logout"
                className="rounded-lg px-3 py-1.5 text-ink-muted hover:bg-slate-100"
              >
                {t.nav.logout}
              </button>
            </form>
          </nav>
        </div>
        {readOnly && (
          <div className="bg-amber-50 px-4 py-1.5 text-center text-xs text-amber-800">
            {t.nav.viewerNotice}
          </div>
        )}
        {demo && (
          <div className="bg-amber-50 px-4 py-1.5 text-center text-xs text-amber-800">
            {t.nav.demo}
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
