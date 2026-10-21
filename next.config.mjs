/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // www and the apex both served the site; send www to the canonical apex so search engines see one host.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lorenzmalabanan.com" }],
        destination: "https://lorenzmalabanan.com/:path*",
        permanent: true,
      },
      // PARADA's landing page was listed as its own project before the PARADA repo went public.
      { source: "/projects/parada-landing", destination: "/projects/parada", permanent: true },
      { source: "/projects/modpack-development", destination: "/projects", permanent: false },
    ];
  },
  // Vercel serves public/ files with max-age=0. These filenames aren't content-hashed, so a day plus
  // stale-while-revalidate: repeat visits skip the network, and a changed file shows within a day.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return ["art", "images", "models", "icons"].map((d) => ({ source: `/${d}/:path*`, headers: cache }));
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "user-attachments.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;