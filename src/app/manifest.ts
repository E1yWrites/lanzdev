import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.personalName} — ${siteConfig.name}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0D1016",
    theme_color: "#0D1016",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
