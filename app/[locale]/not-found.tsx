import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-black text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold">頁面不存在 · Page not found</h1>
      <p className="mt-2 text-ink-muted">
        抱歉，找不到你要的頁面。 · Sorry, we couldn&apos;t find that page.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/zh-hk" className="btn-primary">
          返回首頁
        </Link>
        <Link href="/en" className="btn-outline">
          Back to home
        </Link>
      </div>
      <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <Link href="/zh-hk/rental" className="font-medium text-brand-700 hover:text-brand-800">
          日本租電單車
        </Link>
        <Link href="/zh-hk/guide" className="font-medium text-brand-700 hover:text-brand-800">
          自駕攻略
        </Link>
        <Link href="/zh-hk/booking" className="font-medium text-brand-700 hover:text-brand-800">
          預約查詢
        </Link>
        <Link href="/en/rental" className="font-medium text-brand-700 hover:text-brand-800">
          Rent in Japan (EN)
        </Link>
      </nav>
    </div>
  );
}
