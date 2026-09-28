/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
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