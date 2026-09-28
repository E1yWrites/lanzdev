import type { NavItem } from "@/types/navigation";

export const mainNav: NavItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "Downloads", href: "/downloads" },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const isActivePath = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

export const footerNav = {
  index: [
    { label: "Projects", href: "/projects" },
    { label: "Downloads", href: "/downloads" },
    { label: "Releases", href: "/releases" },
    { label: "Docs", href: "/docs" },
  ],
  studio: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "GitHub", href: "https://github.com/E1yWrites", external: true },
  ],
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "License", href: "/license" },
  ],
};
