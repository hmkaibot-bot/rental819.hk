/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Existing brand assets still live on the WordPress origin during migration.
    remotePatterns: [
      { protocol: "https", hostname: "rental819.hk" },
      { protocol: "https", hostname: "rental819.com" },
    ],
  },
};

export default nextConfig;
