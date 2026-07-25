import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin/auth";

export default function AdminLogin({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  if (isAuthed()) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="text-center">
          <div className="text-2xl font-black text-brand-700">
            RENTAL<span className="text-accent-500">819</span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">租車管理後台</p>
        </div>
        {searchParams.error && (
          <p className="mt-5 rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-700">
            密碼錯誤，請再試。
          </p>
        )}
        <form action="/api/admin/login" method="post" className="mt-6 space-y-4">
          <input type="hidden" name="next" value={searchParams.next || "/admin"} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              管理密碼
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
            登入
          </button>
        </form>
      </div>
    </div>
  );
}
