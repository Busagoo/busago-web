import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.airtableusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        // Los videos y posters son inmutables: el nombre cambia si cambia el
        // contenido, así que se pueden cachear un año en el borde y en el
        // navegador. Sin esto se revalidaban en cada visita.
        source: "/:dir(videos|hero-clips|logos)/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
