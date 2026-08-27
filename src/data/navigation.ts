import type { NavItem } from "@/types/navigation";

export const mainNav: NavItem[] = [
  { label: "PROJECTS", href: "/projects" },
  { label: "ABOUT", href: "/about" },
  { label: "DOWNLOADS", href: "/downloads" },
  { label: "DOCS", href: "/docs" },
  { label: "CONTACT", href: "/contact" },
];

export const rightNav: NavItem[] = [
  { label: "GITHUB", href: "https://github.com/E1yWrites", external: true },
  { label: "DOWNLOAD", href: "/downloads" },
];

export const footerNav = {
  projects: [
    { label: "Projects", href: "/projects" },
    { label: "Downloads", href: "/downloads" },
    { label: "Releases", href: "/releases" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "GitHub", href: "https://github.com/E1yWrites", external: true },
  ],
  about: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "License", href: "/license" },
  ],
};
