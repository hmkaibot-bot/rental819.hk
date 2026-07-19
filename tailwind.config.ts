import type { Config } from "tailwindcss";

/**
 * Rental819 HK design tokens.
 * Primary = Rental819 corporate blue (the logo mark).
 * Accent  = the racing red the HK site uses for CTAs (Helmet King energy).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // corporate blue
          50: "#eef6fd",
          100: "#d5e8fa",
          200: "#aed2f4",
          300: "#7bb4ea",
          400: "#4a91dd",
          500: "#1f72c9",
          600: "#005bac", // primary — matches the logo background
          700: "#01498a",
          800: "#063d70",
          900: "#0a355e",
          950: "#06213d",
        },
        accent: {
          // racing red (CTA)
          50: "#fff1f2",
          100: "#ffdfe1",
          200: "#ffc5c9",
          300: "#ff9da4",
          400: "#fb6470",
          500: "#f23543",
          600: "#ed0925", // CTA red
          700: "#c70a20",
          800: "#a40d1f",
          900: "#87121f",
          950: "#4a050c",
        },
        ink: {
          DEFAULT: "#1a1d21",
          soft: "#3a4149",
          muted: "#5e6d77",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-noto)",
          "system-ui",
          "-apple-system",
          "'PingFang HK'",
          "'Microsoft JhengHei'",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 6px 24px -8px rgba(6, 33, 61, 0.18)",
        cardhover: "0 16px 40px -12px rgba(6, 33, 61, 0.28)",
      },
      maxWidth: {
        content: "1200px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
