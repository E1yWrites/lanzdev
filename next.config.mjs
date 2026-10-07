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