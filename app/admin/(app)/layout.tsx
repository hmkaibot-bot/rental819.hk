import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin/auth";
import { isDemoMode } from "@/lib/reservations/store";

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuthed()) redirect("/admin/login");
  const demo = isDemoMode();

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2 font-black text-brand-700">
            RENTAL<span className="text-accent-500">819</span>
            <span className="ml-1 text-xs font-semibold text-ink-muted">租車後台</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/admin" className="rounded-lg px-3 py-1.5 font-medium text-ink-soft hover:bg-slate-100">
              預約
            </Link>
            <form action="/api/admin/login" method="post">
              <input type="hidden" name="_method" value="delete" />
              <button
                formAction="/api/admin/logout"
                className="rounded-lg px-3 py-1.5 text-ink-muted hover:bg-slate-100"
              >
                登出
              </button>
            </form>
          </nav>
        </div>
        {demo && (
          <div className="bg-amber-50 px-4 py-1.5 text-center text-xs text-amber-800">
            示範模式（未連接資料庫）— 顯示的是範例資料，任何修改不會儲存。設定 Supabase 後即可正式使用。
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
