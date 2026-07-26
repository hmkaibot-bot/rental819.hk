import { ImageResponse } from "next/og";

// Branded 1200×630 share card, generated at build/request time. Text is kept
// Latin-only so it renders with the default font (no CJK font payload needed),
// while still carrying the brand and value proposition for WhatsApp/OG previews.
export const alt = "RENTAL819 — Japan motorcycle self-drive rentals & tours, booked from Hong Kong";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#004a8c",
          backgroundImage:
            "linear-gradient(135deg, #005bac 0%, #003a6d 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 30, letterSpacing: 2, opacity: 0.85 }}>
          HELMET KING&nbsp;&nbsp;×&nbsp;&nbsp;RENTAL819
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "baseline", fontSize: 132, fontWeight: 800, lineHeight: 1 }}>
            <span>RENTAL</span>
            <span style={{ color: "#ed0925" }}>819</span>
          </div>
          <div
            style={{
              width: 180,
              height: 12,
              marginTop: 20,
              backgroundColor: "#ed0925",
              borderRadius: 6,
            }}
          />
          <div style={{ marginTop: 34, fontSize: 44, fontWeight: 600, maxWidth: 900 }}>
            Japan motorcycle self-drive rentals &amp; guided tours
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 30, opacity: 0.9 }}>
          <span>Booked from Hong Kong · 99 branches across Japan</span>
          <span style={{ fontWeight: 700 }}>rental819.hk</span>
        </div>
      </div>
    ),
    size,
  );
}
