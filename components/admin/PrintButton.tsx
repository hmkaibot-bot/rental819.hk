"use client";

export default function PrintButton({ label = "列印 / 儲存為 PDF" }: { label?: string }) {
  return (
    <button onClick={() => window.print()} className="btn-brand text-sm">
      {label}
    </button>
  );
}
