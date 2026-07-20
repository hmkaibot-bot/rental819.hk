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
  // Root → default locale. Handled at the routing layer (not Edge middleware),
  // so there is no middleware invocation that can fail at runtime.
  async redirects() {
    return [
      {
        source: "/",
        destination: "/zh-hk",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
