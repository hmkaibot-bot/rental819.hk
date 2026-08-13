import Image from "next/image";
import { redirect } from "next/navigation";
import { isAuthed, configError } from "@/lib/admin/auth";
import { getAdminDict } from "@/lib/admin/lang";

export default function AdminLogin({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  if (isAuthed()) redirect("/admin");
  const t = getAdminDict();
  // A misconfigured signing key makes every login throw. Say so here rather
  // than letting the operator meet a bare 500.
  const misconfigured = configError();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="text-center">
          <Image
            src="/logo-lg.png"
            alt="RENTAL819"
            width={450}
            height={285}
            priority
            className="mx-auto h-12 w-auto rounded-md"
          />
          <p className="mt-2 text-sm text-ink-muted">{t.login.subtitle}</p>
        </div>
        {misconfigured && (
          <p className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
            {misconfigured}
          </p>
        )}
        {searchParams.error && (
          <p className="mt-5 rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-700">
            {t.login.error}
          </p>
        )}
        <form action="/api/admin/login" method="post" className="mt-6 space-y-4">
          <input type="hidden" name="next" value={searchParams.next || "/admin"} />
          {/* Optional: the full admin signs in with the password alone, as it
              always has. Read-only accounts identify themselves here. */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              {t.login.account}
            </label>
            <input
              type="text"
              name="account"
              autoComplete="username"
              inputMode="email"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              placeholder={t.login.accountHint}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              {t.login.password}
            </label>
            <input
              type="password"
              name="password"
              autoFocus
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            {t.login.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
